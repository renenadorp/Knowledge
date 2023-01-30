# System Information

## Table Columns

```sql
SELECT     t.name AS 'TableName',
 c.name  AS 'ColumnName'       
FROM        sys.columns c
JOIN        sys.tables  t   ON c.object_id = t.object_id
WHERE      lower( t.name) LIKE '%bv_order%'
and		    lower(c.name) like '%islost%' 
ORDER BY    TableName
            ,ColumnName;
```
