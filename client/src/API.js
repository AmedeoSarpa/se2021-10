/**
 * All the API calls
 */

import dayjs from "dayjs";

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

//informazioni coda
async function getQueue(dateFilter = null) {
  dateFilter = !!dateFilter ? dateFilter : dayjs().format("DD-MM-YYYY");
  const response = await fetch("/api/queue/" + dateFilter);
  if (response.ok) {
    const JsonServices = await response.json();

    return JsonServices.map((s) => {
      return { ...s };
    });
  } else {
    throw response;
  }
}

/** IF latest is set to true will return only latest called ticket */
async function getServingTicket(latest = false) {
  const response = await fetch("/api/queue/lastserved");

  let servingTicketDefault = { counterId: undefined, idTicket: undefined };

  if (response.ok) {
    const JsonServices = await response.json();

    if (latest && JsonServices.length > 0) {
      if (JsonServices.length === 1) return JsonServices[0];

      const timestamp = Math.min.apply(
        Math,
        JsonServices.map(function (o) {
          return o.timestamp;
        })
      );

      const servingTicketFiltered = JsonServices.filter((i) => {
        return i.timestamp > timestamp;
      })[0];

      return !!servingTicketFiltered
        ? servingTicketFiltered
        : servingTicketDefault;
    } else {
      return JsonServices;
    }
  }

  if (latest) return servingTicketDefault;
  else return [];
}

async function getNextClient(userId, process = false) {
  const response = await fetch(
    "/api/queue/next/" + userId + "/" + (!!process ? "1" : "0")
  );

  if (response.ok) {
    return await response.json();
  } else {
    return 0;
  }
}

//informazioni sportello_servizio
async function getCounterServices() {
  const response = await fetch("/api/counter_service");
  if (response.ok) {
    return await response.json();
  } else {
    return [];
  }
}

// Get all the services
async function getServices() {
  // call: GET /api/services/
  const response = await fetch("/api/services/");
  const JsonServices = await response.json();
  if (response.ok) {
    return JsonServices.map((s) => {
      return {
        id: s.id,
        timeForPerson: s.timeForPerson,
        description: s.description,
        name: s.name,
      };
    });
  } else {
    throw JsonServices; //object with the server error
  }
}

// Insert a new request in the queue
async function addRequest(serviceType) {
  // call: POST /api/request
  return new Promise((resolve, reject) => {
    fetch("/api/request/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        service: serviceType,
        date: dayjs().format("DD-MM-YYYY"),
      }),
    })
      .then((response) => {
        if (response.ok) {
          resolve(response.json());
        } else {
          // analyze the cause of error
          response
            .json()
            .then((message) => {
              reject(message);
            }) // error message in the response body
            .catch(() => {
              reject({ error: "Impossible to read the server answer." });
            }); // something else
        }
      })
      .catch(() => {
        reject({ error: "Impossible to communicate with the server." });
      }); // connection errors
  });
}

const API = {
  logIn,
  logOut,
  getUserInfo,
  getServices,
  getQueue,
  getNextClient,
  getCounterServices,
  addRequest,
  getServingTicket,
};

export default API;
