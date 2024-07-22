const express = require('express');
const employeeRoute = express.Router();
const {
  getEmployees,
  postEmployee,
  putEmployee,
  deleteEmployee,
  getOneEmployee,
} = require('../Controllers/employeeController');

employeeRoute.get('/employees', getEmployees);
employeeRoute.get('/employees/:id', getOneEmployee);
employeeRoute.post('/employees', postEmployee);
employeeRoute.put('/employees/:id', putEmployee);
employeeRoute.delete('/employees/:id', deleteEmployee);

module.exports = employeeRoute;
