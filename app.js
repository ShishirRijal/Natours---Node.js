const express = require('express');
const fs = require('fs');
const morgan = require('morgan');



 const app = express();
 
//*  MIDDLEWARES -- called so because it sits between the request and the response
// it can modify the incoming request data
app.use(express.json());  // the data from the body is added to the request object
app.use(morgan('dev')); //  morgan is a logging middleware that logs the request data to the console

 // routes
 
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8'));


// * ROUTE HANDLERS
const getAllTour =  (req, res) => {
    res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
    })
}

const createTour = (req, res) => { 
    const id = tours[tours.length - 1].id + 1; 
     const newTour = Object.assign({id: id}, req.body);
      tours.push(newTour);
      fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) throw err;
        res.status(201).json({   // 201 means created
            status: 'success', 
            data: { tour: newTour }
        });
      });
    console.log(req.body);
}
const getTour =  (req, res) => {
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
}

const updateTour =  (req, res) => { 
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
}

const deleteTour =  (req, res) => {
    const id = req.params.id * 1; // convert id from string to int
    const tour = tours.find((tour) => tour.id === id);
    if(!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid ID' 
        })
    }
    // now add code to delete the tour
    res.status(204).json({ // 204 means no content
        status: 'success',
        data: null   // null because we are deleting the data
     });
 }

    const getAllUsers = (req, res) => { 
         res.status(500).json({ // 500 means internal server error
                status: 'error',
                message: 'This route is not yet defined'
            });
    }
    const createUser = (req, res) => { 
        res.status(500).json({  
                status: 'error',
                message: 'This route is not yet defined'
            });
        }
        const deleteUser = (req, res) => { 
            res.status(500).json({  
                    status: 'error',
                    message: 'This route is not yet defined'
                });
            }
            const updateUser = (req, res) => { 
                res.status(500).json({  
                        status: 'error',
                        message: 'This route is not yet defined'
                    });
                }
                const getUser = (req, res) => { 
                    res.status(500).json({  
                            status: 'error',
                            message: 'This route is not yet defined'
                        });
                    }
            
        
    
 // * ROUTES

app.route('/api/v1/tours').get(getAllTour).post(createTour);
app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app.route('/api/v1/users/:id').get(getUser).patch(updateUser).delete(deleteUser);

 // SERVER 
 const port = process.env.port || 8000;
 app.listen(port, (req, res) => {
        console.log(`Server is running on port ${port}`);
 })