import React, { useReducer, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  InputGroup
} from "react-bootstrap";
import { Search } from "@material-ui/icons"
import { Tasks } from "../components/Tasks";
import "./TaskOrganizer.scss"

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

  const completedToggle = (id: string, name: string, newValue: boolean) => {
    axios
      .put(`/task/${id}`, { name: name, completed: newValue })
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
      <Container className="h-100 w-100" fluid>
        <Row className="justify-content-between">
          <Col className="justify-self-start h-5" md="1">
            <img className="img-fluid" alt="task manager" src="logo.png"></img>
          </Col>
          <Col md="4" className="d-flex justify-self-end align-items-center justify-content-center">
            <Form onSubmit={(e) => {
              searchTasks()
              e.preventDefault()
            }}>
              <InputGroup>
                <Form.Control placeholder="Search" value={state.searchValue} onChange={(e) => dispatch({ type: "SEARCH_VALUE", newValue: e.target.value })} ></Form.Control>
                <Button type="submit"><Search></Search></Button>
              </InputGroup>
            </Form>
          </Col>
        </Row>
        <Row className="mt-5 mb-3 justify-content-center">
          <Col className="d-flex align-items-center" md="2">
            <InputGroup>
              <Form.Control placeholder="Add Task" value={state.createInputValue} onChange={(e) => dispatch({ type: "CREATE_INPUT_VALUE", newValue: e.target.value })}></Form.Control>
              <Button onClick={() => submitHandler()}></Button>
            </InputGroup>
          </Col>
          <Col className="d-flex align-items-center" md="1">
            <Form.Check checked={state.filterCompleted} label="Completed" onChange={() => dispatch({ type: "COMPLETED_TOGGLE" })}></Form.Check>
          </Col>
        </Row>
        <Row>
          <Tasks completedToggle={completedToggle} deleteTask={deleteTask} idGet={updateModal} list={state}></Tasks>
        </Row>
      </Container>
      <Modal show={state.modal} onHide={() => dispatch({ type: "MODAL_TOGGLE" })}>
        <Modal.Header>
          <Modal.Title>Change Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => {
            updateHandler()
            e.preventDefault()
          }}>
            <InputGroup>
              <Form.Control value={state.updateInputValue} onChange={(e) => dispatch({ type: "UPDATE_INPUT_VALUE", newValue: e.target.value })}></Form.Control>
              <Button type="submit">Change</Button>
            </InputGroup>
            <Row>
              <InputGroup className="mt-4 ml-4">
                <Form.Check label="Completed" checked={state.updateCheckValue} onChange={(e) => dispatch({ type: "UPDATE_CHECK_VALUE", newValue: e.target.checked })}></Form.Check>
              </InputGroup>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default TaskOrganizer;
