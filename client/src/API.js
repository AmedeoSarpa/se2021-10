/**
 * All the API calls
 */

import dayjs from 'dayjs';

function getJson(httpResponsePromise) {
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {
          // always return {} from server, never null or non json, otherwise it will fail
          response
            .json()
            .then((json) => resolve(json))
            .catch((err) => reject({ error: "Cannot parse server response" }));
        } else {
          // analyze the cause of error
          response
            .json()
            .then((obj) => reject(obj)) // error msg in the response body
            .catch((err) => reject({ error: "Cannot parse server response" })); // something else
        }
      })
      .catch((err) => reject({ error: "Cannot communicate" })); // connection error
  });
}

/**
 * USER API
 */

async function logIn(credentials) {
  let response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    } catch (err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch("/api/sessions/current", { method: "DELETE" });
}

async function getUserInfo(userID) {
  const response = await (userID
    ? fetch("/api/user/" + userID)
    : fetch("/api/sessions/current"));
  const userInfo = await response.json();

  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;
  }
}

//chiamata per ottenere tutti i servizi disponibili
async function getServices() {
  const response = await fetch("/api/services");

  const responseBody = await response.json();
  return responseBody;
}

//informazioni coda
async function getQueue() {
  const response = await fetch("/api/queue");

  const responseBody = await response.json();
  return responseBody;
}

//informazioni sportello_servizio
async function getCounterServices() {
  const response = await fetch("/api/counter_service");

  const responseBody = await response.json();
  return responseBody;
}

// Insert a new request in the queue
async function addRequest(serviceType) {
  // call: POST /api/request
  return new Promise((resolve, reject) => {
    fetch('/api/request/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ service: serviceType, date: dayjs().format("DD-MM-YYYY") }
      )}).then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Impossible to read the server answer." }) }); // something else
        }
    }).catch(() => { reject({ error: "Impossible to communicate with the server." }) }); // connection errors
  });
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  getServices,
  getQueue,
  getCounterServices,
  addRequest
};

export default API;
