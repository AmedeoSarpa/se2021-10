import { Search } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';


const NotFoundPage = () => {

    return (
        <Container fluid className="below-nav shzFullHeight d-flex align-items-center justify-content-center">
            <div>
                <Search className="mr-1" size="120" />
                <h1>404 - Not Found!</h1>
                <Link to="/">
                    <Button varian='outline-primary'>
                        Go Home
                    </Button>
                </Link>
            </div>
        </Container>
    )
}

export default NotFoundPage;