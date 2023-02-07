# Query to find privacy columns in database

Query below is meant to find privacy columns. Note: work in progress!

```
select DISTINCT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME
 from INFORMATION_SCHEMA.COLUMNS
where TABLE_SCHEMA in ('ba', 'ia')
and 
(

1=0
OR  (upper(column_name) like '%EMPL%'       AND 1=0) 
OR  (upper(column_name) like '%ADDRESS%'    AND 1=0) 
OR  (upper(column_name) like '%EMAIL%'      AND 1=0) 
OR  (upper(column_name) like '%SOCIAL%'     AND 1=1) 
OR  (upper(column_name) like '%SECURITY%'   AND 1=1) 
OR  (upper(column_name) like '%ILLN%'       AND 1=1) 
OR  (upper(column_name) like '%DISEA%'      AND 1=1) 
OR  (upper(column_name) like '%RELIG%'      AND 1=1) 


)
```
