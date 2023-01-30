# Overview

1. Azure: Create Synapse workspace (e.g. "syn001")
2. Azure: Create user with admin rights for Synapse (e.g."SynAdmin")
3. Azure: Add role "Storage Blob Data Contributor" to Synapse MI (same as Synapse workspace name)
4. SSMS: Login with admin user ("SynAdmin")
5. SSMS: Create user with same name as Synapse instance ("syn001" )
6. SSMS: Create database scoped credential "SQLMI"
7. SSMS: Add role "db_owner" to user "syn001"
8. SSMS: Create external file format "CSV"
9. SSMS: Create external data source, pointing to storage account / container, 
10. SSMS: Create external views, referencing external datasource and file format

# Example Code
Below are code snippets used for a projects, but are not error free.
Please select statements that you need.


## Step 1
```
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

  

--remove type for sql on demand, remove credential when synapse server i.s.o. normal server  --in cicd copy and rename dev to prod

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

  

CREATE EXTERNAL DATA SOURCE [dwh]       WITH (LOCATION =                              N'abfss://dwh@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [log]       WITH (LOCATION =                              N'abfss://log@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [metadata]  WITH (LOCATION =                         N'abfss://metadata@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [stage]     WITH (LOCATION =                            N'abfss://stage@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [report]    WITH (LOCATION =                           N'abfss://report@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [help]      WITH (LOCATION =                             N'abfss://help@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

CREATE EXTERNAL DATA SOURCE [D365FO]    WITH (LOCATION = N'abfss://dynamics365-financeandoperations@stfsebi$env.dfs.core.windows.net', CREDENTIAL = [SQLMI])

GO
```
## Step 2
```
/****** Object:  View [metadata].[d365ce_json]    Script Date: 23/12/2022 10:42:36 ******/

SET ANSI_NULLS ON

GO

  

SET QUOTED_IDENTIFIER ON

GO

  

/****** Object:  View [metadata].[d365ce_json]    Script Date: 11/8/2022 2:09:29 PM ******/

CREATE OR ALTER view [metadata].[d365ce_json] as (

  

select jsonContent

FROM

OPENROWSET(BULK '###############[containerURL]#############',

FORMAT = 'CSV',

FIELDQUOTE = '0x0b',

FIELDTERMINATOR ='0x0b'

)

WITH (

jsonContent varchar(MAX)

  

) as [r]

)

GO
```
## Step 3
```
/****** Object:  View [metadata].[SourceInformation_CE]    Script Date: 11/8/2022 1:30:28 PM ******/

CREATE OR ALTER view [metadata].[SourceInformation<SourceSystem>] as ( --.SourceInformation_CE

SELECT Connection = '<SourceConnection>' --Schema name > D365CE for example

    ,ContainerURL = '<Link to the data lake container>'

    ,[EntityName]            = E.EntityName

    ,[AttributeName]        = C.AttributeName

    ,[OriginalDataType]        =  C.ColDataType

    ,C.ColDataType

    ,C.ColMaxLength

    ,C.ColPrecision

    ,[OrdinalPosition]        = CONVERT(INT,k.[key])+1

    ,[ExtSQLDataType] =

           CASE

                  WHEN ISJSON(colDataType)=1 THEN 'INT'

                  WHEN colDataType IN ('int32','integer')        THEN 'INT'

                  WHEN colDataType IN ('int64','bigInteger') THEN 'BIGINT'

                  WHEN colDataType IN ('double','decimal')  THEN 'numeric(38,18)'

                  WHEN colDataType IN ('Time')      THEN 'nvarchar(70)' --'Time'

                  WHEN colDataType IN ('string','binary') AND colMaxLength <= 0  THEN 'nvarchar (4000)'

                  WHEN colDataType IN ('string')      THEN 'nvarchar(4000)'

            WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 1 AND 8 THEN 'nvarchar (8)'--'nvarchar(8)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 8 AND 32 THEN 'nvarchar (32)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 32 AND 128 THEN 'nvarchar (128)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 128 AND 1024 THEN 'nvarchar (1024)'

                  WHEN colDataType IN ('string')  AND colMaxLength > 1024 THEN 'nvarchar (4000)'

                  WHEN colDataType IN ('date')        THEN 'Nvarchar(70)'

                  WHEN colDataType IN ('dateTime', 'dateTimeOffset')      THEN 'Nvarchar(70)' --'datetime2'--'nvarchar(70)'

                  WHEN colDataType IN ('GUID')        THEN 'UNIQUEIDENTIFIER' --'nvarchar(36)'

                  WHEN colDataType IN('boolean')      THEN 'nvarchar(8)' --'bit'

            ELSE '�!'+colDataType

          END

  FROM [metadata].[D365CE_JSON] A

      CROSS APPLY OPENJSON(A.[jsonContent])

                            with ( PartitionName    varchar(126) N'$.name'

                                  ,discription        varchar(126) N'$.description'    

                                --,filePath            varchar(126) '$.FilePath'

                                  ,entities            Nvarchar(MAX) N'$.entities'    AS JSON

                            )M

    CROSS APPLY OPENJSON(M.entities)

                            with (EntityName        varchar(126) N'$.name'  

                                ,Entitydiscription  varchar(126) N'$.description'    

                                ,annotations        Nvarchar(MAx) N'$.annotations'        AS JSON

                                ,attributes            Nvarchar(MAx) N'$.attributes'        AS JSON

                                ,partitions            Nvarchar(MAx) N'$.partitions'        AS JSON

                                ,Firstpartitions    Nvarchar(MAx) N'$.partitions[0]'    AS JSON

                                )E

    --CROSS APPLY OPENJSON(E.Firstpartitions) --assumption all partitions have the same values

    --                        with (FirstFileName        varchar(126)  N'$.name'

    --                            ,FirstPartitionURL  varchar(126)  N'$.location'    

    --                            ,fileFormatSettings Nvarchar(MAx) N'$.fileFormatSettings'    AS JSON

    --                            ,FormatType            varchar(127)  N'$.fileFormatSettings."$type"'    

    --                            ,HasHeader            varchar(127)  N'$.fileFormatSettings.columnHeaders'    

    --                            ,delimiter            varchar(127)  N'$.fileFormatSettings.delimiter'    

    --                            ,quoteStyle            varchar(127)  N'$.fileFormatSettings.quoteStyle'    

    --                            ,csvStyle            varchar(127)  N'$.fileFormatSettings.csvStyle'    

    --                            ,encoding            varchar(127)  N'$.fileFormatSettings.encoding'    

    --                            )FP

    CROSS APPLY OPENJSON(E.attributes,'$') K

    CROSS APPLY OPENJSON (K.Value)

                WITH (

                     AttributeName    varchar(124) N'$.name'

                     ,ColDesc        varchar(124) N'$.description'

                     ,ColDataFormat varchar(MAX) N'$.dataFormat'

                     ,ColDataType   varchar(MAX) N'$.dataType'

                     ,ColPrecision   varchar(124) N'$.Precision'

                     ,ColMaxLength   varchar(124) N'$.maxLength'

                )C

)

GO

```
## Step 4 
```
/****** Object:  View [metadata].[SourceInformation_CE]    Script Date: 11/8/2022 1:30:28 PM ******/

CREATE OR ALTER view [metadata].[SourceInformation<SourceSystem>] as ( --.SourceInformation_CE

SELECT Connection = '<SourceConnection>' --Schema name > D365CE for example

    ,ContainerURL = '<Link to the data lake container>'

    ,[EntityName]            = E.EntityName

    ,[AttributeName]        = C.AttributeName

    ,[OriginalDataType]        =  C.ColDataType

    ,C.ColDataType

    ,C.ColMaxLength

    ,C.ColPrecision

    ,[OrdinalPosition]        = CONVERT(INT,k.[key])+1

    ,[ExtSQLDataType] =

           CASE

                  WHEN ISJSON(colDataType)=1 THEN 'INT'

                  WHEN colDataType IN ('int32','integer')        THEN 'INT'

                  WHEN colDataType IN ('int64','bigInteger') THEN 'BIGINT'

                  WHEN colDataType IN ('double','decimal')  THEN 'numeric(38,18)'

                  WHEN colDataType IN ('Time')      THEN 'nvarchar(70)' --'Time'

                  WHEN colDataType IN ('string','binary') AND colMaxLength <= 0  THEN 'nvarchar (4000)'

                  WHEN colDataType IN ('string')      THEN 'nvarchar(4000)'

            WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 1 AND 8 THEN 'nvarchar (8)'--'nvarchar(8)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 8 AND 32 THEN 'nvarchar (32)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 32 AND 128 THEN 'nvarchar (128)'

                  WHEN colDataType IN ('string')  AND colMaxLength BETWEEN 128 AND 1024 THEN 'nvarchar (1024)'

                  WHEN colDataType IN ('string')  AND colMaxLength > 1024 THEN 'nvarchar (4000)'

                  WHEN colDataType IN ('date')        THEN 'Nvarchar(70)'

                  WHEN colDataType IN ('dateTime', 'dateTimeOffset')      THEN 'Nvarchar(70)' --'datetime2'--'nvarchar(70)'

                  WHEN colDataType IN ('GUID')        THEN 'UNIQUEIDENTIFIER' --'nvarchar(36)'

                  WHEN colDataType IN('boolean')      THEN 'nvarchar(8)' --'bit'

            ELSE '�!'+colDataType

          END

  FROM [metadata].[D365CE_JSON] A

      CROSS APPLY OPENJSON(A.[jsonContent])

                            with ( PartitionName    varchar(126) N'$.name'

                                  ,discription        varchar(126) N'$.description'    

                                --,filePath            varchar(126) '$.FilePath'

                                  ,entities            Nvarchar(MAX) N'$.entities'    AS JSON

                            )M

    CROSS APPLY OPENJSON(M.entities)

                            with (EntityName        varchar(126) N'$.name'  

                                ,Entitydiscription  varchar(126) N'$.description'    

                                ,annotations        Nvarchar(MAx) N'$.annotations'        AS JSON

                                ,attributes            Nvarchar(MAx) N'$.attributes'        AS JSON

                                ,partitions            Nvarchar(MAx) N'$.partitions'        AS JSON

                                ,Firstpartitions    Nvarchar(MAx) N'$.partitions[0]'    AS JSON

                                )E

    --CROSS APPLY OPENJSON(E.Firstpartitions) --assumption all partitions have the same values

    --                        with (FirstFileName        varchar(126)  N'$.name'

    --                            ,FirstPartitionURL  varchar(126)  N'$.location'    

    --                            ,fileFormatSettings Nvarchar(MAx) N'$.fileFormatSettings'    AS JSON

    --                            ,FormatType            varchar(127)  N'$.fileFormatSettings."$type"'    

    --                            ,HasHeader            varchar(127)  N'$.fileFormatSettings.columnHeaders'    

    --                            ,delimiter            varchar(127)  N'$.fileFormatSettings.delimiter'    

    --                            ,quoteStyle            varchar(127)  N'$.fileFormatSettings.quoteStyle'    

    --                            ,csvStyle            varchar(127)  N'$.fileFormatSettings.csvStyle'    

    --                            ,encoding            varchar(127)  N'$.fileFormatSettings.encoding'    

    --                            )FP

    CROSS APPLY OPENJSON(E.attributes,'$') K

    CROSS APPLY OPENJSON (K.Value)

                WITH (

                     AttributeName    varchar(124) N'$.name'

                     ,ColDesc        varchar(124) N'$.description'

                     ,ColDataFormat varchar(MAX) N'$.dataFormat'

                     ,ColDataType   varchar(MAX) N'$.dataType'

                     ,ColPrecision   varchar(124) N'$.Precision'

                     ,ColMaxLength   varchar(124) N'$.maxLength'

                )C

)

GO
```

