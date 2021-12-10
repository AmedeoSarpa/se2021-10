import { React, useState, useEffect } from "react";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import MyNavbar from "./MyNavbar";
import { LoginForm } from "./components/Login";
import { OfficerPage } from "./Officer";
import { Display } from "./Display";
import { ClientPage } from "./Client";
import ErrorToast from "./components/ErrorToast";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import API from "./API";

const App = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [estimatedWaitingTime, setEstimatedWaitingTime] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [counterId, setCounterId] = useState(0); //id counter loggato, settao ad 1 per fare debug
  const [services, setServices] = useState([]); //servizi
  const [isServiceListLoading, setIsServerListLoading] = useState(true);
  const [isQueueLoading, setIsQueueLoading] = useState(true);
  const [serverClientErrorMessage, setServerClientErrorMessage] =
    useState(null);
  const [serverDisplayErrorMessage, setServerDisplayErrorMessage] =
    useState(null);

  /*{ idTicket: 0, idService: 1, processed: 1, counterId: 1 } */
  const [queues, setQueues] = useState([]); //richiesta di un servizio
  /*{ counterId: 1, serviceId: 1 },*/
  const [counterService, setCounterService] = useState([]); //servizioOffertoDaiCounter

  const [counterCall, setCounterCall] = useState({
    counterId: undefined,
    idTicket: undefined,
  });
  const [boolVar, setBoolVar] = useState(false);
  const [booked, setBooked] = useState();
  const [ticketNumber, setTicketNumber] = useState(-1);

  /** POOLING */
  useEffect(() => {
    const loadSystem = async () => {
      const loadQueues = () => {
        let loadQ = API.getQueue();
        loadQ
          .then((q) => {
            setQueues(q);
            setIsQueueLoading(false);
          })
          .catch((e) => {
            setQueues([]);
            setServerDisplayErrorMessage(
              "Server error: couldn't load Display informations. Retrying in 5 sec..."
            );
            setIsQueueLoading(true);
            setTimeout(loadQueues, 5500);
          });
      };
      loadQueues();
      try {
        setCounterCall(await API.getServingTicket(true));
      } catch (err) {
        console.log(err);
      }
    };

    loadSystem();
  }, [boolVar, counterCall.counterId]);

  const timer = setTimeout(() => {
    setBoolVar(!boolVar);
  }, 5000);

  /** ONE TIME */
  useEffect(() => {
    const loadSystem = async () => {
      try {
        const _user = await API.getUserInfo();
        setUser(_user);
        setLoggedIn(true);
        setCounterId(_user.counter_id);
      } catch (err) {
        setUser(null);
      }

      try {
        setCounterService(await API.getCounterServices());
      } catch (err) {
        setCounterService([]);
      }
    };

    loadSystem();

    const loadServices = () => {
      let loadServ;

      loadServ = API.getServices();
      loadServ
        .then((s) => {
          setServices(s);
          setIsServerListLoading(false);
        })
        .catch((e) => {
          console.log(e);
          setServerClientErrorMessage(
            "Server error: couldn't load Services list. Retrying in 5 sec..."
          );

          setTimeout(loadServices, 5500);
        });
    };
    loadServices();
  }, []);

  //Calcolo tempo stimato per un dato servizio
  const computeEstimatedWaitingTime = (idService) => {
    let tr = services
      .filter((t) => t.id === idService)
      .map((t) => t.timeForPerson)[0];

    let nr = queues.filter(
      (t) => t.processed === 0 && t.idService === idService
    ).length;

    let sum = 0;
    for (let c of counterService.filter((t) => t.serviceId === idService)) {
      sum +=
        1 / counterService.filter((t) => t.counterId === c.counterId).length;
    }
    let val = tr * (nr / sum + 0.5);
    return Number(val).toFixed(1);
  };

  // Processa la richiesta di un Officer per il prossimo cliente sulla base dei servizi che può offrire
  const processRequest = async (counterId) => {
    const { ticketID, counterID } = await API.getNextClient(user.id, true);

    if (!!ticketID) {
      setCounterCall({ counterId: counterID, idTicket: ticketID });

      const newQueue = queues.filter((x) => {
        return x.idTicket !== ticketID;
      });

      setQueues(newQueue);
    } else {
      setMessage({ msg: "No number to call", type: "success" });
      setCounterCall({ counterId: counterId, idTicket: counterCall.idTicket });
    }
    /*
        //prendere servizi di questo counter , prendere le relative stime e le code
        let servicesId = counterService
          .filter((t) => t.counterId === counterId)
          .map((t) => t.serviceId);
        let maxLength = 0;
        let idServiceToServe = 0;
        let minTime = Infinity;
        let currentTime = 0;
        let currentLength = -1;
        //Per ogni servizio, viene valutata la lunghezza della coda, nel caso risulti essere quella più lunga, viene selezionato il primo numero 
        //disponibile. Il tempo viene utilizzato nel caso due code hanno la stessa lunghezza, viene presa quella con minor tempo.
        for (let id of servicesId) {
          currentTime = services
            .filter((t) => t.id === id)
            .map((t) => t.timeForPerson)[0];
          currentLength = queues.filter(
            (k) => k.idService === id && k.processed === 0
          ).length;
          //Aggiorno i dati o quando ho la cosa più lunga o quando ne ho trovate due uguali(in tal caso deve avere anche tempo più basso rispetto 
          //alla precedente altrimenti non aggiorno e prendo quella di prima)
          if (currentLength > maxLength || (currentLength === maxLength && currentTime < minTime)) {
            minTime = currentTime;
            maxLength = currentLength;
            idServiceToServe = id;
          }
        }
    
        let arrayServiceWaiting = queues
          .filter((t) => t.idService === idServiceToServe && t.processed === 0)
          .map((t) => t.idTicket);
        let idTicketToServe = Math.min(...arrayServiceWaiting);
        setQueues((oldList) => {
          const list = oldList.map((item) => {
            if (item.idTicket === idTicketToServe) {
              return {
                idTicket: item.idTicket,
                processed: 1,
                idService: item.idService,
                counterId: item.counterId,
              };
            } else return item;
          });
          return list;
        });
        //console.log(queues);
        setCounterCall({ counterId: counterId, idTicket: idTicketToServe });
        */
  };

  const addRequestQueue = async (idService) => {
    try {
      const idNewTicket = await API.addRequest(idService);
      setMessage({ msg: "Request sent!", type: "success" });
      console.log(message);
      setTicketNumber(idNewTicket);
      const estimation = computeEstimatedWaitingTime(idService);
      setEstimatedWaitingTime(estimation);
      const newRequest = {
        idService: idService,
        processed: 0,
        idTicket: idNewTicket,
      };
      setQueues((old) => [...old, newRequest]);
      setBooked(newRequest.idService);
    } catch (err) {
      setMessage({ msg: err.error, type: "danger" });
    }
  };

  const doLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setCounterId(user.counter_id);
      setMessage({ msg: "Welcome, " + user.name, type: "success" });
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
  };

  const closeMessage = () => {
    setMessage("");
  };

  return (
    <Router>
      <MyNavbar
        doLogOut={doLogOut}
        loggedIn={loggedIn}
        closeMessage={closeMessage}
      />
      <Container fluid className='vh-100 mt-3  '>
        {message !== "" ? (
          <Alert variant={message.type} onClose={closeMessage} dismissible>
            {" "}
            {message.msg}{" "}
          </Alert>
        ) : (
          <></>
        )}
        <Row className='below-nav vh-100'>
          <Switch>
            <Route
              exact
              path='/login'
              render={() => (
                <Container fluid className='justify-content-center d-flex'>
                  <Row className='vh-100vh'>
                    {loggedIn ? (
                      <Redirect to='/officer' />
                    ) : (
                      <LoginForm
                        closeMessage={closeMessage}
                        message={message}
                        login={doLogin}
                      />
                    )}
                  </Row>
                </Container>
              )}
            />

            <Route
              exact
              path='officer'
              render={() => (
                <Container fluid className='p-4'>
                  <Row>
                    <Col xs={4}>
                      {loggedIn ? (
                        <OfficerPage
                          services={services}
                          queues={queues}
                          counterService={counterService}
                          processRequest={processRequest}
                          counterId={counterId}
                        />
                      ) : (
                        <Redirect to='/login' />
                      )}
                    </Col>
                    <Col xs={8}>
                      <Display
                        counterCall={counterCall}
                        services={services}
                        queues={queues}
                        isQueueLoading={isQueueLoading}
                      />
                    </Col>
                  </Row>
                </Container>
              )}
            />

            <Route
              path='/'
              render={() => (
                <>
                  <Container fluid className='vh-100'>
                    <Row>
                      <Col xs={4}>
                        {loggedIn ? (
                          <>
                            <OfficerPage
                              services={services}
                              queues={queues}
                              counterService={counterService}
                              processRequest={processRequest}
                              counterId={counterId}
                            />
                          </>
                        ) : (
                          <>
                            {" "}
                            <Row>
                              <ErrorToast
                                className='justify-content-center'
                                errorMessage={serverClientErrorMessage}
                                autohide
                                show={serverClientErrorMessage !== null}
                                delay='5000'
                                onClose={() =>
                                  setServerClientErrorMessage(null)
                                }></ErrorToast>
                            </Row>
                            <Container className='d-flex justify-content-center mt-3'>
                              <Row>
                                <ClientPage
                                  services={services}
                                  queues={queues}
                                  addRequestQueue={addRequestQueue}
                                  booked={booked}
                                  idTicket={ticketNumber}
                                  counterService={counterService}
                                  estimatedWaitingTime={estimatedWaitingTime}
                                  isServiceListLoading={isServiceListLoading}
                                  computeEstimatedWaitingTime={
                                    computeEstimatedWaitingTime
                                  }
                                />
                              </Row>
                            </Container>{" "}
                          </>
                        )}
                      </Col>
                      <Col xs={8}>
                        <ErrorToast
                          className='justify-content-center'
                          errorMessage={serverDisplayErrorMessage}
                          autohide
                          show={serverDisplayErrorMessage !== null}
                          delay='5000'
                          onClose={() =>
                            setServerDisplayErrorMessage(null)
                          }></ErrorToast>
                        <Display
                          counterCall={counterCall}
                          services={services}
                          queues={queues}
                          isQueueLoading={isQueueLoading}
                        />
                      </Col>
                    </Row>
                  </Container>
                </>
              )}
            />
          </Switch>
        </Row>
      </Container>
    </Router>
  );
};

export default App;
