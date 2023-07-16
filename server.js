 const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');


// Connecting mongoose to the database 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { 
       useNewUrlParser: true,
}).then(() => console.log('DB connection successful!')).catch(err => console.log(err));





//* SERVER
const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
       console.log(`Server is running on port ${port}`);
}) 