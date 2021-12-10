import { Toast } from "react-bootstrap";

function ErrorToast(props) {
  return (
    <Toast
      onClose={props.onClose}
      show={props.show}
      delay={props.delay}
      autohide={props.autohide}>
      <Toast.Header>
        <strong className='ml-2 mr-auto'>Server Error</strong>
      </Toast.Header>
      <Toast.Body>{props.errorMessage}</Toast.Body>
    </Toast>
  );
}

export default ErrorToast;
