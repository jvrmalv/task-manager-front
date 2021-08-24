import React, { useReducer, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  InputGroup,
  Form,
} from "react-bootstrap";
import { Tasks } from "../components/Tasks";

export type Task = {
  id: string;
  name: string;
  completed: boolean;
};

export type State = {
  loading: boolean;
  tasks: Array<Task>;
  error: string;
  modal: boolean;
  modalInput: string;
};

type Action =
  | { type: "FETCH_SUCCESS"; payload: [] }
  | { type: "FETCH_ERROR" }
  | { type: "MODAL_TOGGLE" }
  | {
      type: "NEW_TASK";
      get: [];
    }
  | { type: "VALUE"; newValue: string };

const initialState = {
  loading: false,
  tasks: [],
  error: "",
  modal: false,
  modalInput: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        loading: false,
        tasks: action.payload,
        error: "",
        modal: false,
        modalInput: "",
      };
    case "FETCH_ERROR":
      return {
        loading: false,
        tasks: [],
        error: "",
        modal: false,
        modalInput: "",
      };
    case "MODAL_TOGGLE":
      return {
        ...state,
        modal: state.modal ? false : true,
      };
    case "NEW_TASK":
      return {
        ...state,
        tasks: action.get,
      };
    case "VALUE":
      return {
        ...state,
        modalInput: action.newValue,
      };
    default:
      return state;
  }
};

function TaskOrganizer() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const submitHandler = () => {
    axios
      .post("/task", { name: state.modalInput, completed: false })
      .then(() => {
        axios.get("/task").then((response) => {
          dispatch({ type: "NEW_TASK", get: response.data });
        });
      });
  };
  useEffect(() => {
    axios
      .get("/task")
      .then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_ERROR" });
      });
  }, []);
  return (
    <div className="w-100">
      <Container className="w-100" fluid>
        <Row className="justify-content-around">
          <Col md="8">TaskManager</Col>
          <Col className="d-flex align-content-center" md="2">
            <Button
              onClick={() => {
                dispatch({ type: "MODAL_TOGGLE" });
              }}
            >
              Add Task
            </Button>
          </Col>
        </Row>
        <Row>
          <Tasks list={state}></Tasks>
        </Row>
      </Container>
      <Modal
        show={state.modal}
        onHide={() => dispatch({ type: "MODAL_TOGGLE" })}
      >
        <Modal.Header>
          <Modal.Title>Add task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={submitHandler}>
            <InputGroup>
              <Form.Control
                value={state.modalInput}
                onChange={(e) => {
                  dispatch({ type: "VALUE", newValue: e.target.value });
                }}
              ></Form.Control>
            </InputGroup>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskOrganizer;
