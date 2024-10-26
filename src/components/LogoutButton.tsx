import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { connect, ConnectedProps } from "react-redux";
import { logout } from "../redux/modules/user/actions";
import { isAuthorized, isUserLoading } from "../redux/modules/user/selectors";

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function LogoutButtonComponent(props: Props) {
  const { isAuthorized, isLoading, logout } = props;

  if (!isAuthorized) return null;

  return (
    <Button variant="light" onClick={logout}>
      Logout
      {isLoading && <Spinner animation="border" size="sm" className="ms-2" />}
    </Button>
  );
}

const mapStateToProps = (store) => ({
  isAuthorized: isAuthorized(store),
  isLoading: isUserLoading(store),
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export const LogoutButton = connector(LogoutButtonComponent);
