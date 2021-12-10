# DATABASE TABLES

## User
|NAME|TYPE|DESCRIPTION|
|---|---|---|
|id|INTEGER|id user|
|username|TEXT|username of the user|
|name|TEXT|name of the user|
|password|TEXT|password of the user|
|is_manager|BOOLEAN|is a manager or an officer, is_manager=1 if is the managaer|

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
|date|TIMESTAMP|indicate the time at which the client ask for the ticket|