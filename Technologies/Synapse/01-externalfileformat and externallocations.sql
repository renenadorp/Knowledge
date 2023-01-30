--REPLACE $ env with env 

/* add users 
CREATE LOGIN [AADID] FROM EXTERNAL PROVIDER; 
CREATE USER [NAME@??.com]FROM LOGIN [AADID] 
alter ROLE [db_owner] ADD member [AAD]
 */
--


--CREATE USER FOR DF E.D 
CREATE USER [df-fsebi-$env] FROM EXTERNAL PROVIDER
alter ROLE [db_owner] ADD member [df-fsebi-$env]
GO
---------------------------------------------------------------------------------------------------------------------------------------------

CREATE EXTERNAL FILE FORMAT [csvC] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N',', USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvCH] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N',', FIRST_ROW = 2 , USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvCQ] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N',', STRING_DELIMITER = N'"', USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvCQH] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N',', STRING_DELIMITER = N'"', FIRST_ROW = 2 , USE_TYPE_DEFAULT = False))
GO

CREATE EXTERNAL FILE FORMAT [csvP] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N'|', USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvPH] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N'|', FIRST_ROW = 2 , USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvPQ] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N'|', STRING_DELIMITER = N'"', USE_TYPE_DEFAULT = False))
CREATE EXTERNAL FILE FORMAT [csvPQH] WITH (FORMAT_TYPE = DELIMITEDTEXT, FORMAT_OPTIONS (FIELD_TERMINATOR = N'|', STRING_DELIMITER = N'"', FIRST_ROW = 2 , USE_TYPE_DEFAULT = False))
GO
CREATE EXTERNAL FILE FORMAT [parq] WITH (FORMAT_TYPE = PARQUET)
CREATE EXTERNAL FILE FORMAT [parqS] WITH (FORMAT_TYPE = PARQUET, DATA_COMPRESSION = 'org.apache.hadoop.io.compress.SnappyCodec' )
GO

----------------------
CREATE MASTER KEY;
CREATE DATABASE SCOPED CREDENTIAL SQLMI
WITH
    IDENTITY = 'Managed Identity'
------------------------

--remove type for sql on demand, remove credential when synapse server i.s.o. normal server  --in cicd copy and rename dev to prod 
--for sql pool add with(TYPE = HADOOP, LOCATION)
GO
CREATE SCHEMA dwh; 
GO
CREATE SCHEMA log;
GO
CREATE SCHEMA metadata;
GO 
CREATE SCHEMA stage ;
GO 
CREATE SCHEMA D365FO; 
GO 
CREATE SCHEMA report;
GO 
CREATE SCHEMA help;
GO 
CREATE SCHEMA deploy; 
GO 
CREATE SCHEMA Process; 
GO 

CREATE EXTERNAL DATA SOURCE [dwh]       WITH (LOCATION =                              N'abfss://dwh@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [log]       WITH (LOCATION =                              N'abfss://log@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [metadata]  WITH (LOCATION =                         N'abfss://metadata@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [stage]     WITH (LOCATION =                            N'abfss://stage@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [report]    WITH (LOCATION =                           N'abfss://report@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [help]      WITH (LOCATION =                             N'abfss://help@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
CREATE EXTERNAL DATA SOURCE [D365FO]    WITH (LOCATION = N'abfss://dynamics365-financeandoperations@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])
GO
