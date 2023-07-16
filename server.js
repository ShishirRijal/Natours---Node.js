 const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');


// Connecting mongoose to the database 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { 
       useNewUrlParser: true,
}).then(() => console.log('DB connection successful!'));





//* SERVER
const port = process.env.PORT || 8000;
const server = app.listen(port, (req, res) => {
       console.log(`Server is running on port ${port}`);
}) 


// Handling uncaught exceptions
process.on('unhandledRejection', err => {
       console.log('UNHANDLED REJECTION! 💥 Shutting down...');
       console.log(err.name, err.message); 
       // In such case, we need to close the server first and then exit the process
       server.close(() => {
              process.exit(1);
       });
});