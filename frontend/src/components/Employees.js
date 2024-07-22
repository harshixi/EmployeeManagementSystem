import React, { useState, useEffect } from "react";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Employees() {
  const url = "http://localhost:8022/api/employees";
  const [employees, setEmployees] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentDepartmentName, setCurrentDepartmentName] = useState(''); 
  const [showForm, setShowForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phoneNumber: "",
    address: "",
    gender: "",
    department: "",
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(url);
      setEmployees(response.data.employees);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSelectedEmployee((prevEmployee) => ({
      ...prevEmployee,
      [id]: value,
    }));
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setNewEmployee((prevEmployee) => ({
      ...prevEmployee,
      [id]: value,
    }));
  };

  const handleDelete = (employeeId) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      axios
        .delete(`${url}/${employeeId}`)
        .then(() => {
          setEmployees(employees.filter((employee) => employee._id !== employeeId));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleShow = (employee) => {
    setSelectedEmployee({ ...employee });
    setCurrentDepartmentName(employee.department?.name); 
    setShow(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
  
    try {
      // Fetch all departments
      const response = await axios.get(`http://localhost:8022/api/departments`);
      const departments = response?.data?.departments || [];
  
      // Ensure that departments is an array
      if (!Array.isArray(departments)) {
        console.error('Invalid departments response:', response.data);
        window.alert('Error updating employee. Departments data is invalid.');
        return;
      }
  
      // Find the department with a matching name
      const matchingDepartment = departments.find(
        (department) => department.name === selectedEmployee.department
      );
  
      // Use the department ObjectId for the update
      const newDepartmentId = matchingDepartment ? matchingDepartment._id : null;
  
      // Update the employee with the new department ObjectId
      const updatedEmployee = { ...selectedEmployee, department: newDepartmentId };
  
      try {
        // Remove the employee's ObjectId from the current department
        if (currentDepartmentName) {
          const currentDepartment = departments.find(
            (department) => department.name === currentDepartmentName
          );
  
          if (currentDepartment) {
            const updatedEmployees = currentDepartment.employees.filter(
              (employeeId) => employeeId !== selectedEmployee._id
            );
  
            // Update the current department with the modified employees array
            await axios.put(`http://localhost:8022/api/departments/${currentDepartment._id}`, {
              employees: updatedEmployees,
            });
          }
        }
  
        // Update the employee with the new department ObjectId
        await axios.put(`${url}/${selectedEmployee._id}`, updatedEmployee);
  
        // Add the employee's ObjectId to the new department
        if (matchingDepartment) {
          const updatedEmployees = [...matchingDepartment.employees, selectedEmployee._id];
  
          // Update the new department with the modified employees array
          await axios.put(`http://localhost:8022/api/departments/${matchingDepartment._id}`, {
            employees: updatedEmployees,
          });
        }
  
        handleClose();
        fetchEmployees();
        window.alert('Employee updated successfully!');
      } catch (error) {
        console.error('Error updating employee:', error);
        window.alert('Error updating employee. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
      window.alert('Error updating employee. Please try again.');
    }
  };
     

  const handleClose = () => {
    setShow(false);
    setSelectedEmployee(null);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleAddEmployee = async () => {
    try {
      // Ensure gender is either 'Male' or 'Female'
      if (!['Male', 'Female'].includes(newEmployee?.gender)) {
        // Handle invalid gender value (e.g., show an error message)
        return;
      }
      await axios.post(url, newEmployee);
      handleCloseForm();
      fetchEmployees();
      // Show a window or alert after successful addition
      window.alert('Employee added successfully!');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "40px" }}>
      <Button variant="primary" onClick={handleShowForm}>
        Add Employee
      </Button>

      {employees.map((employee) => (
        <Accordion key={employee._id}>
          <Accordion.Item eventKey="0">
            <Accordion.Header
              style={{
                backgroundColor: "lightgrey",
                color: "white",
                fontWeight: "bold",
                padding: "10px 10px",
                borderBottom: "1px solid #e3e3e3",
                cursor: "pointer",
              }}
            >
              {`${employee.firstName} ${employee.lastName}`}
            </Accordion.Header>
            <Accordion.Body
              style={{
                padding: "15px",
                fontSize: "16px",
                lineHeight: "1.5",
                color: "#333",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div>
                  <p>Email: {employee.email}</p>
                  <p>Date of birth: {new Date(employee.dob).toLocaleDateString()}</p>
                  <p>Address: {employee.address}</p>
                  <p>Phone number: {employee.phoneNumber}</p>
                  <p>Gender: {employee.gender}</p>
                  {employee.department && <p>Department: {employee.department.name}</p>}
                </div>
                <div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(employee._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleShow(employee)}
                    style={{ marginLeft: "10px" }}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Employee Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={selectedEmployee?.firstName || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={selectedEmployee?.lastName || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={selectedEmployee?.email || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                placeholder="Enter date of birth"
                value={selectedEmployee?.dob ? selectedEmployee.dob.substring(0, 10) : ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter phone number"
                value={selectedEmployee?.phoneNumber || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter address"
                value={selectedEmployee?.address || ""}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                value={selectedEmployee?.gender || newEmployee?.gender || ""}
                onChange={handleChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="department">
              <Form.Label>Department</Form.Label>
              <Form.Select
                value={selectedEmployee?.department || ''}
                onChange={handleChange}
              >
                <option value="General Dentistry">General Dentistry</option>
                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                <option value="Restorative Dentistry">Restorative Dentistry</option>
                <option value="Surgery">Surgery</option>
                <option value="Orthodontics">Orthodontics</option>
                <option value="No Department">No Department</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showForm} onHide={handleCloseForm}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" placeholder="Enter first name" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" placeholder="Enter last name" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="dob">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" placeholder="Enter date of birth" value={newEmployee.dob || ""} onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" placeholder="Enter phone number" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" placeholder="Enter address" onChange={handleFormChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control as="select" value={selectedEmployee?.gender || newEmployee?.gender || ""} onChange={handleFormChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="department">
              <Form.Label>Department</Form.Label>
              <Form.Select value={selectedEmployee?.department || newEmployee?.department || ''} onChange={handleFormChange}>
                <option value="General Dentistry">General Dentistry</option>
                <option value="Pediatric Dentistry">Pediatric Dentistry</option>
                <option value="Restorative Dentistry">Restorative Dentistry</option>
                <option value="Surgery">Surgery</option>
                <option value="Orthodontics">Orthodontics</option>
                <option value="No Department">No Department</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseForm}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Employees;
