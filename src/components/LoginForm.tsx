import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import { connect, ConnectedProps } from "react-redux";
import { clearError } from "../redux/modules/app/actions";
import { getErrorNotification } from "../redux/modules/app/selectors";
import { init, login } from "../redux/modules/user/actions";
import {
  isAuthorized,
  isUserInitialized,
  isUserLoading,
} from "../redux/modules/user/selectors";
import { LoginPayload } from "../redux/modules/user/type";

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function LoginFormComponent(props: Props) {
  const {
    isAuthorized,
    isLoading,
    isInitialized,
    login,
    init,
    errorNotification,
    clearError,
  } = props;

  useEffect(() => {
    if (!isAuthorized && !isInitialized) init();
  }, [isAuthorized, isInitialized]);

  const [formData, setFormData] = useState({
    handle: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    login(formData);
  };

  if (!isAuthorized || !isInitialized) {
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
          {errorNotification && (
            <Alert variant={"warning"} className="mt-3">
              {errorNotification}
            </Alert>
          )}
          <Row className="mt-3">
            <Col>
              <Button type="submit" disabled={isLoading}>
                Login
                {isLoading && (
                  <Spinner animation="border" size="sm" className="ms-2" />
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    );
  }

  return null;
}

const mapStateToProps = (store) => ({
  errorNotification: getErrorNotification(store),
  isAuthorized: isAuthorized(store),
  isLoading: isUserLoading(store),
  isInitialized: isUserInitialized(store),
});

const mapDispatchToProps = (dispatch) => ({
  init: () => dispatch(init()),
  login: (payload: LoginPayload) => dispatch(login(payload)),
  clearError: () => dispatch(clearError()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export const LoginForm = connector(LoginFormComponent);
