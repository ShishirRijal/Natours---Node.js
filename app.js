 const express = require('express');
 const fs = require('fs');



 const app = express();
 
//*  middleware -- called so because it sits between the request and the response
// it can modify the incoming request data
 app.use(express.json());  // the data from the body is added to the request object



 // routes
 
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
    })
});

app.post('/api/v1/tours', (req, res) => { 
    const id = tours[tours.length - 1].id + 1; 
     const newTour = Object.assign({id: id}, req.body);
      tours.push(newTour);
      fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) throw err;
        res.status(201).json({ 
            status: 'success',
            data: { tour: newTour }
        });
      });
    console.log(req.body);
});

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1; // convert id from string to number
    console.log(typeof(id));
    const tour  = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    } 
    res.status(200).json({ 
        status: 'success',
        data: { tour } 
    });
})

app.patch('/api/v1/tours/:id', (req, res) => { 
    const id = req.params.id * 1; // convert id from string to int
    const tour = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    }
    res.status(200).json({
        status: 'success',
        data: { tour: '<Updated tour here...>' } // dummy data for now
     });
});

 // create server 
 const port = process.env.port || 8000;
 app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
 })