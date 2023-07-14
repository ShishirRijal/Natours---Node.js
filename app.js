 const express = require('express');
 const fs = require('fs');



 const app = express();
 
// routes

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
    })
});


 // create server 
 const port = process.env.port || 8000;
 app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
 })