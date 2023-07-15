const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');


// Connecting mongoose to the database 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { 
       useNewUrlParser: true,
}).then(conn => console.log("Database connected successfully"));

const port = process.env.port || 8000;
app.listen(port, (req, res) => {
       console.log(`Server is running on port ${port}`);
}) 