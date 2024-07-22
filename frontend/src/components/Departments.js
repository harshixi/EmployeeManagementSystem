import React, { useState, useEffect } from "react";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

function Departments() {
  const url = "http://localhost:8022/api/departments";
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(url);
      setDepartments(response.data.departments);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (departmentId) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      axios
        .delete(`${url}/${departmentId}`)
        .then(() => {
          setDepartments(departments.filter((department) => department._id !== departmentId));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div style={{ width: "80%", margin: "auto", marginTop: "40px" }}>
      {departments.map((department) => (
        <Accordion key={department._id}>
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
              {department.name}
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
              <div>
                <p>Department Name: {department.name}</p>
                <p>Number of Employees: {department.employees.length}</p>
                <p>Employee Details:</p>
                <ul>
                  {department.employees.map((employee) => (
                    <li key={employee._id}>
                      {employee.firstName} {employee.lastName} - {employee.email}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(department._id)}
                >
                  Delete
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
    </div>
  );
}

export default Departments;
