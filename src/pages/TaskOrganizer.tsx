import React, { useReducer, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
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
  createInputValue: string;
  updateInputValue: string;
  updateCheckValue: boolean;
  searchValue: string;
  currID: string;
  modal: boolean;
  filterCompleted: boolean
};

const initialState = {
  loading: false,
  tasks: [],
  error: "",
  createInputValue: "",
  updateInputValue: "",
  updateCheckValue: false,
  searchValue: "",
  currID: "",
  modal: false,
  filterCompleted: false
};

type Action =
  | { type: "FETCH_SUCCESS"; payload: [] }
  | { type: "FETCH_ERROR" }
  | { type: "MODAL_TOGGLE" }
  | {
    type: "NEW_TASK";
    get: [];
  }
  | { type: "CREATE_INPUT_VALUE"; newValue: string }
  | { type: "UPDATE_INPUT_VALUE"; newValue: string }
  | { type: "UPDATE_CHECK_VALUE"; newValue: boolean }
  | { type: "SEARCH_VALUE"; newValue: string }
  | { type: "CURR_ID"; newValue: string }
  | { type: "MODAL_TOGGLE" }
  | { type: "COMPLETED_TOGGLE" };



const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        tasks: action.payload,
        error: "",
        createInputValue: "",
        updateInputValue: "",
        updateCheckValue: false,
        searchValue: "",
        currID: "",
        modal: false
      }
    case "FETCH_ERROR":
      return {
        ...state,
        loading: false,
        tasks: [],
        error: "",
        createInputValue: "",
        updateInputValue: "",
        updateCheckValue: false,
        searchValue: "",
        currID: "",
        modal: false
      };
    case "CREATE_INPUT_VALUE":
      return {
        ...state,
        createInputValue: action.newValue
      };
    case "UPDATE_INPUT_VALUE":
      return {
        ...state,
        updateInputValue: action.newValue
      };
    case "UPDATE_CHECK_VALUE":
      return {
        ...state,
        updateCheckValue: action.newValue
      };
    case "SEARCH_VALUE":
      return {
        ...state,
        searchValue: action.newValue
      };
    case "CURR_ID":
      return {
        ...state,
        currID: action.newValue
      }
    case "MODAL_TOGGLE":
      return {
        ...state,
        modal: state.modal ? false : true
      }
    case "COMPLETED_TOGGLE":
      return {
        ...state,
        filterCompleted: state.filterCompleted ? false : true
      }
    default:
      return state;
  }
};

function TaskOrganizer() {
  const [state, dispatch] = useReducer(reducer, initialState);



  const submitHandler = () => {
    if (state.createInputValue !== "") {
      axios
        .post("/task", { name: state.createInputValue, completed: false })
        .then(() => {
          axios.get("/task").then((response) => {
            dispatch({ type: "FETCH_SUCCESS", payload: response.data });
            console.log(response.data)
          })
            .catch((error) => dispatch({ type: "FETCH_ERROR" }));
        })
    }
  };

  const updateModal = (id: string, name: string, completed: boolean) => {
    dispatch({ type: "CURR_ID", newValue: id })
    dispatch({ type: "UPDATE_INPUT_VALUE", newValue: name })
    dispatch({ type: "UPDATE_CHECK_VALUE", newValue: completed })
    dispatch({ type: "MODAL_TOGGLE" })
  }

  const updateHandler = () => {
    axios
      .put(`/task/${state.currID}`, { name: state.updateInputValue, completed: state.updateCheckValue })
      .then(() => axios.get('/task').then((response) => {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data })
      }))
      .catch((error) => {
        dispatch({ type: "FETCH_ERROR" })
      })
  }

  const deleteTask = (id: string) => {
    axios
      .delete(`/task/${id}`)
      .then(() => {
        axios
          .get('/task')
          .then((response) => dispatch({ type: "FETCH_SUCCESS", payload: response.data }))
      })
  }

  const searchTasks = () => {
    if (state.searchValue !== "") {
      axios
        .get(`/task/?name=${state.searchValue}`)
        .then((response) => {
          dispatch({ type: "FETCH_SUCCESS", payload: response.data })
        })
        .catch((error) => {
          dispatch({ type: "FETCH_ERROR" })
        })
    } else {
      axios
        .get('/task')
        .then((response) => dispatch({ type: "FETCH_SUCCESS", payload: response.data }))
    }
  }
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
        <Row className="justify-content-between ">
          <Col md="4">TaskManager</Col>
          <p>completed</p>
          <Form.Check checked={state.filterCompleted} onChange={() => dispatch({ type: "COMPLETED_TOGGLE" })}></Form.Check>
          <Col>
            <Form.Control value={state.searchValue} onChange={(e) => dispatch({ type: "SEARCH_VALUE", newValue: e.target.value })} ></Form.Control>
            <Button onClick={searchTasks}></Button>
          </Col>
          <Col className="d-flex align-content-center" md="2">
            <Form.Control value={state.createInputValue} onChange={(e) => dispatch({ type: "CREATE_INPUT_VALUE", newValue: e.target.value })}></Form.Control>
            <Button onClick={() => submitHandler()}></Button>
          </Col>
        </Row>
        <Row>
          <Tasks deleteTask={deleteTask} idGet={updateModal} list={state}></Tasks>
        </Row>
      </Container>
      <Modal show={state.modal} onHide={() => dispatch({ type: "MODAL_TOGGLE" })}>
        <Modal.Header>
          <Modal.Title>Change Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control value={state.updateInputValue} onChange={(e) => dispatch({ type: "UPDATE_INPUT_VALUE", newValue: e.target.value })}></Form.Control>
          <Form.Check checked={state.updateCheckValue} onChange={(e) => dispatch({ type: "UPDATE_CHECK_VALUE", newValue: e.target.checked })}></Form.Check>
          <Button onClick={() => updateHandler()}>Change</Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskOrganizer;
