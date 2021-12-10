import { Button, Nav, Navbar, NavItem } from "react-bootstrap";
import { Link } from "react-router-dom";
import { userIcon, logoIcon } from "./components/Icons";

function MyNavbar(props) {
  return (
    <Navbar bg='primary' variant='dark'>
      <Nav.Item>
        <Link to={"/"}>
          {" "}
          <Navbar.Brand> &nbsp;Queue Office Management</Navbar.Brand>{" "}
        </Link>
      </Nav.Item>

      {props.loggedIn ? (
        <Nav.Item className='ml-auto mr-3 text-white'>
          <Link to={"/"}>
            <Button
              onClick={() => {
                props.closeMessage();
                props.doLogOut();
              }}>
              Logout
            </Button>{" "}
          </Link>
        </Nav.Item>
      ) : (
        <Nav.Item className='ml-auto mr-3 text-white'>
          <Link to='login'>
            <Button> {userIcon} Login </Button>{" "}
          </Link>
        </Nav.Item>
      )}
    </Navbar>
  );
}

export default MyNavbar;
