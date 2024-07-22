const Department = require('../models/Department');
const Employee = require('../models/Employee');

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('department');
    res.status(200).json({ employees: employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on getting employees' });
  }
};

// Get one employee
const getOneEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    const foundEmployee = await Employee.findById(id).populate('department');
    if (foundEmployee) {
      res.status(200).json({ employee: foundEmployee });
    } else {
      res.status(404).json({ msg: 'No employee found with the given ID' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on retrieving the employee' });
  }
};

// Post one employee
const postEmployee = async (req, res) => {
  try {
    const { firstName, lastName, email, dob, phoneNumber, address, gender, department } = req.body;

    console.log('Received data:', req.body); // Add this line for debugging

    // Find the department ObjectId based on the department name
    let departmentObjectId = null;
    if (department) {
      const foundDepartment = await Department.findOne({ name: department });
      if (foundDepartment) {
        departmentObjectId = foundDepartment._id;
      }
    }

    const newEmployee = new Employee({
      firstName: firstName,
      lastName: lastName,
      email: email,
      dob: dob,
      phoneNumber: phoneNumber,
      address: address,
      gender: gender,
      department: departmentObjectId, // Use the ObjectId instead of the department name
    });

    const savedEmployee = await newEmployee.save();

    // Update department's employees field if department is defined
    if (departmentObjectId) {
      const updatedDepartment = await Department.findByIdAndUpdate(
        departmentObjectId,
        { $addToSet: { employees: savedEmployee._id } },
        { new: true }
      );

      // Check if the department exists and update was successful
      if (updatedDepartment) {
        console.log(`Employee added to department: ${updatedDepartment.name}`);
      } else {
        console.log(`Department not found for employee: ${savedEmployee.firstName} ${savedEmployee.lastName}`);
      }
    } else {
      // If no department is specified, add the employee to a default or "No Department" department
      const noDepartment = await Department.findOne({ name: 'No Department' });

      if (noDepartment) {
        noDepartment.employees.push(savedEmployee._id);
        await noDepartment.save();
        console.log(`Employee added to default department: ${noDepartment.name}`);
      } else {
        // If the default department doesn't exist, create it and add the employee
        const newDefaultDepartment = new Department({ name: 'No Department', employees: [savedEmployee._id] });
        await newDefaultDepartment.save();
        console.log(`Default department created, and employee added: ${newDefaultDepartment.name}`);
      }
    }

    // Check if res is defined (avoiding errors during seeding)
    if (res) {
      res.status(201).json(savedEmployee);
    }
  } catch (error) {
    console.error(error);
    if (res) {
      res.status(500).json({ msg: 'Server error while creating employee.' });
    }
  }
};

// Update one employee
const putEmployee = async (req, res) => {
  const id = req.params.id;
  const employee = req.body;
  try {
    await Employee.findByIdAndUpdate(id, employee);
    res.status(200).json({ msg: 'Update success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on updating employee' });
  }
};

// Delete one employee
const deleteEmployee = async (req, res) => {
  const id = req.params.id;
  try {
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Delete done' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on deleting employee' });
  }
};

module.exports = { getEmployees, postEmployee, putEmployee, deleteEmployee, getOneEmployee };
