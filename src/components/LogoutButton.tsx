import Button from "react-bootstrap/Button";

type Props = {
  isAuthenticated: boolean;
  setAuthenticated: (state: boolean) => void;
};

export function LogoutButton(props: Props) {
  const { isAuthenticated, setAuthenticated } = props;

  const handleLogout = () => {
    sessionStorage.removeItem("session");
    setAuthenticated(false);
  };

  if (!isAuthenticated) return null;

  return (
    <Button variant="light" onClick={handleLogout}>
      Logout
    </Button>
  );
}
