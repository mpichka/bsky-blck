import { type ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { connect, ConnectedProps } from "react-redux";
import { getUserModerationList } from "../redux/modules/moderationList/selectors";

export interface SearchInputFormData {
  linkToPost: string;
  includeLikes: boolean;
  includeReposts: boolean;
  includeAuthorFollowers: boolean;
  includeLikesFollowers: boolean;
  includeRepostFollowers: boolean;
  repeatForAuthor: boolean;
  actionType: string;
  moderationListUri: string;
}

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
  isLoading: boolean;
  onSubmit: (formData: SearchInputFormData) => void;
};

function SearchInputComponent(props: Props) {
  const { isLoading, onSubmit, userModerationList } = props;

  const [formData, setFormData] = useState<SearchInputFormData>({
    linkToPost: "",
    includeLikes: false,
    includeReposts: false,
    includeAuthorFollowers: false,
    includeLikesFollowers: false,
    includeRepostFollowers: false,
    repeatForAuthor: false,
    actionType: "BLOCK",
    moderationListUri: "NEW_LIST",
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

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const styledButton = () => {
    if (formData.actionType === "BLOCK") {
      return (
        <Button
          className="ms-1"
          variant="danger"
          onClick={() => onSubmit(formData)}
          disabled={isLoading}
        >
          Block!
        </Button>
      );
    }

    if (formData.actionType === "MUTE") {
      return (
        <Button
          className="ms-1"
          variant="warning"
          onClick={() => onSubmit(formData)}
          disabled={isLoading}
        >
          Mute!
        </Button>
      );
    }

    return (
      <Button
        className="ms-1"
        variant="primary"
        onClick={() => onSubmit(formData)}
        disabled={isLoading}
      >
        Start!
      </Button>
    );
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
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <Form.Select id="actionType" onChange={handleSelectChange}>
            <option value="BLOCK">Block</option>
            <option value="MUTE">Mute</option>
            <option value="ADD_TO_LIST">Add to moderation list</option>
          </Form.Select>
        </Col>
        {formData.actionType === "ADD_TO_LIST" && (
          <Col>
            <Form.Select id="moderationListUri" onChange={handleSelectChange}>
              <option value="NEW_LIST">New list</option>
              {userModerationList.map((item) => (
                <option value={item.uri} key={item.cid}>
                  {item.name}
                </option>
              ))}
            </Form.Select>
          </Col>
        )}
        <Col>{styledButton()}</Col>
      </Row>
    </Container>
  );
}

const mapStateToProps = (store) => ({
  userModerationList: getUserModerationList(store),
});

const connector = connect(mapStateToProps);
export const SearchInput = connector(SearchInputComponent);
