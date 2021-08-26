import { Task, State } from "../pages/TaskOrganizer";
import { Container, Row, Col, Button } from "react-bootstrap";

type Props = {
  list: State;
  idGet: Function;
  deleteTask: Function;
};

export function Tasks(props: Props) {
  if (props.list.filterCompleted) {
    return (
      <Container className="bg-dark">
        <Row>
          <Col className="text-light">Name</Col>
          <Col className="text-light">Completed</Col>
        </Row>
        <Row className="bg-secondary">
          <Col>
            {props.list.tasks.filter((v) => v.completed).map((obj: Task) => {
              return (
                <Row key={obj.id}>
                  <Col className="text-light">{obj.name}</Col>
                  <Col className="text-light">
                    {obj.completed ? "true" : "false"}
                  </Col>
                  <Col>
                    <Button onClick={() => props.idGet(obj.id, obj.name,)}>Edit</Button>
                  </Col>
                  <Col>
                    <Button onClick={() => props.deleteTask(obj.id)}>DELETE</Button>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </Container>
    )
  }
  else {
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
                  <Col>
                    <Button onClick={() => props.idGet(obj.id, obj.name,)}>Edit</Button>
                  </Col>
                  <Col>
                    <Button onClick={() => props.deleteTask(obj.id)}>DELETE</Button>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </Container>
    )
  };
}
