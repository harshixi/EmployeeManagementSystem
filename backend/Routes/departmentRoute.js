const express = require('express');
const departmentRoute = express.Router();
const {
  getDepartments,
  getOneDepartment,
  postDepartment,
  putDepartment,
  deleteDepartment,
} = require('../Controllers/departmentController');

departmentRoute.get('/departments', getDepartments);
departmentRoute.get('/departments/:id', getOneDepartment);
departmentRoute.post('/departments', postDepartment);
departmentRoute.put('/departments/:id', putDepartment);
departmentRoute.delete('/departments/:id', deleteDepartment);

module.exports = departmentRoute;
