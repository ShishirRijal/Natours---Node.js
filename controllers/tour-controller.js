const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

exports.getAllTour =  (req, res) => {
    res.status(200).json({
        "status": "success", 
        "results": tours.length,
        "data": { tours }
    })
} 

exports.createTour = (req, res) => { 
    const id = tours[tours.length - 1].id + 1; 
     const newTour = Object.assign({id: id}, req.body);
      tours.push(newTour);
      fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if(err) throw err;
        res.status(201).json({   // 201 means created
            status: 'success', 
            data: { tour: newTour }
        });
      });
    console.log(req.body);
}
exports.getTour =  (req, res) => {
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

exports.updateTour =  (req, res) => { 
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

exports.deleteTour =  (req, res) => {
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