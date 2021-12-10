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
