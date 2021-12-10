import { Row, Col, Card, Container, Spinner } from "react-bootstrap";

function Display(props) {
  return (
    <>
      <Card body>
        <Card body>
          {!!props.counterCall.counterId ? (
            <>
              <Row className='justify-content-center'>
                <h2> Now serving </h2>
              </Row>
              <Row className='justify-content-center'>
                <h2> Counter {props.counterCall.counterId} : </h2>
              </Row>
              <Row className='justify-content-center'>
                <h1>{props.counterCall.idTicket} </h1>
              </Row>
            </>
          ) : (
            <Row className='justify-content-center'>
              <h1> Nobody to call </h1>
            </Row>
          )}
        </Card>

        <Card body className='justify-content-center mt-3'>
          <Row className='justify-content-center'>Waiting list</Row>
          <Row>
            <Col> Service ID </Col> <Col> Description</Col>
            <Col> Queue Lenght</Col>
          </Row>

          {props.isQueueLoading ? (
            <Container>
              <Spinner animation='border' variant='primary'></Spinner>
            </Container>
          ) : (
            <>
              {props.services.map((t) => (
                <Row className='block-example border-top border-dark'>
                  <Col> S{t.id} </Col> <Col> {t.description} </Col>
                  <Col>
                    {
                      props.queues.filter(
                        (k) => k.idService === t.id && k.processed === 0
                      ).length
                    }
                  </Col>
                </Row>
              ))}
            </>
          )}
        </Card>
      </Card>
    </>
  );
}

export { Display };
