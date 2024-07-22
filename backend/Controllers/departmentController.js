const Department = require('../models/Department');

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate('employees');
    res.status(200).json({ departments: departments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on getting departments' });
  }
};

// Get one department
const getOneDepartment = async (req, res) => {
  const id = req.params.id;
  try {
    const foundDepartment = await Department.findById(id).populate('employees');
    if (foundDepartment) {
      res.status(200).json({ department: foundDepartment });
    } else {
      res.status(404).json({ msg: 'No department found with the given ID' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on retrieving the department' });
  }
};

// Post one department
const postDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const newDepartment = new Department({
      name: name,
    });

    const savedDepartment = await newDepartment.save();

    // Check if res is defined (avoiding errors during seeding)
    if (res) {
      res.status(201).json(savedDepartment);
    }
  } catch (error) {
    console.error(error);
    if (res) {
      res.status(500).json({ msg: 'Server error while creating department.' });
    }
  }
};
  
// Update one department
const putDepartment = async (req, res) => {
  const id = req.params.id;
  const department = req.body;

  try {
    const currentDepartment = await Department.findById(id);

    // Update the current department and ensure no duplicate employee IDs
    const updatedDepartment = await Department.findByIdAndUpdate(
      id,
      { $addToSet: { employees: { $each: department.employees } }, $set: { ...department } },
      { new: true }
    );

    // Remove the employee's ObjectId from all other departments
    const employeeIdToRemove = updatedDepartment.employees.map((id) => id.toString());

    await Department.updateMany(
      { _id: { $ne: currentDepartment._id }, employees: { $in: employeeIdToRemove } },
      { $pull: { employees: { $in: employeeIdToRemove } } },
      { multi: true }
    );

    res.status(200).json({ msg: 'Update success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on updating department' });
  }
};
  
// Delete one department
const deleteDepartment = async (req, res) => {
  const id = req.params.id;
  try {
    await Department.findByIdAndDelete(id);
    res.status(200).json({ msg: 'Delete done' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error on deleting department' });
  }
};

module.exports = { getDepartments, getOneDepartment, postDepartment, putDepartment, deleteDepartment };
  
