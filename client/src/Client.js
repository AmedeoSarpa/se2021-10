import { ListGroup, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { ticketIcon } from "./components/Icons";

function ClientPage(props) {
  return (
    <>
      <main className='below-nav right-space left-space'>
        {!props.booked ? (
          <>
            <h3> Services</h3>
            <Row>
              {" "}
              <Col> Service </Col>
              <Col> Description </Col>
              <Col> Estimated waiting time per person (minutes)</Col>{" "}
              <Col>Request</Col>{" "}
            </Row>{" "}
            <Row>
              {props.isServiceListLoading ? (
                <Col className=''>
                  <Spinner animation='border' variant='primary'></Spinner>
                </Col>
              ) : (
                ""
              )}
            </Row>
            <ListGroup variant='flush'>
              {props.services.map((t) => (
                <ClientRow
                  key={t.id}
                  id={t.id}
                  name={t.name}
                  timeForPerson={props.computeEstimatedWaitingTime(t.id)}
                  description={t.description}
                  addRequestQueue={props.addRequestQueue}
                />
              ))}
            </ListGroup>{" "}
          </>
        ) : (
          <>
            <h2>Your ticket : </h2>{" "}
            <Card body className='text-white bg-primary mb-3'>
              <Row className='block-example border-bottom border-dark'>
                {" "}
                <h3> Ticket number : {props.idTicket} </h3>
              </Row>
              <h3> Service: S{props.booked} </h3>
              <h3> Estimated time : {props.estimatedWaitingTime} min </h3>{" "}
            </Card>
          </>
        )}
      </main>
    </>
  );
}

function ClientRow(props) {
  return (
    <ListGroup.Item>
      <Row>
        {" "}
        <Col> {props.name} </Col>
        <Col> {props.description}</Col>
        <Col> {props.timeForPerson} </Col>{" "}
        <Col>
          <Button
            className='text-white'
            onClick={() => {
              props.addRequestQueue(props.id);
            }}>
            {" "}
            {ticketIcon}{" "}
          </Button>{" "}
        </Col>{" "}
      </Row>{" "}
    </ListGroup.Item>
  );
}

export { ClientPage };
