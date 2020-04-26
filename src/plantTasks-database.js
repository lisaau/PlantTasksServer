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

  getPlantsCount() {
    return this.db.one('SELECT count(*) FROM plants').then(r => r.count);
  }

  getAllPlants() {
    return this.db.any('SELECT * FROM plants');
  }

  getPlant(plantId) {
    return this.db.one('SELECT * FROM plants WHERE id = $1', plantId);
  }

  addPlant(plantName, plantSpecies, plantNotes) {
    return this.db.one('INSERT INTO plants (name, species, notes) VALUES($1, $2, $3) RETURNING *',[plantName, plantSpecies, plantNotes]);
  }
  
  deletePlant(plantId) {
    return this.db.one('DELETE FROM plants WHERE id = $1 RETURNING *', plantId);
  }
  
  editPlant(plantId, plantName, plantSpecies, plantNotes) {
    return this.db.one('UPDATE plants SET name = $2, species = $3, notes = $4 WHERE id = $1 RETURNING *', [plantId, plantName, plantSpecies, plantNotes]);
  }

  getTaskInstances() {
    return this.db.any(`SELECT ti.id AS task_instance_id, ti.completed, ti.due_date, t.id AS task_id, t.description, t.frequency
      FROM task_instances AS ti 
      INNER JOIN tasks AS t ON t.id = ti.task_id `)
  }

  getTaskOfPlant(plantId) {
    return this.db.any(`SELECT t.*, p.name 
      FROM tasks AS t
      INNER JOIN plants AS p ON p.id = t.plant_id
      WHERE p.id = $1`, plantId)
  }

  addTask(description, frequency, plantId) {
    return this.db.one('INSERT INTO tasks (plant_id, description, frequency) VALUES($1, $2, $3) RETURNING *', [plantId, description, frequency])
  }

  deleteTask(plantId) {
    return this.db.one('DELETE FROM tasks WHERE id = $1 RETURNING *', plantId);
  }
}

module.exports = PlantTasksDatabase;
