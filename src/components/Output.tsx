import { useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

type Props = {
  logs: string;
};

export function LogsOutput(props: Props) {
  const { logs } = props;

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = textAreaRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <>
      <Container>
        <FloatingLabel controlId="logsTextArea" label="Logs">
          <Form.Control
            ref={textAreaRef}
            as="textarea"
            style={{ height: "500px" }}
            value={logs}
            readOnly
          />
        </FloatingLabel>
      </Container>
    </>
  );
}
