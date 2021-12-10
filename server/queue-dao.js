'use strict';

/* Data Access Object (DAO) module for accessing information about queue */

const db = require('./db');

const dayjs = require('dayjs');

const processNextClient = (client, date) => {

    return new Promise((resolve, reject) => {

        let sqlUpdate = "UPDATE queue SET processed = 1, counter_id = ?, timestamp = ? WHERE id = ? AND date = ?";

        const timestamp = dayjs().valueOf();

        db.all(sqlUpdate, [client.counterID, timestamp, client.ticketID, date], (err, rows) => {

            if (err) {
                console.log(err)
                reject(err);
                return;
            }

            resolve(true);
            return;
        });
    });
}


// Get all the service types
exports.getQueue = (date = null) => {

    //date = dayjs(!!date ? date: dayjs(), ["X", "x", "DD-MM-YYYY"]).format("DD-MM-YYYY");

    date = !!date ? date: dayjs().format("DD-MM-YYYY");
    
    return new Promise((resolve, reject) => {

        const sql = 'SELECT * FROM queue WHERE date = ? and processed = 0';

        db.all(sql, [date], (err, rows) => {

            if (err) {
                console.log(err)
                reject(err);
                return;
            }

            const services = rows.map((s) => ({ idTicket: s.id, idService: s.service_type_id, processed: s.processed, counterId: s.counter_id, date: s.date }));
            resolve(services);
        });
    });
};

/*** Retrieve latest tickets id for each service type */
exports.getServingTicket = () => {

    return new Promise((resolve, reject) => {

        const sql = 'SELECT service_type_id AS serviceId, counter_id AS counterId, MAX(id) AS idTicket, timestamp FROM queue WHERE processed = 1 AND date = ? GROUP BY service_type_id'

        const date = dayjs().format("DD-MM-YYYY");

        db.all(sql, [date], (err, rows) => {

            if (err) {
                console.log(err)
                reject(err);
                return;
            }
            
            resolve(rows);
            return;

        });
    })
}


// Get all the service types
exports.getNextClient = (user, process = 0) => {

    return new Promise((resolve, reject) => {

        const date = dayjs().format("DD-MM-YYYY");
        const client = { serviceID: 0, ticketID: 0, lenght: 0, counterID: 0, time: 0 };

        const sql = 'SELECT q.service_type_id, st.time_for_person AS time, COUNT(*) AS queue_lenght FROM queue AS q, services_types AS st, counter_services AS cs WHERE st.id = cs.service_type_id AND cs.service_type_id = q.service_type_id AND cs.counter_id = ? AND q.date = ? and q.processed = 0 GROUP BY q.service_type_id, st.time_for_person';

        db.all(sql, [user.counter_id, date], (err, rows) => {

            if (err) {
                console.log(err)
                reject(err);
                return;
            }

            for (let i = 0; i < rows.length; i++) {
                if (rows[i].queue_lenght > client.lenght) {
                    client.lenght = rows[i].queue_lenght;
                    client.serviceID = rows[i].service_type_id;
                    client.time = rows[i].time;
                }
                else if (rows[i].queue_lenght === client.lenght && (client.time === 0 || client.time > rows[i].time)) {
                    client.serviceID = rows[i].service_type_id;
                }
            }

            if (client.serviceID) {

                const sqlInner = 'SELECT MIN(id) as nextTicketID FROM queue WHERE date = ? and processed = 0 and service_type_id = ?';

                db.all(sqlInner, [date, client.serviceID], (err, rows) => {

                    if (err) {
                        console.log(err)
                        reject(err);
                        return;
                    }

                    client.ticketID = rows[0].nextTicketID;
                    client.counterID = user.counter_id;

                    if (process === '1') {
                        processNextClient(client, date)
                    }

                    resolve(client);
                    return;
                });
            }
            else {
                resolve(client);
                return;
            }
        });
    });
};
