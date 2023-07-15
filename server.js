const dotenv = require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');


// Connecting mongoose to the database 
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose.connect(DB, { 
       useNewUrlParser: true,
}).then(conn => console.log("Database connected successfully"));



const tourSchema = new mongoose.Schema({
       name: {
              type: String,
              required: [true, 'A tour must have a name'],
              unique: [true, 'A tour already exists by this name']
       }, 
       rating: {
              type: Number,
              default: 4.5
       }, 
       price: {
              type: Number,
              required: [true, 'A tour must have a price']
       }
});
const Tour = mongoose.model('Tour', tourSchema);



const port = process.env.port || 8000;
app.listen(port, (req, res) => {
       console.log(`Server is running on port ${port}`);
}) 