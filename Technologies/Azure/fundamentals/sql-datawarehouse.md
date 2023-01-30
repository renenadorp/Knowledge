# SQL Datawarehouse

## Create distributed tables

SQL Data Warehouse divides your data into 60 databases. Each individual database is called a _distribution_. After you've loaded data into each table, SQL Data Warehouse has to know how to divide the data across these 60 distributions.

The distribution method is defined at the table level. There are three choices:

* **Replicated**. The replicated table is fully copied to a distribution database on each Compute node. Replicating a table removes the need to transfer data among Compute nodes before a join or aggregation. Replicated tables are feasible only with small tables because of the extra storage required to store the full table on each Compute node.
* **Round robin**. Data is distributed evenly but randomly.
* **Hash distributed**. Data is distributed based on hashing values from a single column.

By default, when you don't define a data distribution method, your table will use the round robin distribution method. As you become more sophisticated in your implementation, you'll want to consider using hash distributed tables to minimize data movement, which will in turn optimize query performance.

## Distributed Tables

```
CREATE TABLE [dbo].[EmployeeBasic]
(
  [EmployeeID] int NOT NULL,
  [EmployeeName] varchar(30) NOT NULL,
  [DOB] date NOT NULL,
  [Address] varchar(50) NOT NULL,
  [BloodGroup] nvarchar(2) NOT NULL
)
WITH
(
  CLUSTERED COLUMNSTORE INDEX,
  DISTRIBUTION = HASH([EmployeeID])
);

```

```
CREATE TABLE [dbo].[Sales]
 (
   [ProductKey] int NOT NULL,
   [OrderDateKey] int NOT NULL,
   [CustomerKey] int NOT NULL,
   [PromotionKey] int NOT NULL,
   [SalesOrderNumber] nvarchar(20) NOT NULL,
   [OrderQuantity] smallint NOT NULL,
   [UnitPrice] money NOT NULL,
   [SalesAmount] money NOT NULL
 )
 WITH
 (
   CLUSTERED COLUMNSTORE INDEX,
   DISTRIBUTION = ROUND_ROBIN
 );
```

```
CREATE TABLE [dbo].[States]
  (
    [StateKey] int NOT NULL,
    [State] nvarchar(20) NOT NULL
  )
  WITH
  (
    CLUSTERED COLUMNSTORE INDEX,
    DISTRIBUTION = REPLICATE
  );
```

## Polybase

PolyBase is a technology that accesses data outside of a database via the T-SQL language. In Azure SQL Data Warehouse, you can import and export data to and from Azure Blob storage and Azure Data Lake Store.

```
CREATE EXTERNAL DATA SOURCE LabAzureStorage
 WITH
 (
   TYPE = Hadoop,
   LOCATION = 'wasbs://labdata@<Name_Of_Storage_Account>.blob.core.windows.net/'
 );
```

*   TYPE = `[ HADOOP | SHARD_MAP_MANAGER | RDBMS | BLOB_STORAGE ]`

    Specifies the data source type. Use `HADOOP` when the external data source is Hadoop or Azure Blob storage for Hadoop.
*   LOCATION = `<location_path>`

    For Azure Blob storage with Hadoop, specifies the URI for connecting to Azure Blob storage.
* LOCATION = `wasb[s]://container@account_name.blob.core.windows.net`

### Define the external file format <a href="#define-the-external-file-format" id="define-the-external-file-format"></a>

A definition of the external file format helps SQL Data Warehouse parse the format of the external file to be loaded. It defines the field terminator, string delimiter, and date field format. These properties help with capturing the fields in a file.

*   Clear the query window and execute these statements to define the external file format:SQLCopy

    ```
    CREATE EXTERNAL FILE FORMAT TextFileFormat
    WITH
    (
      FORMAT_TYPE = DELIMITEDTEXT,
      FORMAT_OPTIONS (
        FIELD_TERMINATOR = ',',
        STRING_DELIMITER = '',
        DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss.fff',
        USE_TYPE_DEFAULT = FALSE
      )
    );
    ```

    * FIELD\_TERMINATOR = `field_terminator`. Applies only to delimited text files. This property specifies one or more characters that mark the end of each field (column) in the text-delimited file. The external file used for this exercise uses the comma (,) as the text delimiter.
    * STRING\_DELIMITER = `string_delimiter`. Specifies the field terminator for data of type string in the text-delimited file.
    * DATE\_FORMAT = `datetime_format`. Specifies a custom format for all date and time data that appears in a delimited text file. The TransactionDate field holds date values (for example, "2017-01-24 00:00:00.000").

