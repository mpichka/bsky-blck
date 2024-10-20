import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export function LogsOutput() {
  return (
    <>
      <Container>
        <FloatingLabel controlId="logsTextArea" label="Logs">
          <Form.Control as="textarea" style={{ height: "500px" }} />
        </FloatingLabel>
      </Container>
    </>
  );
}
