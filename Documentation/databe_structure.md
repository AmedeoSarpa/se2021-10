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
|container_id|INTEGER|
|service_type_id|INTEGER|

## Queue
|NAME|TYPE|
|---|---|
|id|INTEGER|
|service_type_id|TEXT|
|expired|BOOLEAN|
|date|TIMESTAMP|
