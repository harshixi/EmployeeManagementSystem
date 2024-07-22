const express = require("express");
const employeeRoute = require("./Routes/employeeRoute");
const departmentRoute = require("./Routes/departmentRoute");
const connectDb = require('./Configuration/connectDb');
const cors = require('cors');
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const port = process.env.PORT||5000;
connectDb("mongodb+srv://harshiniv1208:TzU4fYVziKmdZSYi@cluster0.asoinu6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
app.use(cors());
app.use(express.json());

app.listen(port, (er) => {
    if (er) {
        console.log(er);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});

app.use(express.json());
app.use("/api", employeeRoute);
app.use("/api", departmentRoute);