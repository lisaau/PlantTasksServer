const express = require('express');
const PlantTasksDatabase = require('./src/plantTasks-database');
const app = express();

const PORT = process.env.PORT || 8000;
const DEFAULT_DB_NAME = 'planttasks';
const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;
const db = new PlantTasksDatabase(dbName);

const jwksRsa = require("jwks-rsa");
const jwt = require("express-jwt");

const authConfig = {
    domain: "dev-skxc8k2i.auth0.com"
};

const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`
    }),

    // audience: authConfig.audience,
    issuer: `https://${authConfig.domain}/`,
    algorithm: ["RS256"]
});

// ---------- MIDDLEWARE ---------- //
const bodyParser = require('body-parser');
const morgan = require('morgan');
const bodyDebugMiddleware = require('./src/body-debug-middleware');

app.use(bodyDebugMiddleware);
app.use(bodyParser.urlencoded({ extended: true })); // needed for Postman
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(checkJwt);


// ---------- ROUTES ---------- //
// req.user.sub is the userId forwarded from Auth0 on the client side

// ----- Plants ----- //
app.get('/plants', (req, res) => {
    console.log(req.user.sub)
    db.getAllPlants(req.user.sub).then(plants => res.send(plants))
});

app.post('/plant', (req, res) => {
    let { plantName, plantSpecies, plantNotes } = req.body;
    db.addPlant(plantName, plantSpecies, plantNotes, req.user.sub).then(plant => res.send(plant))
});

app.delete('/plant', (req, res) => {
    let { plantId } = req.body;
    db.deletePlant(plantId, req.user.sub).then(plant => res.send(plant))
});

app.put('/plant', (req, res) => {
    let { plantId, plantName, plantSpecies, plantNotes } = req.body;
    plantId = parseInt(plantId);
    db.editPlant(plantId, plantName, plantSpecies, plantNotes, req.user.sub).then(plant => res.send(plant))
});

app.get('/plants/:id', (req, res) => {
    let id = parseInt(req.params.id)
    db.getPlant(id, req.user.sub).then(plant => res.send(plant))
});

// ----- Tasks ----- //
app.get('/tasks/plant/:id', (req, res) => {
    let id = parseInt(req.params.id)
    db.getTaskOfPlant(id, req.user.sub).then(tasks => res.send(tasks))
})

app.get('/tasks', (req, res) => {
    db.getAllTasks(req.user.sub).then(tasks => res.send(tasks))
})

app.post('/task', (req, res) => {
    let { description, frequency, plantId } = req.body;
    db.addTask(description, frequency, plantId, req.user.sub).then(task => res.send(task))
})

app.delete('/task', (req, res) => {
    let { taskId } = req.body;
    db.deleteTask(taskId, req.user.sub).then(task => res.send(task))
});

// result is an object with task that's added and task instance for the current day
app.post('/task-with-taskinstance', (req, res) => {
    let { description, frequency, plantId } = req.body;
    db.insertTaskWithTaskInstances(description, frequency, plantId, req.user.sub).then(taskWithTaskInstance => res.send(taskWithTaskInstance))
})


// ----- Task Instances ----- //
app.get('/taskinstances', (req, res) => {
    db.getTaskInstances(req.user.sub).then(taskInstances => res.send(taskInstances))
})

app.get('/taskinstances/today', (req, res) => {
    db.getTodayTaskInstances(req.user.sub).then(taskInstances => res.send(taskInstances))
})

app.get('/taskinstances/:date', (req, res) => {
    let date = req.params.date
    console.log(date)
    db.getTaskInstancesByDay(date, req.user.sub).then(taskInstances => res.send(taskInstances))
})

app.put('/taskinstance', (req, res) => {
    let { status, taskInstanceId } = req.body;
    db.updateTaskInstance(status, taskInstanceId, req.user.sub).then(taskInstance => res.send(taskInstance))
});

app.post('/taskinstances/generate', (req, res) => {
    db.generateFutureTaskInstances(req.user.sub).then(instances => console.log('Task instances successfully generated:', instances))
})

// Running server
db.sanityCheck().then(() => {
    app.listen(PORT, () => {
        console.log(`The application is running on localhost:${PORT}`);
    });
})
