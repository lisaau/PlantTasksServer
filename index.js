const express = require('express');
const PlantTasksDatabase = require('./src/plantTasks-database');
const app = express();

const PORT = process.env.PORT || 8000;
const DEFAULT_DB_NAME = 'planttasks';
const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
const db = new PlantTasksDatabase(dbName);


// MIDDLEWARE
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bodyDebugMiddleware = require('./src/body-debug-middleware');

app.use(bodyDebugMiddleware);
app.use(bodyParser.urlencoded({ extended: true })); // needed for Postman
app.use(bodyParser.json());
app.use(morgan('tiny'));


// ROUTES
app.get('/plants', (req, res) => {
    db.getAllPlants().then(plants => res.send(plants))
});

app.get('/plant/:id', (req, res) => {
    let id = parseInt(req.params.id)
    db.getPlant(id).then(plant => res.send(plant))
});

app.post('/plant', (req, res) => {
    let { plantName, plantSpecies, plantNotes } = req.body;
    db.addPlant(plantName, plantSpecies, plantNotes).then(plant => res.send(plant))
});

app.delete('/plant', (req, res) => {
    let { plantId } = req.body;
    db.deletePlant(plantId).then(plant => res.send(plant))
});

app.put('/plant', (req, res) => {
    let { plantId, plantName, plantSpecies, plantNotes } = req.body;
    plantId = parseInt(plantId);
    db.editPlant(plantId, plantName, plantSpecies, plantNotes).then(plant => res.send(plant))
});


db.sanityCheck().then(() => {
    app.listen(PORT, () => {
        console.log(`The application is running on localhost:${PORT}`);
    });
})
