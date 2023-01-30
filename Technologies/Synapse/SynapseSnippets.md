[SCR:: Running SQL Requests]
```
select text,((total_elapsed_Time/1000)/60)/60 AS RunHours,* 
from sys.dm_exec_requests
CROSS APPLY sys.dm_exec_sql_text(sql_handle) 
WHERE STatus = 'Running'
order by total_elapsed_Time desc;
```


[SCR:: Object Definitions]
```
SELECT ss.name schema_name, o.name object_name, o.type object_type, sm.definition object_definition 
FROM sys.objects AS o 
JOIN sys.sql_modules AS sm
    ON o.object_id = sm.object_id  
JOIN sys.schemas AS ss
    ON o.schema_id = ss.schema_id 
where 1=1

-- and definition like '%FactSales%'
-- and o.type = 'V'
```

