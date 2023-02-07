# QUALIFY
## Use Case: 
Use an analytical function in where clause 

## Example
```
QUALIFY first_value(recid) OVER ( PARTITION BY "PARTITION", DATAAREAID, BOMID ORDER BY HVR_INTEGRATION_KEY desc ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING) = recid
```
