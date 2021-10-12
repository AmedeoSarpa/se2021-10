# DATABASE TABLES

## User
|NAME|TYPE|
|---|---|
|id|INTEGER|
|username|TEXT|
|password|TEXT|
|is_manager|BOOLEAN|

## Services type
|NAME|TYPE|
|---|---|
|id|INTEGER|
|time_for_person|TIMESTAMP|
|description|TEXT|
|name|TEXT|

## Counter Services 
|NAME|TYPE|
|---|---|
|conter_id|INTEGER|
|service_type_id|INTEGER|

## Queue
|NAME|TYPE|
|---|---|
|id|INTEGER|
|service_type_id|TEXT|
|processed|INTEGER|
|date|TIMESTAMP|

* processed -> default 0, after the costumer has been served it will contain the officer id, maybe usefull for analytics
* from all entries of the queue are considered valid only todays ones, selected by queue.date field 
