# DATABASE TABLES

## User
|NAME|TYPE|
|---|---|
|ID|INTEGER|
|username|TEXT|
|password|TEXT|
|is_manager|BOOLEAN|

## Services type
|NAME|TYPE|
|---|---|
|ID|INTEGER|
|time_to_be_served|TIMESTAMP|
|description|TEXT|
|name|TEXT|

## Counter Services 
|NAME|TYPE|
|---|---|
|Container_ID|INTEGER|
|service_type_ID|INTEGER|

## Queue
|NAME|TYPE|
|---|---|
|ID|INTEGER|
|service_type_ID|TEXT|
|expired|BOOLEAN|
|date|TIMESTAMP|
