# DATABASE TABLES

## User
|NAME|TYPE|DESCRIPTION|
|---|---|---|
|id|INTEGER|id user|
|username|TEXT|username of the user|
|name|TEXT|name of the user|
|password|TEXT|password of the user|
|is_manager|INTEGER|is a manager or an officer, respectively 1 or 0|
|counter_id|INTEGER|if is managere 0 otherwise value of the assigned counter |

## Services type
|NAME|TYPE|DESCRIPTION|
|---|---|---|
|id|INTEGER|id of the service type|
|time_for_person|TIMESTAMP|average time to serve a person|
|description|TEXT|description of the service|
|name|TEXT|name of the service|

## Counter Services 
|NAME|TYPE|DESCRIPTION|
|---|---|---|
|counter_id|INTEGER|id of the counter|
|service_type_id|INTEGER|service type id that are in the group of this counter|


## Queue
|NAME|TYPE|DESCRIPTION|
|---|---|---|
|id|INTEGER|id of the client|
|service_type_id|TEXT|service type that the client selected|
|processed|INTEGER|default 0, after the costumer has been served it will contain the officer id, maybe usefull for analytics|
|counter_id|INTEGER|default 0, after the costumer has been served it will contain the counter id, maybe usefull for analytics|
|date|TEXT|indicate the day at which the client ask for the ticket|
|timestamp|INTEGER|indicate the time at which the client has been served|
