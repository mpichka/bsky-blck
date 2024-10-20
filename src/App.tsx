import { type MutableRefObject, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { LoginForm } from "./components/LoginForm";
import { LogoutButton } from "./components/LogoutButton";
import { LogsOutput } from "./components/Output";
import { SearchInput, SearchInputFormData } from "./components/SearchInput";
import { Bsky } from "./services/Bsky";

export default function App() {
  const bskyRef: MutableRefObject<Bsky> = useRef(new Bsky());

  const [isAuthenticated, setAuthenticated] = useState(
    Boolean(sessionStorage.getItem("session"))
  );

  const handleChainBlock = (formData: SearchInputFormData) => {
    console.log(formData);
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary mb-5" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Bluesky blockchain ⛓</Navbar.Brand>
          {isAuthenticated && (
            <Row>
              <Col>
                <LogoutButton
                  isAuthenticated={isAuthenticated}
                  setAuthenticated={setAuthenticated}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Navbar>

      {!isAuthenticated && (
        <LoginForm
          authenticate={bskyRef.current.authenticate}
          setAuthenticated={setAuthenticated}
        />
      )}

      <SearchInput
        onSubmit={handleChainBlock}
        isAuthenticated={isAuthenticated}
      />
      <LogsOutput />
    </div>
  );
}
