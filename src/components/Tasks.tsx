import { Task, State } from "../pages/TaskOrganizer";
import { Container, Row, Col } from "react-bootstrap";

type Props = {
  list: State;
};

export function Tasks(props: Props) {
  return (
    <Container className="bg-dark">
      <Row>
        <Col className="text-light">Name</Col>
        <Col className="text-light">Completed</Col>
      </Row>
      <Row className="bg-secondary">
        <Col>
          {props.list.tasks.map((obj: Task) => {
            return (
              <Row key={obj.id}>
                <Col className="text-light">{obj.name}</Col>
                <Col className="text-light">
                  {obj.completed ? "true" : "false"}
                </Col>
              </Row>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
}
