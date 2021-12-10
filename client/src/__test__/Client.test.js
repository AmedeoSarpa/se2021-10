//UNIT TEST 

//Configuration Enzyme
import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
Enzyme.configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
import toJson from 'enzyme-to-json'
//Test every function in Officer.js 
import { ClientPage } from '../Client';
const counterId = 2;
const services = [{
    id: 1,
    timeForPerson: 3,
    description: "send a package",
    name: "service1",
},
{ id: 2, timeForPerson: 5, description: "send a mail", name: "service2" },
{ id: 3, timeForPerson: 4, description: "send money", name: "service3" },
{ id: 4, timeForPerson: 8, description: "receive money", name: "service4" }
]; //servizi

const counterService = [
    { counterId: 1, serviceId: 1 },
    { counterId: 2, serviceId: 2 },
    { counterId: 1, serviceId: 3 },
    { counterId: 1, serviceId: 4 },
    { counterId: 1, serviceId: 2 },
    { counterId: 2, serviceId: 3 },
    { counterId: 2, serviceId: 4 }
]; //servizioOffertoDaiCounter

const queues = [
    { idTicket: 0, idService: 1, processed: 1, counterId: 1 },
    { idTicket: 1, idService: 2, processed: 0, counterId: 2 },
    { idTicket: 2, idService: 2, processed: 0, counterId: 2 },
    { idTicket: 3, idService: 3, processed: 0, counterId: 1 },
    { idTicket: 4, idService: 3, processed: 0, counterId: 1 },
    { idTicket: 5, idService: 4, processed: 0, counterId: 1 }
]; //richiesta di un servizio

const counterCall = {
    counterId: 1,
    idTicket: 0,
};

const estimatedWaitingTime = 0;
const isServiceListLoading = true;
const isQueueLoading = true;
const booked = false;
const ticketNumber = -1;

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


it("renders client without crashing given the required props", () => {
    const wrapper = shallow(<ClientPage
        counterCall={counterCall}
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
        } />)
    expect(toJson(wrapper)).toMatchSnapshot()
})


it("Client Page props passed correctly", () => {
    const wrapper = mount(<ClientPage
        services={services}
        queues={queues}
        addRequestQueue={addRequestQueue}
        booked={booked}
        counterCall={counterCall}
        idTicket={ticketNumber}
        counterService={counterService}
        estimatedWaitingTime={estimatedWaitingTime}
        isServiceListLoading={isServiceListLoading}
        computeEstimatedWaitingTime={
            computeEstimatedWaitingTime
        } />);

    expect(wrapper.props().services).toEqual(services);
    expect(wrapper.props().queues).toEqual(queues);
    expect(wrapper.props().counterService).toEqual(counterService);
    expect(wrapper.props().addRequestQueue).toEqual(addRequestQueue);
    expect(wrapper.props().booked).toEqual(booked);
    expect(wrapper.props().idTicket).toEqual(ticketNumber);
    expect(wrapper.props().counterCall).toEqual(counterCall);
    expect(wrapper.props().estimatedWaitingTime).toEqual(estimatedWaitingTime);
    expect(wrapper.props().isServiceListLoading).toEqual(isServiceListLoading);
    expect(wrapper.props().computeEstimatedWaitingTime).toEqual(computeEstimatedWaitingTime);

});


