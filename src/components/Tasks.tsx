import { Task, State } from "../pages/TaskOrganizer";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Delete, Edit } from "@material-ui/icons"

//typing of the props containing "list" State prop and callbacks for the buttons and checktoggle
type Props = {
  list: State;
  idGet: Function;
  deleteTask: Function;
  completedToggle: Function;
};

export function Tasks(props: Props) {
  if (props.list.filterCompleted) {
    return (
      <Container className="rounded-4 border w-50">
        <Row className="bg-dark">
          <Col sm="5" className="d-flex justify-content-center text-light">Name</Col>
        </Row>
        <Row className="bg-secondary">
          <Col>
            {props.list.tasks.filter((v) => v.completed).map((obj: Task) => {
              return (
                <Row className="align-items-center" key={obj.id}>
                  <Col md="1"><Form.Check checked={obj.completed} onChange={(e) => props.completedToggle(obj.id, obj.name, e.target.checked)}></Form.Check></Col>
                  <Col className="">{obj.name}</Col>
                  <Col md="1">
                    <Button onClick={() => props.idGet(obj.id, obj.name,)}><Edit></Edit></Button>
                  </Col>
                  <Col md="1">
                    <Button onClick={() => props.deleteTask(obj.id)}><Delete></Delete></Button>
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
      <Container className="rounded-4 border w-50">
        <Row className="bg-dark">
          <Col sm="5" className="d-flex justify-content-center text-light">Name</Col>
        </Row>
        <Row >
          <Col className="" >
            {props.list.tasks.map((obj: Task) => {
              return (
                <Row className="align-items-center" key={obj.id}>
                  <Col md="1">
                    <Form.Check checked={obj.completed} onChange={(e) => props.completedToggle(obj.id, obj.name, e.target.checked)}></Form.Check>
                  </Col>
                  <Col className="">
                    {obj.name}
                  </Col>
                  <Col md="1">
                    <Button onClick={() => props.idGet(obj.id, obj.name, obj.completed)}><Edit></Edit></Button>
                  </Col>
                  <Col md="1">
                    <Button onClick={() => props.deleteTask(obj.id)}><Delete></Delete></Button>
                  </Col>
                </Row>
              );
            })}
          </Col>
        </Row>
      </Container >
    )
  };
}
