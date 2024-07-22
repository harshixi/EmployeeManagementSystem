const dotenv = require("dotenv"); 
dotenv.config();
const mongoose = require("mongoose");
const url = process.env.URL;


const connectDb = async () => {
//     try {
//         await mongoose.connect(url);
//         console.log("Connected to MongoDB Atlas successfully.");
//     } catch (error) {
//         console.error('Connection to MongoDB Atlas failed:', error);
//     } 
// };
try {
    await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB Atlas successfully.");
} catch (error) {
    console.error('Connection to MongoDB Atlas failed:', error);
}
};
module.exports = connectDb;