import { type ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export interface SearchInputFormData {
  linkToPost: string;
  includeLikes: boolean;
  includeReposts: boolean;
  includeAuthorFollowers: boolean;
  includeLikesFollowers: boolean;
  includeRepostFollowers: boolean;
  repeatForAuthor: boolean;
  createBlockList: boolean;
}

type Props = {
  isAuthenticated: boolean;
  onSubmit: (formData: SearchInputFormData) => void;
};

export function SearchInput(props: Props) {
  const { isAuthenticated, onSubmit } = props;

  const [formData, setFormData] = useState<SearchInputFormData>({
    linkToPost: "",
    includeLikes: false,
    includeReposts: false,
    includeAuthorFollowers: false,
    includeLikesFollowers: false,
    includeRepostFollowers: false,
    repeatForAuthor: false,
    createBlockList: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleCheckChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      [id]: checked,
    });
  };

  return (
    <Container className="mb-4">
      <Row className="mb-4">
        <Col>
          <Form.Control
            size="lg"
            type="text"
            placeholder="Link to post"
            id="linkToPost"
            onChange={handleInputChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Check
            type="checkbox"
            id="includeAuthorFollowers"
            label="Include the author's followers"
            onChange={handleCheckChange}
          />
          <Form.Check
            type="checkbox"
            id="includeLikes"
            label="Include users who like this post"
            onChange={handleCheckChange}
          />
          {formData.includeLikes && (
            <Form.Check
              type="checkbox"
              id="includeLikesFollowers"
              label="Include followers of users who like this post (slow!)"
              onChange={handleCheckChange}
            />
          )}
          <Form.Check
            type="checkbox"
            id="includeReposts"
            label="Include users who reposted this post"
            onChange={handleCheckChange}
          />
          {formData.includeReposts && (
            <Form.Check
              type="checkbox"
              id="includeRepostFollowers"
              label="Include followers of users who reposted this post (slow!)"
              onChange={handleCheckChange}
            />
          )}
          <Form.Check
            type="checkbox"
            id="repeatForAuthor"
            label="Repeat this action for the author's next 100 posts (very slow!)"
            onChange={handleCheckChange}
          />
          <Form.Check
            type="checkbox"
            id="createBlockList"
            label="Create a block list"
            onChange={handleCheckChange}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            className="mt-4"
            variant="danger"
            onClick={() => onSubmit(formData)}
            disabled={!isAuthenticated}
          >
            Block!
          </Button>
        </Col>
      </Row>
    </Container>
  );
}
