const express = require('express');

// TEST DATA
const plants = [
    { id: 1, name: 'Plant #1', species: 'Air plant' },
    { id: 2, name: 'Plant #2', species: 'tulip' }
];

// MIDDLEWARE
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

app.get('/test', (req, res) => {
    res.send('hello');
});

app.get('/plants', (req, res) => {
    res.json(plants);
});

app.get('/plants/:id', (req, res) => {
    let id = parseInt(req.params.id)
    res.json(plants.filter(plant => plant['id'] === id));
});

app.post('/plant', async (req, res) => {
    let { plantId, plantName, plantSpecies } = req.body;
    await plants.push({'id': plantId, 'name': plantName, 'species': plantSpecies});
    res.sendStatus(200)
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`The application is running on localhost:${PORT}`);
});
