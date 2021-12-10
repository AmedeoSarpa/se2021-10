import { XCircleFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';


const NotAuthorizedPage = () => {

    return (
        <Container fluid className="below-nav shzFullHeight d-flex align-items-center justify-content-center">
            <div>
                <XCircleFill className="mr-1" size="120" />
                <h1>You are not authorized!</h1>
                <Link to="/">
                    <Button varian='outline-primary'>
                        Go Home
                    </Button>
                </Link>
            </div>
        </Container>
    )
}

export default NotAuthorizedPage;