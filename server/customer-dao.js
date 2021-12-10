'use strict';
/* Data Access Object (DAO) module for accessing information needed by the customer */

const db = require('./db');

//Insert a new request in the queue
exports.addRequest = (service, date) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT MAX(id)+1 as newId FROM queue WHERE date = ?';
    db.all(query, [date], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        let id = rows[0].newId;
        if(!id)
        id = 1;
        const sql = 'INSERT INTO queue VALUES(?, ?, 0, 0, ?, 0)';
        db.run(sql, [id, service, date], (err) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(id);
        });
    });
  })
};

// Get all the service types
exports.listServices = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM services_types';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const services = rows.map(s => ({ id: s.id, timeForPerson: s.time_for_person, description: s.description, name: s.name }));
      resolve(services);
    });
  });
};