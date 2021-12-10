'use strict';

const db = require('./db');

// get average time to serve a person for a specific service
exports.getTimeForPerson = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT time_for_person FROM services_types WHERE id = ?'
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({error: 'Service Type not found'});
      else {
        const time = {time_for_person: row.time_for_person};
        resolve(time)
      }
    })
  });
};

// get number of people in the queue
exports.getNPeopleQueue = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT service_type_id, COUNT(*) AS nperson FROM queue WHERE processed=0 GROUP BY service_type_id'
    db.all(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({error: 'Service Type not found'});
      else {
        const nperson = row.map((s) => ({serviceId: s.service_type_id, nperson:s.nperson}));
        resolve(nperson)
      }
    })
  });
};

// Return list of counter_id, nserviceidserverd
exports.getNDifferentTypeForCounter = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT counter_id, COUNT(DISTINCT service_type_id) AS n_service_type FROM counter_services WHERE counter_id in (SELECT counter_id FROM counter_services WHERE service_type_id = ?) GROUP BY counter_id'
    db.all(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({error: 'Service Type not found'});
      else {
        const counters = row.map((s) => ({counterId: s.counter_id, nService:s.n_service_type}));
        resolve(counters)
      }
    })
  });
};

// Return list of counter_id, nserviceidserverd
exports.getCounterServices = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM counter_services';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const services = rows.map((s) => ({ serviceId: s.service_type_id, counterId: s.counter_id }));
      resolve(services);
    });
  });
};

