import { useState } from "react";
import { Form, Button, Row, Col } from 'react-bootstrap';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    // SOME VALIDATION, ADD MORE!!!
    let valid = true;
    if (username === '' || password === '') //nessun vincolo sulla password 
      valid = false;

    if (valid) {
      setErrorMessage('');
      props.login(credentials);
    }
    else {
      setErrorMessage('Username and/or password incorrect');
    }
  };

  return (
    <Form>
      {/* {props.message !== '' ? <Alert variant={props.message.type} onClose={props.closeMessage} dismissible> {props.message.msg} </Alert> : <></>}
      {errorMessage !== '' ? <Alert variant='danger'>{errorMessage}</Alert> : ''} */}
      <Row>
        <Col sm={8}>
          <Form.Group controlId='username'>
            <Form.Label>username</Form.Label>
            <Form.Control type='text' value={username} onChange={ev => setUsername(ev.target.value)} />
          </Form.Group>
        </Col>
        <Col sm={8}>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
          </Form.Group>
        </Col>
      </Row>
      <br />
      <Button onClick={handleSubmit}>Login</Button>

    </Form>
  )
}

export { LoginForm };

