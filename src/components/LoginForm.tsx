import { type ChangeEvent, type FormEvent, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { AuthenticationResponse } from "../services/Bsky";
import { Response } from "../services/EasyFetch";

type Props = {
  authenticate: (
    handle: string,
    password: string
  ) => Promise<Response<AuthenticationResponse>>;
  setAuthenticated: (boolean) => void;
};

export function LoginForm(props: Props) {
  const { authenticate, setAuthenticated } = props;

  const [formData, setFormData] = useState({
    handle: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    authenticate(formData.handle.trim(), formData.password.trim())
      .then((res) => {
        if (res.data) {
          sessionStorage.setItem("session", JSON.stringify(res.data));
          setAuthenticated(true);
        } else {
          setError(res.error?.message || res.error);
          sessionStorage.removeItem("session");
          setAuthenticated(false);
        }
      })
      .catch(({ error }) => {
        setError(error?.message || error);
        sessionStorage.removeItem("session");
        setAuthenticated(false);
      });
  };

  return (
    <Container className="mb-5">
      <Form onSubmit={submitForm}>
        <Row>
          <Col>
            <Form.Label htmlFor="password">Bluesky handle</Form.Label>
            <InputGroup className="mb-3">
              <InputGroup.Text id="handle-addon">@</InputGroup.Text>
              <Form.Control
                id="handle"
                placeholder="Bluesky handle"
                aria-label="Bluesky handle"
                aria-describedby="handle-addon"
                onChange={handleInputChange}
              />
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Label htmlFor="password">App password</Form.Label>
            <Form.Control
              id="password"
              type="password"
              onChange={handleInputChange}
            />
          </Col>
        </Row>
        <br />
        {error && <Alert variant={"warning"}>{error}</Alert>}
        <Row>
          <Col>
            <Button type="submit">Login</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}
