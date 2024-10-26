import { useEffect } from "react";
import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { connect, ConnectedProps } from "react-redux";
import {
  clearModerationList,
  pushToModerationList,
  pushToSubscribedModerationList,
} from "../redux/modules/moderationList/actions";
import {
  getSubscribedModerationList,
  getUserModerationList,
} from "../redux/modules/moderationList/selectors";
import { getUser } from "../redux/modules/user/selectors";
import { Bsky, List } from "../services/Bsky";
import { ModerationBadge } from "./ModerationBadge";

type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux;

function ModerationListComponent(props: Props) {
  const {
    user,
    pushToModerationList,
    userModerationList,
    // subscribedModerationList,
    clearModerationList,
    // pushToSubscribedModerationList,
  } = props;

  useEffect(() => {
    if (user) loadModerationLists(user);
    else clearModerationList();
  }, [user]);

  async function loadModerationLists(session) {
    await loadUserModerationList(session);
    // await loadSubscribedBlockList(session);
    // await loadSubscribedMuteList(session);
  }

  async function loadUserModerationList(session) {
    let cursor: string | undefined;
    while (true) {
      const listRes = await Bsky.getUserModerationLists(session);
      cursor = listRes.data?.cursor;
      if (listRes.data?.lists) pushToModerationList(listRes.data.lists);
      if (!listRes.error || !cursor || !listRes.data?.lists) break;
    }
  }

  // async function loadSubscribedBlockList(session) {
  //   let cursor: string | undefined;
  //   while (true) {
  //     const listRes = await Bsky.getSubscribedBlockList(session);
  //     cursor = listRes.data?.cursor;
  //     if (listRes.data?.lists)
  //       pushToSubscribedModerationList(listRes.data.lists);
  //     if (!listRes.error || !cursor || !listRes.data?.lists) break;
  //   }
  // }

  // async function loadSubscribedMuteList(session) {
  //   let cursor: string | undefined;
  //   while (true) {
  //     const listRes = await Bsky.getSubscribedMuteList(session);
  //     cursor = listRes.data?.cursor;
  //     if (listRes.data?.lists)
  //       pushToSubscribedModerationList(listRes.data.lists);
  //     if (!listRes.error || !cursor || !listRes.data?.lists) break;
  //   }
  // }

  if (!user) return null;

  return (
    <Container className="mb-5">
      <Row className="mt-3">
        <Col>
          <h5>Your moderation lists:</h5>
          <Accordion alwaysOpen>
            {userModerationList.map((item) => (
              <Accordion.Item eventKey={item.cid}>
                <Accordion.Header>
                  {item.name}
                  <ModerationBadge className="ms-2" type={item.viewer} />
                </Accordion.Header>
                <Accordion.Body>{item.description}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
        {/* <Col>
          <h5>Subscribed to moderation lists:</h5>
          <Accordion alwaysOpen>
            {subscribedModerationList.map((item) => (
              <Accordion.Item eventKey={item.cid}>
                <Accordion.Header>
                  {item.name}
                  <ModerationBadge className="ms-2" type={item.viewer} />
                </Accordion.Header>
                <Accordion.Body>{item.description}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col> */}
      </Row>
    </Container>
  );
}

const mapStateToProps = (store) => ({
  user: getUser(store),
  userModerationList: getUserModerationList(store),
  subscribedModerationList: getSubscribedModerationList(store),
});

const mapDispatchToProps = (dispatch) => ({
  pushToModerationList: (payload: List[]) =>
    dispatch(pushToModerationList(payload)),
  clearModerationList: () => dispatch(clearModerationList()),
  pushToSubscribedModerationList: (payload: List[]) =>
    dispatch(pushToSubscribedModerationList(payload)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
export const ModerationList = connector(ModerationListComponent);
