const pgp = require('pg-promise')();

/**
 * An object that has methods matching useful database queries.
 * Use `this.db` to access a connected pg-promise connection.
 * Make sure to return the promise!
 *
 * For examples of other queries, see
 * [pghttps://github.com/vitaly-t/pg-promise/wiki/Learn-by-Example
 */
class PlantTasksDatabase {
  /**
   * @param {String} name - name of database to connect to
   */
  constructor(name) {
    const connectionString = process.env.DATABASE_URL || `postgres://localhost:5432/${name}`;
    console.log('Postgres DB => ', connectionString);
    this.db = pgp(connectionString);
  }

  sanityCheck() {
    console.log('\tTesting database connection...');
    return this.getPlantsCount().then(count =>
      console.log(`\t✔️ Found ${count} plants.`)
    );
  }

  // Plants
  getPlantsCount() {
    return this.db.one('SELECT count(*) FROM plants').then(r => r.count);
  }

  getAllPlants(userId) {
    return this.db.any('SELECT * FROM plants WHERE user_id = $1 ORDER BY id', userId);
  }

  getPlant(plantId, userId) {
    return this.db.one('SELECT * FROM plants WHERE id = $1 AND user_id = $2', [plantId, userId]);
  }

  addPlant(plantName, plantSpecies, plantNotes, userId) {
    return this.db.one('INSERT INTO plants (name, species, notes, user_id) VALUES($1, $2, $3, $4) RETURNING *',[plantName, plantSpecies, plantNotes, userId]);
  }
  
  deletePlant(plantId, userId) {
    return this.db.one('DELETE FROM plants WHERE id = $1 AND user_id = $2 RETURNING *', [plantId, userId]);
  }
  
  editPlant(plantId, plantName, plantSpecies, plantNotes, userId) {
    return this.db.one('UPDATE plants SET name = $2, species = $3, notes = $4 WHERE id = $1 AND user_id = $5 RETURNING *', [plantId, plantName, plantSpecies, plantNotes, userId]);
  }
  
  // Tasks
  getTaskOfPlant(plantId, userId) {
    return this.db.any(`SELECT t.*, p.name 
    FROM tasks AS t
    INNER JOIN plants AS p ON p.id = t.plant_id
    WHERE p.id = $1 AND p.user_id = $2`, [plantId, userId])
  }
  
  getAllTasks(userId) {
    return this.db.any(`SELECT t.* FROM tasks AS t 
      INNER JOIN plants AS p ON p.id = t.plant_id
      WHERE user_id = $1
      ORDER BY t.id`, userId)
  }
  
  addTask(description, frequency, plantId, userId) {
    return this.db.one(`INSERT INTO tasks (description, frequency, plant_id) 
      SELECT $1, $2, $3
      WHERE EXISTS (SELECT * FROM plants WHERE user_id = $4)
      RETURNING *`, [description, frequency, plantId, userId])
  }
  
  deleteTask(taskId, userId) {
    return this.db.one(`DELETE FROM tasks AS t 
    USING plants AS p
    WHERE t.id = $1 AND p.user_id = $2
    RETURNING t.*`, [taskId, userId]);
  }
  
  // Task Instances
  getTaskInstances(userId) {
    return this.db.any(`SELECT ti.id AS task_instance_id, ti.completed, ti.due_date, t.id AS task_id, t.description, t.frequency, p.id AS plant_id, p.name
      FROM task_instances AS ti 
      INNER JOIN tasks AS t ON t.id = ti.task_id
      INNER JOIN plants AS p on p.id = t.plant_id
      WHERE p.user_id = $1`, userId)
  }

  getTodayTaskInstances(userId) {
    return this.db.any(`SELECT ti.id AS task_instance_id, ti.completed, ti.due_date, t.id AS task_id, t.description, t.frequency, p.id AS plant_id, p.name
    FROM task_instances AS ti
    INNER JOIN tasks AS t ON t.id = ti.task_id
    INNER JOIN plants AS p on p.id = t.plant_id
    WHERE date_trunc('day', ti.due_date) = date_trunc('day', now() AT TIME ZONE 'UTC') AND p.user_id = $1`, userId)
  }
  
  getTaskInstancesByDay(date, userId) {
    return this.db.any(`SELECT ti.id AS task_instance_id, ti.completed, ti.due_date, t.id AS task_id, t.description, t.frequency, p.id AS plant_id, p.name
    FROM task_instances AS ti 
    INNER JOIN tasks AS t ON t.id = ti.task_id
    INNER JOIN plants AS p on p.id = t.plant_id 
    WHERE date_trunc('day', ti.due_date) = $1 AND p.user_id = $2)`, [date, userId])
  }

  updateTaskInstance(status, taskInstanceId, userId) {
    return this.db.one(`UPDATE task_instances SET completed = $1 
      WHERE id = (SELECT ti.id FROM task_instances AS ti 
        INNER JOIN tasks AS t ON t.id = ti.task_id
        INNER JOIN plants AS p on p.id = t.plant_id
        WHERE ti.id = $2 AND p.user_id = $3)
      RETURNING *`, [status, taskInstanceId, userId])
  }

  insertTaskWithTaskInstances(description, frequency, plantId, userId) {
    return db.one('insert into tasks(description, frequency, plantId) values($1, $2, $3) WHERE EXISTS (SELECT * FROM plants AS p WHERE p.id = $3 AND p.user_id = $4) RETURNING *', [description, frequency, plantId, userId])
      .then(task => {
         instance_promises = [...Array(10).keys()].map(i =>
           db.one(`insert into task_instances(task_id, due_date) 
                  values($1, NOW() + task.frequency * INTERVAL '${i} day')`, task.id)
        )
         return Promise.all(instance_promises).then(instance_data => ({
           task: task,
           instances: instance_data,
         }))
      });
  }
  
}

module.exports = PlantTasksDatabase;
