## API Client

#### API.getQueue(dateFilter = null) 
  * Description: retrieve a list of all ticket in queue by date, default is today
  * Request params: dateFilter
  * Return: an array of object
``` JSON
[{
   "idTicket":12,
   "idService":3,
   "processed":0,
   "counterId":0,
   "date": "16-10-2021"
}]
```

#### API.getServingTicket(latest = false)
  * Description: return latest served tickets for each service type or just the last one over all services
  * Request params: latest
  * Return: object | array of objects
  ``` JSON
  [{
   "idTicket":12,
   "counterId":3,
   "serviceId":5
}]
```
 ``` JSON
 {
   "idTicket":12,
   "counterId":3,
   "serviceId":5
}
```

#### API.getNextClient(userId, process = false)
 * Description: get next the number of next ticket to call
 * Request params: userID, process -> if set to true, will set 'next ticket to call' as processed and assign it to a counter
 * Return: an object
``` JSON
{
   "ticketID":12,
   "counterID":3
}
```

#### API.getCounterServices()
  * Description: retrieve the associated counter id for earch service type
  * Request params: none
  * Return: array of obects
``` JSON
[{
   "counterId":1,
   "serviceId":5
}]
```
