import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export function SearchInput() {
  return (
    <Container className="search-input-container">
      <Row className="search-input">
        <Col>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Link to post"
            id="linkToPost"
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            id="includeLikes"
            label="Include users who like this post"
          />
          <Form.Check
            type="checkbox"
            id="includeReposts"
            label="Include users who reposted this post"
          />
          <Form.Check
            type="checkbox"
            id="includeAuthorFollowers"
            label="Include the author's followers"
          />
          <Form.Check
            type="checkbox"
            id="includeLikesFollowers"
            label="Include followers of users who like this post (slow!)"
          />
          <Form.Check
            type="checkbox"
            id="includeRepostFollowers"
            label="Include followers of users who reposted this post (slow!)"
          />
          <Form.Check
            type="checkbox"
            id="repeatForAuthor"
            label="Repeat this action for the author's next 100 posts (slow!)"
          />
        </Col>
      </Row>
    </Container>
  );
}
