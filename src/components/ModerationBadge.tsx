import Badge from "react-bootstrap/Badge";
import { ListViewer } from "../services/Bsky";

type Props = {
  type: ListViewer;
  className?: string;
};

export function ModerationBadge(props: Props) {
  const { type } = props;
  const className = props.className || "";

  if (type?.blocked) {
    return (
      <Badge className={className} bg="danger">
        Blocked
      </Badge>
    );
  }

  if (type?.muted) {
    return (
      <Badge className={className} bg="warning">
        Muted
      </Badge>
    );
  }

  return (
    <Badge className={className} bg="info">
      Unsubscribed
    </Badge>
  );
}
