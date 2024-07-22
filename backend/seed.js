require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./models/Department');
const Employee = require('./models/Employee');
const departmentController = require('./Controllers/departmentController');
const employeeController = require('./Controllers/employeeController');

mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const departmentsData = [
  { name: 'General Dentistry' },
  { name: 'Pediatric Dentistry' },
  { name: 'Restorative Dentistry' },
  { name: 'Surgery' },
  { name: 'Orthodontics' },
];

const employeesData = [
  { firstName: 'Lisa', lastName: 'Harris', email: 'lisa@example.com', dob: '1980-01-15', phoneNumber: '123-456-7890', address: '123 Main St, City', gender: 'Female', departmentName: 'Restorative Dentistry' },
  { firstName: 'Alfred', lastName: 'Christensen', email: 'alfred@example.com', dob: '1975-05-22', phoneNumber: '234-567-8901', address: '456 Oak St, City', gender: 'Male', departmentName: 'General Dentistry' },
  { firstName: 'John', lastName: 'Dudley', email: 'john@example.com', dob: '1982-08-10', phoneNumber: '345-678-9012', address: '789 Pine St, City', gender: 'Male', departmentName: 'General Dentistry' },
  { firstName: 'Danny', lastName: 'Perez', email: 'danny@example.com', dob: '1987-03-18', phoneNumber: '456-789-0123', address: '101 Cedar St, City', gender: 'Male', departmentName: 'General Dentistry' },
  { firstName: 'Sarah', lastName: 'Alvarez', email: 'sarah@example.com', dob: '1990-12-05', phoneNumber: '567-890-1234', address: '202 Birch St, City', gender: 'Female', departmentName: 'Pediatric Dentistry' },
  { firstName: 'Constance', lastName: 'Smith', email: 'constance@example.com', dob: '1978-09-30', phoneNumber: '678-901-2345', address: '303 Maple St, City', gender: 'Female', departmentName: 'Surgery' },
  { firstName: 'Travis', lastName: 'Combs', email: 'travis@example.com', dob: '1985-07-25', phoneNumber: '789-012-3456', address: '404 Elm St, City', gender: 'Male', departmentName: 'No Department' },
  { firstName: 'Francisco', lastName: 'Willard', email: 'francisco@example.com', dob: '1989-04-12', phoneNumber: '890-123-4567', address: '505 Walnut St, City', gender: 'Male', departmentName: 'Pediatric Dentistry' },
  { firstName: 'Janet', lastName: 'Doe', email: 'janet@example.com', dob: '1984-11-28', phoneNumber: '901-234-5678', address: '606 Pine St, City', gender: 'Female', departmentName: 'General Dentistry' },
  { firstName: 'Leslie', lastName: 'Roche', email: 'leslie@example.com', dob: '1981-06-14', phoneNumber: '012-345-6789', address: '707 Oak St, City', gender: 'Female', departmentName: 'Orthodontics' },
];

// Function to seed departments
const seedDepartments = async () => {
    try {
      for (const departmentData of departmentsData) {
        const existingDepartment = await Department.findOne({ name: departmentData.name });
        if (!existingDepartment) {
          await departmentController.postDepartment({ body: departmentData });
        }
      }
      console.log('Departments seeded successfully.');
    } catch (error) {
      console.error('Error seeding departments:', error.message);
    }
  };
  
  // Function to seed employees and associate them with departments
  const seedEmployees = async () => {
    try {
      for (const employeeData of employeesData) {
        let department;
  
        if (employeeData.departmentName) {
          // If a department is specified, find it
          department = await Department.findOne({ name: employeeData.departmentName });
        }
  
        const existingEmployee = await Employee.findOne({ email: employeeData.email });
  
        if (!existingEmployee) {
          // Create a new employee
          const newEmployee = new Employee({
            firstName: employeeData.firstName,
            lastName: employeeData.lastName,
            email: employeeData.email,
            dob: employeeData.dob,
            phoneNumber: employeeData.phoneNumber,
            address: employeeData.address,
            gender: employeeData.gender,
          });
  
          if (department) {
            // If a department is found, associate the employee with it
            newEmployee.department = department._id;
            await newEmployee.save();
            // Update the department's employees array
            await Department.findByIdAndUpdate(
              department._id,
              { $addToSet: { employees: newEmployee._id } },
              { new: true }
            );
          } else {
            // If no department is specified, add the employee to a default or "No Department" department
            const noDepartment = await Department.findOne({ name: 'No Department' });
  
            if (noDepartment) {
              noDepartment.employees.push(newEmployee._id);
              await noDepartment.save();
            } else {
              // If the default department doesn't exist, create it and add the employee
              const newDefaultDepartment = new Department({
                name: 'No Department',
                employees: [newEmployee._id],
              });
              await newDefaultDepartment.save();
            }
  
            await newEmployee.save();
          }
  
          console.log(`Employee added successfully: ${newEmployee.firstName} ${newEmployee.lastName}`);
        }
      }
  
      console.log('Employees seeded successfully.');
    } catch (error) {
      console.error('Error seeding employees:', error.message);
    }
  };
  
  // Seed the database
  seedDepartments().then(() => seedEmployees()).then(() => mongoose.connection.close());