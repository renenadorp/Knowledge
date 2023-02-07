# Scanning
## Azure SQL Server

### Prereqs
- Existing SQL Server + Database
- Admin is set on SQL Server (AAD User or Group) ![[Pasted image 20221103160949.png]]
- Purview MSI is added to the DB, and granted reader role. Make sure to login to SQL Server (e.g. using SSMS) using the AAD admin account.
```
CREATE USER [pvdemoefevo-pv] FROM EXTERNAL PROVIDER
GO

EXEC sp_addrolemember 'db_datareader', [pvdemoefevo-pv]
GO
```

- For Lineage extraction additional role is needed
```
EXEC sp_addrolemember 'db_owner', [pvdemoefevo-pv] GO
```

4. 
5. Register Datasource 
6. Choose type Azure SQL Server
7. 