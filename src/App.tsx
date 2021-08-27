import "./App.css";
import { Container } from "react-bootstrap";
import TaskOrganizer from "./pages/TaskOrganizer";
import "./bootstrap.min.css";
function App() {
  return (
    <Container
      className="h-100 d-flex justify-content-center align-content-center"
      fluid
    >
      <TaskOrganizer></TaskOrganizer>
    </Container>
  );
}

export default App;
