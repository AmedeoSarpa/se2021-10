import { ListGroup, Button, ListGroupItem } from "react-bootstrap";


function OfficerPage(props) {
    return (
        <>
            <h1>Officer</h1>
            <ListGroup className="pt-4">

                <ListGroup.Item className="pt-2">
                    <h2>Counter Number:</h2>
                    <h4>{props.counterId}</h4>
                </ListGroup.Item >
                <ListGroup.Item className="pt-4">
                    <h2>Services Offered:</h2>
                </ListGroup.Item>
                <ListGroup >{
                    props.counterService.filter(t => t.counterId === props.counterId).map((t,index) =>
                        <ListGroupItem key={index}>
                            <h4>Service n. : {t.serviceId}</h4>
                            <h4>Service type : {props.services.filter(s => t.serviceId === s.id)[0].description}</h4>
                        </ListGroupItem>
                    )
                }
                </ListGroup>
            </ListGroup>
            <div className="d-grid gap-2 pt-4">
                <Button className="btn btn-primary btn-lg btn-block" onClick={() => { props.processRequest(props.counterId) }}>NEXT CLIENT</Button>
            </div>
        </>
    )
}

export { OfficerPage };