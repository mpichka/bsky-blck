import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";

type Props = {
  isLoading: boolean;
  totalCount: number;
  blockCount: number;
};

export function Counter(props: Props) {
  const { isLoading, totalCount, blockCount } = props;

  return (
    <Container>
      <Row>
        <Col>
          {isLoading && (
            <Spinner animation="border" variant="primary" size="sm" />
          )}
          {totalCount !== 0 && (
            <>
              <span>Found {totalCount} users </span>
              <span>Blocked {blockCount}. </span>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
}
