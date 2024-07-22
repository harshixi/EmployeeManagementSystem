import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Employees from './components/Employees';
import Departments from './components/Departments';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div>
      <BrowserRouter>
        <NavigationBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/departments" element={<Departments />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
