import { React, useState, useEffect } from "react";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { TypeUnderline, UmbrellaFill } from "react-bootstrap-icons";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import MyNavbar from "./MyNavbar";
import { LoginForm } from "./LoginComponents";
import { OfficerPage } from "./Officer";
import { Display } from "./Display";
import { ClientPage } from "./Client";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import API from "./API";
import NotFoundPage from "./components/NotFoundPage";
import { isObject } from "./components/Utility";

const App = () => {
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [estimatedWaitingTime, setEstimatedWaitingTime] = useState(-1);
  const [loggedIn, setLoggedIn] = useState(false);
  const [counterId, setCounterId] = useState(2); //id counter loggato, settao ad 1 per fare debug
  const [services, setServices] = useState([
    {
      id: 1,
      timeForPerson: 3,
      description: "send a package",
      name: "service1",
    },
    { id: 2, timeForPerson: 5, description: "send a mail", name: "service2" },
    { id: 3, timeForPerson: 4, description: "send money", name: "service3" },
    { id: 4, timeForPerson: 8, description: "receive money", name: "service4" },
  ]); //servizi
  const [queues, setQueues] = useState([
    /*{ idTicket: 0, idService: 1, processed: 1, counterId: 1 },
    { idTicket: 1, idService: 2, processed: 0, counterId: 2 },
    { idTicket: 2, idService: 2, processed: 0, counterId: 2 },
    { idTicket: 3, idService: 3, processed: 0, counterId: 1 },
    { idTicket: 4, idService: 3, processed: 0, counterId: 1 },
    { idTicket: 5, idService: 4, processed: 0, counterId: 1 },*/
  ]); //richiesta di un servizio
  const [counterService, setCounterService] = useState([
    /*{ counterId: 1, serviceId: 1 },
    { counterId: 2, serviceId: 2 },
    { counterId: 1, serviceId: 3 },
    { counterId: 1, serviceId: 4 },
    { counterId: 1, serviceId: 2 },
    { counterId: 2, serviceId: 3 },
    { counterId: 2, serviceId: 4 },*/
  ]); //servizioOffertoDaiCounter
  const [counterCall, setCounterCall] = useState({ counterId: undefined, idTicket: undefined });

  const [booked, setBooked] = useState();
  const [ticketNumber, setTicketNumber] = useState(-1);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const _user = await API.getUserInfo();
        setUser(_user);
        setLoggedIn(true);
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => { }, [message]);

  //Calcolo tempo stimato per un dato servizio
  const computeEstimatedWaitingTime = (idService) => {
    let tr = services
      .filter((t) => t.id === idService)
      .map((t) => t.timeForPerson);
    let nr = queues.filter(
      (t) => t.processed === 0 && t.idService === idService
    ).length;
    let sum = 0;
    for (let c of counterService.filter((t) => t.serviceId === idService)) {
      sum +=
        1 / counterService.filter((t) => t.counterId === c.counterId).length;
    }
    return Number(sum).toFixed(1);
  };

  // Processa la richiesta di un Officer per il prossimo cliente sulla base dei servizi che può offrire
  const processRequest = (counterId) => { //AGGIUNGERE API
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
      if (currentLength > maxLength || (currentLength == maxLength && currentTime < minTime)) {
        minTime = currentTime;
        maxLength = currentLength;
        idServiceToServe = id;
      }
    }

    let arrayServiceWaiting = queues
      .filter((t) => t.idService === idServiceToServe && t.processed == 0)
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
  };

  const addRequestQueue = async (idService) => {
    try {
      const idNewTicket = await API.addRequest(idService);
      setMessage({ msg: `Request sent!`, type: 'success' });
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
    }
    catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const doLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setUser(user);
      setCounterId(user.counter_id)
      setMessage({ msg: `Welcome, ${user.name}!`, type: "success" });
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
      {message !== '' ? <Alert variant={message.type} onClose={closeMessage} dismissible> {message.msg} </Alert>  : <></>}
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
                            <Container className='d-flex justify-content-center mt-3'>
                              <ClientPage
                                services={services}
                                queues={queues}
                                addRequestQueue={addRequestQueue}
                                booked={booked}
                                idTicket={ticketNumber}
                                counterService={counterService}
                                estimatedWaitingTime={estimatedWaitingTime}
                              />
                            </Container>{" "}
                          </>
                        )}
                      </Col>
                      <Col xs={8}>
                        <Display
                          counterCall={counterCall}
                          services={services}
                          queues={queues}
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
