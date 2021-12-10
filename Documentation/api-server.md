## API Server

#### POST `/api/sessions`
  * Description: create a new session
  * Request params: none
  * Request body: an object
``` JSON
{
   "username":"john.doe@demo01.it",
   "password":"password"
}
```
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
{
   "id":1,
   "username":"john.doe@demo01.it",
   "name":"John Doe",
   "isManager":true
}
```
  * Error responses: `401 Unauthorized` 

#### DELETE `/api/sessions/current`
  * Description: close the current session (logout)
  * Request params: none
  * Request body: none
  * Response: `200 OK` (success)
  * Response body: none
  * Error responses: `500 Internal Server Error` (generic error)

#### GET `/api/sessions/current`
  * Description: check if user is logged in
  * Request params: none
  * Request body: none
  * Response: `200 OK` (success)
  * Response body: none
  * Error responses:  `401 Unauthorized` (if user is not authenticated)

#### GET `/api/user/:id`
  * Description: get user details
  * Request params: userID
  * Request body: none
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
{
   "id":1,
   "username":"john.doe@demo01.it",
   "name":"John Doe",
   "isManager":true
}
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)


#### GET `/api/queue/next/:userID/:process`
  * Description: get next the number of next ticket to call
  * Request params: userID, process -> if set to true, will set 'next ticket to call' as processed and assign it to a counter
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
{
   "ticketID":12,
   "counterID":3
}
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)

#### GET `/api/queue/lastserved`
  * Description: retrieve a list of latest called tickets for each service type
  * Response: `200 OK` (success)
  * Response body: an array of objects
``` JSON
[{
   "idTicket":12,
   "counterId":3,
   "serviceId":5
}]
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)


#### GET `/api/queue/:date`
  * Description: retrieve a list of all non processed tickets by date, default today
  * Response: `200 OK` (success)
  * Request params: date -> to limit search for analytics purpose
  * Response body: an array of objects
``` JSON
[{
   "idTicket":12,
   "idService":3,
   "processed":0,
   "counterId":0,
   "date": "16-10-2021"
}]
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)


#### GET `/api/:service_id/average_time`
  * Description: get average_time of a service
  * Request params: service_id
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
{
   "time_for_person":12
}
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)

#### GET `/api/number_of_people_in_queue`
  * Description: get number of people that are in queue and the service
    type
  * Request params: service_id
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
[
  {
    "serviceId":0,
    "nperson":1
  },
  {
    "serviceId":1,
    "nperson":4
  },
  {
    "serviceId":2,
    "nperson":3
  }
]
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)

#### GET `/api/counter/counter_that_server_type/:service_id`
  * Description: get the number of different service type that a counter serve
    that also have the service id asked
  * Request params: service_id
  * Response: `200 OK` (success)
  * Response body: an object
``` JSON
[
  {
    "counterId":1,
    "nService":1
  },
  {
    "counterId":2,
    "nService":3
  }
]
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)

#### GET `/api/services`
  * Description: get the different service types that a customer can ask
  * Request params: none
  * Response: `200 OK` (success)
  * Response body: an array of objects
``` JSON
[
  {
    "id": 1, 
    "timeForPerson": 15, 
    "description": "send mail", 
    "name": "service1"
  },
  {
    "id": 2, 
    "timeForPerson": 10, 
    "description": "send money", 
    "name": "service2"
  }
]
```
  * Error responses:  `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)

#### POST `/api/request`
  * Description: Add a new request in the queue
  * Request params: none
  * Request body: an object
``` JSON
{
   "service":1,
   "date":"20-10-2021"
}
```
  * Response: `200 OK` (success)
  * Response body: an integer that represent the number of the new ticket
``` JSON
51
```
  * Error responses: `503 Service Unavailable` (database error), `500 Internal Server Error` (generic error)