### Create a schema for the external table <a href="#create-a-schema-for-the-external-table" id="create-a-schema-for-the-external-table"></a>

*   Clear the query window and run this statement to create a schema for the external table:SQLCopy

    ```
    CREATE SCHEMA [asb];
    ```

### Create the external table <a href="#create-the-external-table" id="create-the-external-table"></a>

External tables refer to data from an external data source. Data isn't stored in SQL Data Warehouse.

1.  Clear the query window and run these statements to define an external table

    ```
    CREATE EXTERNAL TABLE [asb].[Transaction]
    (
      [TransactionId] [int] NOT NULL,
      [ProductId] [int] NOT NULL,
      [DateApsId] [int] NULL,
      [StoreId] [int] NOT NULL,
      [StaffId] [int] NOT NULL,
      [RetailChannelId] [int] NOT NULL,
      [CustomerSegmentId] [int] NOT NULL,
      [PaymentMethodId] [int] NOT NULL,
      [COGS] [money] NULL,
      [SaleQuantity] [int] NOT NULL,
      [UnitPrice] [money] NULL,
      [SaleAmount] [money] NULL,
      [TaxRate] [money] NULL,
      [TaxAmount] [money] NULL,
      [GrossAmount] [money] NULL,
      [TenderedAmount] [money] NULL,
      [ProfitMargin] [money] NULL,
      [PaymentCount] [int] NULL,
      [ReturnQuantity] [int] NULL,
      [ReturnAmount] [money] NULL,
      [TransactionDate] [datetime] NULL,
      [CogsPerUnit] [money] NULL
    )
    WITH 
    (
      LOCATION='Transaction.txt', DATA_SOURCE = LabAzureStorage, FILE_FORMAT = TextFileFormat, REJECT_TYPE = VALUE, REJECT_VALUE = 1
    );
    ```

Now, the data can be read using regular SQL. Note that this only reads data from the external file, it does not populate the data in the database table

```
SELECT * FROM [asb].[Transaction]
```

To populate the  database table from the external file, use the following statement:

```
CREATE TABLE [cso].[Transaction]
WITH
(
  DISTRIBUTION = HASH([TransactionId])
)
AS
SELECT * FROM [asb].[Transaction]
OPTION (LABEL = 'CTAS : Load [cso].[Transaction]');
```

## DataBricks - SQL DW

You can access Azure SQL Data Warehouse (SQL DW) from Azure Databricks using the SQL Data Warehouse connector (referred to as the SQL DW connector), a data source implementation for Apache Spark that uses Azure Blob storage, and PolyBase in SQL DW to transfer large volumes of data efficiently between a Databricks cluster and a SQL DW instance.

Both the Databricks cluster and the SQL DW instance access a common Blob storage container to exchange data between these two systems. In Databricks, Spark jobs are triggered by the SQL DW connector to read data from and write data to the Blob storage container. On the SQL DW side, data loading and unloading operations performed by PolyBase are triggered by the SQL DW connector through JDBC.

The SQL DW connector is more suited to ETL than to interactive queries, because each query execution can extract large amounts of data to Blob storage. If you plan to perform several queries against the same SQL DW table, we recommend that you save the extracted data in a format such as Parquet.

There are two pre-requisites for connecting Azure Databricks with SQL Data Warehouse that apply to the SQL Data Warehouse:

1.  You need to [create a database master key](https://docs.microsoft.com/en-us/sql/relational-databases/security/encryption/create-a-database-master-key) for the Azure SQL Data Warehouse.

    **The key is encrypted using the password.**\
    ****

    `USE [databricks-sqldw];`\
    `GO`\
    `CREATE MASTER KEY ENCRYPTION BY PASSWORD = '980AbctotheCloud427leet';`\
    `GO`\

2. You need to ensure that the [Firewall](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-firewall-configure#manage-firewall-rules-using-the-azure-portal) on the Azure SQL Server that contains your SQL Data Warehouse is configured to allow Azure services to connect (e.g., Allow access to Azure services is set to On).
