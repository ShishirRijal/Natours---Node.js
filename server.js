const dotenv = require('dotenv');
dotenv.config({path:'./config.env '});

const app = require('./app');


console.log(process.env);

const port = process.env.port || 8000;
app.listen(port, (req, res) => {
       console.log(`Server is running on port ${port}`);
})