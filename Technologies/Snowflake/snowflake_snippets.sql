
--------------------------------------------------------------------------------------------------------------------
-- TABLE ROWCOUNT 
--------------------------------------------------------------------------------------------------------------------
USE DATABASE DWH_DEV;
SELECT t.table_schema || '.' ||  t.table_name as "table_name",t.row_count
FROM information_schema.tables t
WHERE t.table_type = 'VIEW'
and   t.table_catalog = 'DWH_DEV'
AND   T.TABLE_SCHEMA ='IA_POWERBI'
--and row_count = 0
ORDER BY t.row_count;




select 'select ' || ''''|| t.table_schema||'''' || ',' || '''' || t.table_name ||'''' || ' , TK_SOURCESYSTEM, count(1) from ' || t.table_schema || '.' ||  '"' ||t.table_name ||'"'|| ' group by 1,2,3 union all '
FROM information_schema.tables t
WHERE TRUE
AND   (
        ( t.table_type in  ('BASE TABLE', 'VIEW') AND   T.TABLE_SCHEMA in ('BA', 'IA_POWERBI')) 
        OR
        ( t.table_type in  ('BASE TABLE') AND   T.TABLE_SCHEMA in ('DA')) 
      )
and   t.table_catalog = 'DWH_TST'
--and row_count = 0
--ORDER BY 1,2
;




--------------------------------------------------------------------------------------------------------------------
-- DROP TABLE
--------------------------------------------------------------------------------------------------------------------
SELECT 'DROP TABLE ' || TABLE_SCHEMA ||'.'||TABLE_NAME || ';'
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_CATALOG = 'DWH_DEV_RNADORP'
AND TABLE_SCHEMA IN ('BA','BA_TMP',
                     ,'DA','DA_TMP', 'IA', 'MA'
                    );


--------------------------------------------------------------------------------------------------------------------
-- ALL DATABASE OBJECTS
--------------------------------------------------------------------------------------------------------------------
USE DATABASE DWH_DEV;

SELECT 'TABLE' AS OBJECT_TYPE,
       TABLE_CATALOG AS DATABASE,
       TABLE_SCHEMA  AS SCHEMA,
       TABLE_NAME    AS NAME ,
       TABLE_OWNER   AS OWNER,
       ROW_COUNT             AS ROW_COUNT,
       LAST_ALTERED     AS CHANGE_DATE 
FROM INFORMATION_SCHEMA.TABLES
WHERE true
--and TABLE_SCHEMA IN ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')
and TABLE_SCHEMA IN ('DA')

UNION ALL


SELECT 'VIEW' AS OBJECT_TYPE,
       TABLE_CATALOG AS DATABASE,
       TABLE_SCHEMA  AS SCHEMA,
       TABLE_NAME    AS NAME ,
       TABLE_OWNER   AS OWNER,
       NULL             AS ROW_COUNT,
       LAST_ALTERED     AS CHANGE_DATE 
FROM INFORMATION_SCHEMA.VIEWS
WHERE TABLE_SCHEMA IN ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')

UNION ALL


SELECT 'FORMAT' AS OBJECT_TYPE,
       FILE_FORMAT_CATALOG AS DATABASE,
       FILE_FORMAT_SCHEMA  AS SCHEMA,
       FILE_FORMAT_NAME    AS NAME ,
       FILE_FORMAT_OWNER   AS OWNER,
       NULL             AS ROW_COUNT,
       LAST_ALTERED     AS CHANGE_DATE
FROM INFORMATION_SCHEMA.FILE_FORMATS

UNION ALL


SELECT 'STAGE' AS OBJECT_TYPE,
       STAGE_CATALOG AS DATABASE,
       STAGE_SCHEMA  AS SCHEMA,
       STAGE_NAME    AS NAME ,
       STAGE_OWNER   AS OWNER,
       NULL             AS ROW_COUNT,
       LAST_ALTERED     AS CHANGE_DATE
FROM INFORMATION_SCHEMA.STAGES

UNION ALL 


SELECT 'SEQ' AS OBJECT_TYPE,
       SEQUENCE_CATALOG AS DATABASE,
       SEQUENCE_SCHEMA  AS SCHEMA,
       SEQUENCE_NAME    AS NAME ,
       SEQUENCE_OWNER   AS OWNER,
       NULL             AS ROW_COUNT,
       LAST_ALTERED     AS CHANGE_DATE
FROM INFORMATION_SCHEMA.SEQUENCES
WHERE SEQUENCE_SCHEMA IN ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')

UNION ALL 

SELECT 'PROC'             AS OBJECT_TYPE,
       PROCEDURE_CATALOG AS DATABASE,
       PROCEDURE_SCHEMA  AS SCHEMA,
       PROCEDURE_NAME    AS NAME ,
       PROCEDURE_OWNER   AS OWNER,
       NULL              AS ROW_COUNT,
       LAST_ALTERED      AS CHANGE_DATE
FROM INFORMATION_SCHEMA.PROCEDURES
WHERE PROCEDURE_SCHEMA IN ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')

UNION ALL


SELECT 'PIPE' AS OBJECT_TYPE,
       PIPE_CATALOG AS DATABASE,
       PIPE_SCHEMA  AS SCHEMA,
       PIPE_NAME    AS NAME ,
       PIPE_OWNER   AS OWNER,
       NULL         AS ROW_COUNT,
       LAST_ALTERED AS CHANGE_DATE
FROM   INFORMATION_SCHEMA.PIPES
WHERE  PIPE_SCHEMA IN ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')
;

--------------------------------------------------------------------------------------------------------------------
-- COMPARE MELOG_LIQUIBASE MD5SUM BETWEEN DATABASES
--------------------------------------------------------------------------------------------------------------------
select case 
            when dev_lqb.md5sum <> tst_lqb.md5sum then 'CHANGED'
            when tst_lqb.md5sum is null           then 'NEW'
       end
       as IND,
       dev_lqb.*
from   dwh_dev_rnadorp.ma.melog_liquibase dev_lqb
left outer join
       dwh_tst.ma.melog_liquibase         tst_lqb
on dev_lqb.id = tst_lqb.id
where dev_lqb.md5sum <> tst_lqb.md5sum
or tst_lqb.id is null

;   

--------------------------------------------------------------------------------------------------------------------
-- COMPARE TABLES BETWEEN DATABASES (EXIST IN ONE, BUT NOT IN THE OTHER)
--------------------------------------------------------------------------------------------------------------------

select table_schema || '.' || table_name from ingest_hvr_dev.information_schema.tables
where table_name not like '%__B'
minus 
select table_schema || '.' || table_name from ingest_hvr_tst.information_schema.tables
where table_name not like '%__B'
;

--------------------------------------------------------------------------------------------------------------------
-- INSERT DATA INTO DA.RTDIV_TIME
--------------------------------------------------------------------------------------------------------------------

insert into da.rtdiv_time
select
  --dateadd(day, '-' || seq4(), current_date()) as dte,
  to_time(to_varchar(floor(seq4()/ 60), '00') || ':' || to_varchar(mod(seq4(),60), '00') || ':00') as time
,'DIV' AS TK_SOURCESYSTEM
,2       AS TA_STATUS_CODE
,1       AS TA_METADATA
,CURRENT_DATE() AS TA_INSERT_DATETIME
,CURRENT_DATE() AS TA_UPDATE_DATETIME
,1       AS TA_HASH
,'MANUAL' TA_RUNID
,MA.MSSEQ_ROWID_DWH.NEXTVAL AS TA_ROWID
from
  table
    (generator(rowcount => 60*24)) t
    
    ;
     

--------------------------------------------------------------------------------------------------------------------
-- INSERT DATA INTO DA.RTDIV_DATE
--------------------------------------------------------------------------------------------------------------------
    
INSERT INTO DA.RTDIV_DATE
(
SELECT 
    DATEADD(DAY, SEQ4(), date('2000-01-01')) AS DATE,
    'DIV' AS TK_SOURCESYSTEM,
    2 AS TA_STATUS_CODE,
    1 AS TA_METADATA,
    CURRENT_DATE() AS TA_INSERT_DATETIME,
    CURRENT_DATE() AS TA_UPDATE_DATETIME,
    1 AS TA_HASH,
    '1' AS TA_RUNID,
  NULL
     FROM TABLE(GENERATOR(ROWCOUNT=>366*500)) -- Number of days after reference date in previous line
)
;    


--------------------------------------------------------------------------------------------------------------------
-- TABLES WITHOUT PK
--------------------------------------------------------------------------------------------------------------------
WITH
PK AS
(
select           c.constraint_name,
                 case when c.constraint_name is null then FALSE 
                      ELSE TRUE
                 end as HAS_PK,
                 t.*
from             information_schema.tables t
left outer join  information_schema.table_constraints c
on               t.table_catalog = c.table_catalog
and              t.table_schema  = c.table_schema
and              t.table_name    = c.table_name
and              c.constraint_type = 'PRIMARY KEY'
where            t.table_schema in ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')
)
SELECT * FROM PK
WHERE TRUE
AND TABLE_TYPE != 'VIEW'
AND NOT HAS_PK ;


--------------------------------------------------------------------------------------------------------------------
-- TABLES WITH WRONG OWNER (NOT DDL_)
--------------------------------------------------------------------------------------------------------------------

with
t as
(
select  * 
from    information_schema.TABLES T
where   t.table_schema in ('DA', 'DA_TMP', 'BA', 'BA_TMP', 'MA', 'IA_POWERBI')  
)
select * from t where table_owner NOT LIKE 'DDL_%'






--------------------------------------------------------------------------------------------------------------------
-- IA Views
--------------------------------------------------------------------------------------------------------------------

select * from ia_powerbi.tijd;
select * from ia_powerbi.datum;
select * from ia_powerbi.regio; -- 0
select * from ia_powerbi.concessie; --0
select * from ia_powerbi.subconcessie; --0
select * from ia_powerbi.trein; --0
select * from ia_powerbi.treinactiviteit; 
select * from ia_powerbi."Trein volgorde"; --0 
select * from ia_powerbi.plaats; --0


--------------------------------------------------------------------------------------------------------------------
-- COLUMN_DEFAULT: SEQUENCE CANNOT BE FOUND
--------------------------------------------------------------------------------------------------------------------


select * from information_schema.columns
where column_default is not null
AND TABLE_SCHEMA IN ('BA','BA_TMP','DA','DA_TMP', 'IA', 'MA')
AND COLUMN_DEFAULT LIKE '%sequence cannot be found%'
;



select 'ALTER TABLE ' || table_schema || '.' || table_name || ' ALTER COLUMN ' || COLUMN_NAME || ' SET DEFAULT MA.MSSEQ_ROWID_DWH.NEXTVAL;'
from information_schema.columns
where column_default is not null
AND TABLE_SCHEMA IN ('BA','BA_TMP','DA','DA_TMP', 'IA', 'MA')
AND COLUMN_DEFAULT LIKE '%sequence cannot be found%'
;



--------------------------------------------------------------------------------------------------------------------
-- RETRIEVE PROCEDURE DDL
--------------------------------------------------------------------------------------------------------------------

show procedures in database dwh_dev_rnadorp;
select get_ddl('PROCEDURE', 'DWH_DEV_RNADORP.PUBLIC.UDF_CREATE_UNIT_TESTS(VARCHAR, VARCHAR, VARCHAR)');





--------------------------------------------------------------------------------------------------------------------
-- TABLE PK COLUMNS
--------------------------------------------------------------------------------------------------------------------

SHOW PRIMARY KEYS IN DATABASE dwh_dev; 
create OR REPLACE temp table tmp_pk
as
(
select * from table(result_scan(last_query_id()))
where "schema_name" IN ('BA','BA_TMP','DA','DA_TMP', 'IA', 'MA')
)
;

--------------------------------------------------------------------------------------------------------------------
-- PK COLUMNS vs NULLABLE
--------------------------------------------------------------------------------------------------------------------

SHOW PRIMARY KEYS IN DATABASE dwh_acc; 
create OR REPLACE temp table tmp_pk
as
(
select      "created_on" as CREATED_ON
        ,   "database_name" AS TABLE_CATALOG
        ,   "schema_name"   as TABLE_SCHEMA
        ,   "table_name"    AS TABLE_NAME
        ,   "column_name"   AS COLUMN_NAME
        ,   "key_sequence"  AS ORDINAL_POSITION
        ,   "constraint_name"   AS CONSTRAINT_NAME
        ,   "comment"           AS COMMENT
from table(result_scan(last_query_id()))
where "schema_name" IN ('BA' ,'BA_TMP','DA','DA_TMP', 'IA', 'MA')
)
;

WITH 
PK AS
( SELECT * FROM TMP_PK)
,
COL AS
(
SELECT * 
FROM INFORMATION_SCHEMA.COLUMNS 
)
,
R AS
(
SELECT COL.*,
       CASE WHEN PK.COLUMN_NAME IS NULL THEN 0 ELSE 1 END AS IS_PK
       
FROM COL LEFT OUTER JOIN PK
ON   COL.TABLE_CATALOG = PK.TABLE_CATALOG
AND  COL.TABLE_SCHEMA = PK.TABLE_SCHEMA
AND  COL.TABLE_NAME = PK.TABLE_NAME
AND  COL.COLUMN_NAME = PK.COLUMN_NAME
)
SELECT * FROM R
//WHERE TABLE_SCHEMA='BA_TMP'
//and TABLE_NAME = 'BV_UNITOFMEASURE'
//--AND IS_PK = 0
//AND IS_NULLABLE = 'NO'

--------------------------------------------------------------------------------------------------------------------
-- GET DDL
--------------------------------------------------------------------------------------------------------------------

SELECT GET_DDL('VIEW', 'DWH_DEV_RNADORP.PUBLIC.TEST');


--------------------------------------------------------------------------------------------------------------------
-- CLEAR DATABASE
--------------------------------------------------------------------------------------------------------------------

set DB = 'DWH_DEV_RNADORP';
USE ROLE DEVELOPER;
USE DATABASE DWH_DEV_RNADORP;

call DWH_DEV_RNADORP.PUBLIC.UDF_clear_schema($DB, 'MA');
call DWH_DEV_RNADORP.PUBLIC.udf_clear_schema($DB, 'DA');
call DWH_DEV_RNADORP.PUBLIC.udf_clear_schema($DB, 'DA_TMP');
--call DWH_DEV_RNADORP.PUBLIC.udf_clear_schema($DB, 'BA');
--call DWH_DEV_RNADORP.PUBLIC.udf_clear_schema($DB, 'BA_TMP');
--call DWH_DEV_RNADORP.PUBLIC.udf_clear_schema($DB, 'IA_POWERBI');
--------------------------------------------------------------------

use schema dwh_dev_rnadorp.information_schema;

select *
from columns
where true 
and substr(table_schema, 1, 2) in ('MA', 'DA', 'BA', 'IA')
AND table_schema not like '%_TMP'
and data_type in ('NUMBER', 'FLOAT', 'DECIMAL', 'INTEGER')
AND NUMERIC_SCALE > 0
;



--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
-- QUERY'S TBV UNIT TESTS BA
-- ENTITEITEN:
--------------
-- BV_TRAIN_ACTIVITY            : √ 
-- BV_REGION                    : 
-- BV_CONCESSION                : 
-- BV_SUBCONCESSION             :
-- BV_CLUSTER                   :
-- BV_TRAIN_LINE                :
-- BV_TRAIN                     :
-- BV_PLACE                     :
-- BV_CONVEYOR                  :
-- BV_PUNCTUALITY_RULES_TRAIN   :
-- BV_PLACE_DISTANCE_MATRIX     :
-- BA_DATE                      :
-- BA_TIME                      :
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------


--------------------------------------------------------------------------------------------------------------------
-- INSERT SAMPLE INTO TABLE TEST_COLUMN FOR BV_TRAIN_ACTIVITY (KEY COLUMNS)
--------------------------------------------------------------------------------------------------------------------


INSERT INTO DWH_DEV_RNADORP.PUBLIC.TEST_COLUMN
(
WITH
S AS
(
SELECT TO_CHAR(TRY_TO_DATE(DAG, 'DD-MM-YYYY')) AS DAG,
       TO_CHAR(TREINNUMMER     )               AS TREINNUMMER,
       TO_CHAR(DIENSTREGELPUNT)                AS DIENSTREGELPUNT,
       TO_CHAR(ACTIVITEIT  )                   AS ACTIVITEIT,
       TO_CHAR(RIJVOLGORDE)                    AS RIJVOLGORDE
FROM   DA.HTPRR_TRAIN_ACTIVITY
)

,
T AS
(
  SELECT TO_CHAR(TO_DATE(A_PRORAIL_DATE) )                AS A_PRORAIL_DATE,
         TO_CHAR(A_PRORAIL_TRAINNUMBER)          AS A_PRORAIL_TRAINNUMBER  ,
         TO_CHAR(A_PLACE_CODE          )         AS A_PLACE_CODE ,
         TO_CHAR(A_ACTIVITY_TYPE        )        AS A_ACTIVITY_TYPE ,
         TO_CHAR(A_DRIVING_ORDER         )       AS A_DRIVING_ORDER  
FROM BA.BV_TRAIN_ACTIVITY
--WHERE A_PRORAIL_DATE = '2020-01-14' -- Tijdelijk om dataset te beperken       
)
,
J AS
(
  SELECT S.*, '|' SPLIT, T.* , RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
  FROM   S, T
  WHERE  TRUE
  AND       S.DAG                    = A_PRORAIL_DATE
  AND       S.TREINNUMMER            = A_PRORAIL_TRAINNUMBER        
  AND       S.DIENSTREGELPUNT        = A_PLACE_CODE       
  AND       S.ACTIVITEIT             = A_ACTIVITY_TYPE       
  AND       S.RIJVOLGORDE            = A_DRIVING_ORDER

)
,
J_SAMPLE AS
(
    SELECT  J.*, HASH(J.*) AS HSH,
            COUNT(1) OVER () AS C
    FROM J SAMPLE (.0005)
)
,
S_SAMPLE AS 
(
  SELECT  HSH, C,
          DAG, TREINNUMMER, DIENSTREGELPUNT, ACTIVITEIT, RIJVOLGORDE 
  FROM J_SAMPLE
)
,
T_SAMPLE AS 
(
  SELECT  HSH, C,
          A_PRORAIL_DATE, A_PRORAIL_TRAINNUMBER, A_PLACE_CODE, A_ACTIVITY_TYPE, A_DRIVING_ORDER
  FROM J_SAMPLE
)
,
S_PVT AS
(
    SELECT  HSH,
        CASE 
            WHEN SOURCE_KEY_COLUMN = 'DAG'              THEN 'KEY1' 
            WHEN SOURCE_KEY_COLUMN = 'TREINNUMMER'      THEN 'KEY2' 
            WHEN SOURCE_KEY_COLUMN = 'DIENSTREGELPUNT'  THEN 'KEY3' 
            WHEN SOURCE_KEY_COLUMN = 'ACTIVITEIT'       THEN 'KEY4' 
            WHEN SOURCE_KEY_COLUMN = 'RIJVOLGORDE'      THEN 'KEY5' 
       END COL_KEY,
       SOURCE_KEY_COLUMN,
       SOURCE_KEY_VALUE
    FROM S_SAMPLE
    UNPIVOT (SOURCE_KEY_VALUE FOR SOURCE_KEY_COLUMN IN (DAG, TREINNUMMER, DIENSTREGELPUNT, ACTIVITEIT, RIJVOLGORDE ))
)

,
T_PVT AS
(
    SELECT  HSH,
        CASE 
            WHEN TARGET_KEY_COLUMN = 'A_PRORAIL_DATE'           THEN 'KEY1' 
            WHEN TARGET_KEY_COLUMN = 'A_PRORAIL_TRAINNUMBER'    THEN 'KEY2' 
            WHEN TARGET_KEY_COLUMN = 'A_PLACE_CODE'             THEN 'KEY3' 
            WHEN TARGET_KEY_COLUMN = 'A_ACTIVITY_TYPE'          THEN 'KEY4' 
            WHEN TARGET_KEY_COLUMN = 'A_DRIVING_ORDER'          THEN 'KEY5' 
       END COL_KEY,
       TARGET_KEY_COLUMN,
       TARGET_KEY_VALUE
    FROM T_SAMPLE
    UNPIVOT (TARGET_KEY_VALUE FOR TARGET_KEY_COLUMN IN (A_PRORAIL_DATE, A_PRORAIL_TRAINNUMBER, A_PLACE_CODE, A_ACTIVITY_TYPE, A_DRIVING_ORDER))
)
,
R AS
(
SELECT 'BV_TRAIN_ACTIVITY_001 ' AS SCENARIO_NAME,
       'DA' AS SOURCE_SCHEMA,
       'HTPRR_TRAIN_ACTIVITY' AS SOURCE_TABLE,
       SOURCE_KEY_COLUMN,
       SOURCE_KEY_VALUE,
       'BA' AS TARGET_SCHEMA,
       'BV_TRAIN_ACTIVITY' AS TARGET_TABLE,
       TARGET_KEY_COLUMN,
       TARGET_KEY_VALUE
FROM   S_PVT, T_PVT
WHERE  TRUE
AND    S_PVT.HSH = T_PVT.HSH
AND    S_PVT.COL_KEY = T_PVT.COL_KEY
ORDER BY S_PVT.HSH, S_PVT.COL_KEY
)
SELECT * FROM R
  )
;


--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA TRAIN_ACTIVITY
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
SELECT TO_CHAR(TRY_TO_DATE(DAG, 'DD-MM-YYYY')) AS KEY1,
       TO_CHAR(TREINNUMMER     )               AS KEY2,
       TO_CHAR(DIENSTREGELPUNT)                AS KEY3,
       TO_CHAR(ACTIVITEIT  )                   AS KEY4,
       TO_CHAR(RIJVOLGORDE)                    AS KEY5,
       DA.*
FROM   DA.HTPRR_TRAIN_ACTIVITY DA
)

,
T AS
(
  SELECT TO_CHAR(TO_DATE(A_PRORAIL_DATE) )       AS KEY1,
         TO_CHAR(A_PRORAIL_TRAINNUMBER)          AS KEY2  ,
         TO_CHAR(A_PLACE_CODE          )         AS KEY3 ,
         TO_CHAR(A_ACTIVITY_TYPE        )        AS KEY4 ,
         TO_CHAR(A_DRIVING_ORDER         )       AS KEY5,
         BA.*
FROM BA.BV_TRAIN_ACTIVITY BA
--WHERE A_PRORAIL_DATE = '2020-01-14' -- Tijdelijk om dataset te beperken       
)
,
R AS
(
  SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
FROM   S, T
WHERE  TRUE
AND       S.KEY1 = T.KEY1
AND       S.KEY2 = T.KEY2        
AND       S.KEY3 = T.KEY3       
AND       S.KEY4 = T.KEY4       
AND       S.KEY5 = T.KEY5
         

)
SELECT * FROM R  SAMPLE (.0005)
;


--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA - CONVEYOR
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT DISTINCT
       vervoerder AS  KEY1,
       VERVOERDER
   FROM
      da.htprr_train_activity 
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_CONVEYOR_NAME      AS KEY1,
            A_CONVEYOR_NAME
    FROM    BA.BV_CONVEYOR
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  --SAMPLE (.0005) ==> No sample bc small dataset
;


--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA CONCESSION
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT CONCESSION_CODE AS  KEY1,
           CONCESSION_CODE,
           CONCESSION_DESCRIPTION,
           REGION_CODE
   FROM
      da.HTDWM_CONCESSION
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_CONCESSION_CODE     AS KEY1,
            A_CONCESSION_NAME,
            A_REGION_CODE
    FROM    BA.BV_CONCESSION
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  --SAMPLE (.0005)
;

--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA SUB_CONCESSION
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT SUB_CONCESSION_CODE AS  KEY1,
           SUB_CONCESSION_CODE,
           SUB_CONCESSION_DESCRIPTION,
           CONCESSION_CODE
   FROM
      da.HTDWM_SUB_CONCESSION
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_SUB_CONCESSION_CODE     AS KEY1,
            A_SUB_CONCESSION_NAME,
            A_CONCESSION_CODE
    FROM    BA.BV_SUBCONCESSION
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  --SAMPLE (.0005)
;
--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA CLUSTER
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT CLUSTER_CODE AS  KEY1,
           CLUSTER_CODE,
           CLUSTER_DESCRIPTION,
           SUB_CONCESSION_CODE
   FROM
      da.HTDWM_CLUSTER
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_CLUSTER_CODE     AS KEY1,
            A_CLUSTER_NAME,
            A_CLUSTER_CODE
    FROM    BA.BV_CLUSTER
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  --SAMPLE (.0005)
;
--------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA REGION
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT REGION_CODE AS  KEY1,
           REGION_CODE,
           REGION_DESCRIPTION
   FROM
      da.HTDWM_REGION
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_REGION_CODE     AS KEY1,
            A_REGION_NAME
    FROM    BA.BV_REGION
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  --SAMPLE (.0005)
;

------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA TRAIN SEQUENCE
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    SELECT  TO_CHAR(TO_DATE(INGANGSDATUM) ) AS KEY1,
            PUNTCODE                        AS KEY2,
            RICHTING                        AS KEY3,
            TREINSERIE                      AS KEY4,
            INGANGSDATUM    ,
            PUNTCODE        ,
            RICHTING        ,
            TREINSERIE      
   FROM
      da.HTDWM_TRAIN_SEQUENCE 
   WHERE
      TRUE 
      AND ea_actual_flag = 1
)
,
T AS
(
    SELECT  TO_CHAR(TO_DATE(V_TRAIN_SEQUENCE_START_DATE))   AS KEY1,
            A_PLACE_CODE                                    AS KEY2,
            A_DRIVING_DIRECTION                             AS KEY3,
            A_TRAIN_LINE                                    AS KEY4,
            V_TRAIN_SEQUENCE_START_DATE,
            A_PLACE_CODE            ,
            A_DRIVING_DIRECTION     ,
            A_TRAIN_LINE            ,
            A_REFERENCE_CODE        ,
            V_TRAIN_SEQUENCE_END_DATE
    FROM    BA.BV_TRAIN_SEQUENCE
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1
    AND    S.KEY2 = T.KEY2
    AND    S.KEY3 = T.KEY3
    AND    S.KEY4 = T.KEY4

)
SELECT * FROM R  --SAMPLE (.0005)
;






------------------------------------------------------------------------------------------------------------------
-- JOIN DA - BA: BV_PLACE
--------------------------------------------------------------------------------------------------------------------
WITH
S AS
(
    WITH wgsdata AS 
    (
    SELECT
      htpam_tm_point.farestopshortdescription AS halte,
      MAX(htpam_tm_point.name) AS name,
      AVG(htpam_tm_location.coordinate1) AS rd_coordinate_x,
      AVG(htpam_tm_location.coordinate2) AS rd_coordinate_y 
   FROM
      da.htpam_tm_point htpam_tm_point 
      LEFT JOIN
         da.htpam_tm_location htpam_tm_location 
         ON (htpam_tm_location.idpoint = htpam_tm_point.idpoint 
         AND htpam_tm_point.ea_actual_flag = 1 
         AND htpam_tm_location.ea_actual_flag = 1) 
   GROUP BY
      htpam_tm_point.farestopshortdescription 
  )
  SELECT
   htpda_fv_farestop.code AS KEY1,
   htpda_fv_farestop.IDFVFARESTOP,
   htpda_fv_farestop.code ,
   htpda_fv_farestop.farestopshortname ,
   htpda_fv_farestop.farestopshortdescription ,
   wgsdata.rd_coordinate_x,
   wgsdata.rd_coordinate_y, 
   CASE
      WHEN
         code < 1000 
      THEN
         farestopshortname 
      ELSE
         nvl ((SUBSTRING (farestopshortdescription, 1, regexp_instr(farestopshortdescription, ' ', 1) - 1)), 
         (
            farestopshortdescription
         )
    )
   END
   AS a_place_city 
  FROM
     da.htpda_fv_farestop htpda_fv_farestop 
     LEFT JOIN
        wgsdata wgsdata 
        ON (htpda_fv_farestop.farestopshortdescription = wgsdata.halte) 
  WHERE
     htpda_fv_farestop.ea_actual_flag = 1
)
,
T AS
(
    SELECT  A_PLACE_CODE AS KEY1,
            A_PLACE_CODE ,
            A_PLACE_SHORTDESCRIPTION  ,
            A_WGS84_COORDINATE_LAT     ,
            A_WGS84_COORDINATE_LON      ,
            A_PLACE_CITY              
    FROM    BA.BV_PLACE
)
,
R AS
(
    SELECT S.*, '*' AS SPLIT, T.* --, RANK() OVER (ORDER BY S.DAG, S.TREINNUMMER, S.DIENSTREGELPUNT, S.ACTIVITEIT, S.RIJVOLGORDE) ROWNUM
    FROM   S, T
    WHERE  TRUE
    AND    S.KEY1 = T.KEY1

)
SELECT * FROM R  SAMPLE (.05)
;






------------------------------------------------------------------------------------------------------------------
-- COMPARE QUERY PERFORMANCE BETWEEN 2 IMPLEMENTATIONS
--------------------------------------------------------------------------------------------------------------------

USE ROLE ACCOUNTADMIN;
USE DATABASE DWH_DEV;
USE SCHEMA DA;

ALTER SESSION SET USE_CACHED_RESULT = FALSE; -- Do not use Query Result cache to ensure comparability
SET WAIT_QTY   = 1; -- Number of units to wait after suspending a warehouse to ensure the local cache is flushed
SET WAIT_UNIT  = 'MINUTES';

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;


--Query 1: Item Key uit ba_inventorytransaction (inventtrans: 7.992.728 rijen, inventtable: 90.358 rijen)
--Origineel:
SELECT
    concat_ws( '#', it.tk_sourcesystem, it.partition, it.recid)             AS INVENTORY_TRANSACTION_KEY
    , concat_ws( '#', i.tk_sourcesystem, i.partition, i.recid)              AS ITEM_KEY
FROM da.hvaxe_inventtrans_ax2012r3 it
LEFT JOIN da.hvaxe_inventtable_ax2012r3 i
ON         it.ea_actual_flag = 1
    AND     i.tk_sourcesystem    = it.tk_sourcesystem
    AND    i.partition          = it.partition
    AND    i.dataareaid         = it.dataareaid
    AND    i.itemid             = it.itemid
    AND    i.ea_actual_flag     = 1
    AND    i.ta_status_code     = 2
;
SET QID_Q1_A =  last_query_id();

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

--Aangepast (recid vervangen met itemid uit hoofdtabel):
SELECT
    concat_ws( '#', it.tk_sourcesystem, it.partition, it.recid)             AS INVENTORY_TRANSACTION_KEY
    , concat_ws( '#', it.tk_sourcesystem, it.partition, it.itemid)          AS ITEM_KEY
FROM da.hvaxe_inventtrans_ax2012r3 it
//LEFT JOIN da.hvaxe_inventtable_ax2012r3 i
WHERE TRUE
    AND it.ea_actual_flag = 1
//    AND     i.tk_sourcesystem    = it.tk_sourcesystem
//    AND    i.partition          = it.partition
//    AND    i.dataareaid         = it.dataareaid
//    AND    i.itemid             = it.itemid
//    AND    i.ea_actual_flag     = 1
//    AND    i.ta_status_code     = 2
//
;

SET QID_Q1_B =  last_query_id();


------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);


ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;
--Query 2: Sales_Order_Key uit ba_inventorytransaction (join op join, inventtrans: 7.992.728 rijen, salesline: 1.126.069 rijen):
--Origineel
SELECT
    concat_ws( '#', it.tk_sourcesystem, it.partition, it.recid)             AS INVENTORY_TRANSACTION_KEY
    , concat_ws( '#', sl.tk_sourcesystem, sl.partition, sl.recid)           AS SALES_ORDER_KEY
FROM da.hvaxe_inventtrans_ax2012r3 it
LEFT JOIN da.hvaxe_inventtransorigin_ax2012r3 io
   ON   io.recid             = it.inventtransorigin
    AND    io.dataareaid        = it.dataareaid
    AND    io.partition         = it.partition
    AND    io.ea_actual_flag    = 1
LEFT JOIN da.hvaxe_salesline_ax2012r3 sl
    on sl.inventtransid     = io.inventtransid 
    AND    sl.partition         = io.partition
    AND    sl.dataareaid        = io.dataareaid 
    AND    sl.tk_sourcesystem   = io.tk_sourcesystem 
    AND    sl.ea_actual_flag    = 1 
;
SET QID_Q2_A =  last_query_id();

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

--Aangepast (recid vervangen met inventtransid uit inventtransorigin)
SELECT
    concat_ws( '#', it.tk_sourcesystem, it.partition, it.recid)             AS INVENTORY_TRANSACTION_KEY
    , concat_ws( '#', it.tk_sourcesystem, it.partition, io.inventtransid)   AS SALES_ORDER_KEY
FROM da.hvaxe_inventtrans_ax2012r3 it
LEFT JOIN da.hvaxe_inventtransorigin_ax2012r3 io
    on  io.recid             = it.inventtransorigin
    AND    io.dataareaid        = it.dataareaid
    AND    io.partition         = it.partition
    AND    io.ea_actual_flag    = 1
//LEFT JOIN da.hvaxe_salesline_ax2012r3 sl
//    ON     sl.inventtransid     = io.inventtransid 
//    AND    sl.partition         = io.partition
//    AND    sl.dataareaid        = io.dataareaid 
//    AND    sl.tk_sourcesystem   = io.tk_sourcesystem 
//    AND    sl.ea_actual_flag    = 1 
//
;
------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
SET QID_Q2_B =  last_query_id();

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

--Query 3: Customer_key uit ba_salesorder (salestable: 705.904 rijen, custtable: 40.337 rijen)
--Origineel
SELECT
    concat_ws( '#', cus.tk_sourcesystem, cus.partition, cus.recid) AS CUSTOMER_KEY
FROM da.hvaxe_salestable_ax2012r3 s
LEFT OUTER JOIN da.hvaxe_custtable_ax2012r3 cus
  ON     cus.tk_sourcesystem = s.tk_sourcesystem
  AND    cus.partition       = s.partition
  AND    cus.dataareaid      = s.dataareaid
  AND    cus.accountnum      = s.custaccount
  AND    cus.ea_actual_flag  = 1
  AND    cus.ta_status_code  = 2
;
SET QID_Q3_A =  last_query_id();


ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

--Aangepast (recid vervangen door custaccount)
SELECT
    concat_ws( '#', s.tk_sourcesystem, s.partition, s.custaccount) AS CUSTOMER_KEY
FROM da.hvaxe_salestable_ax2012r3 s
//LEFT OUTER JOIN da.hvaxe_custtable_ax2012r3 cus
//  ON     cus.tk_sourcesystem = s.tk_sourcesystem
//  AND    cus.partition       = s.partition
//  AND    cus.dataareaid      = s.dataareaid
//  AND    cus.accountnum      = s.custaccount
//  AND    cus.ea_actual_flag  = 1
//  AND    cus.ta_status_code  = 2
;
SET QID_Q3_B =  last_query_id();

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------

-- Query 4: Purchaseorder_Key van ba_purchaseorder (purchtable: 331.809 rijen, purchline: 417.837 rijen)
-- Origineel
SELECT 
    concat_ws( '#', pl.tk_sourcesystem, pl.partition, pl.recid)         AS PURCHASEORDER_KEY
FROM da.hvaxe_purchtable_ax2012r3 p
  LEFT OUTER JOIN da.hvaxe_purchline_ax2012r3 pl
    ON     pl.tk_sourcesystem = p.tk_sourcesystem
    AND    pl.partition       = p.partition
    AND    pl.dataareaid      = p.dataareaid
    AND    pl.purchid         = p.purchid
    AND    pl.ea_actual_flag  = 1
;
SET QID_Q4_A =  last_query_id();

ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

--Aangepast (recid vervangen door purchid)
SELECT 
    concat_ws( '#', p.tk_sourcesystem, p.partition, p.purchid)         AS PURCHASEORDER_KEY
FROM da.hvaxe_purchtable_ax2012r3 p
//  LEFT OUTER JOIN da.hvaxe_purchline_ax2012r3 pl
//    ON     pl.tk_sourcesystem = p.tk_sourcesystem
//    AND    pl.partition       = p.partition
//    AND    pl.dataareaid      = p.dataareaid
//    AND    pl.purchid         = p.purchid
//    AND    pl.ea_actual_flag  = 1
;
SET QID_Q4_B =  last_query_id();

------------------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;

-- Query 5: Salesorder_key van salesorderinvoice (Custinvoicetrans: 875.918 rijen, Salesline: 1.126.073 rijen) 
-- Origineel
SELECT
    concat_ws( '#', sl.tk_sourcesystem, sl.partition, sl.recid)     AS Salesorder_Key
FROM da.HVAXE_CUSTINVOICETRANS_AX2012R3                     inv
LEFT JOIN da.HVAXE_SALESLINE_AX2012R3                       sl
    ON  sl.inventtransid     = inv.inventtransid
    AND sl.dataAreaID	      = inv.DataAreaID
    AND sl.partition	      = inv.partition
    AND sl.tk_sourcesystem  = inv.tk_sourcesystem
    AND sl.ea_actual_flag   = 1
    AND sl.ta_status_code   = 2
;
SET QID_Q5_A =  last_query_id();


ALTER WAREHOUSE WH_COAPTTEAM_M RESUME IF SUSPENDED;
ALTER WAREHOUSE WH_COAPTTEAM_M SUSPEND;
call system$wait($WAIT_QTY, $WAIT_UNIT);
ALTER WAREHOUSE WH_COAPTTEAM_M RESUME;
ALTER ACCOUNT SET USE_CACHED_RESULT = FALSE;
-- Aangepast (recid vervangen door inventtransid)
SELECT
    concat_ws( '#', inv.tk_sourcesystem, inv.partition, inv.inventtransid)     AS Salesorder_Key
FROM da.HVAXE_CUSTINVOICETRANS_AX2012R3                     inv
//LEFT JOIN da.HVAXE_SALESLINE_AX2012R3                       sl
//    ON sl.inventtransid     = inv.inventtransid
//    AND sl.dataAreaID	      = inv.DataAreaID
//    AND sl.partition	      = inv.partition
//    AND sl.tk_sourcesystem  = inv.tk_sourcesystem
//    AND sl.ea_actual_flag   = 1
//    AND sl.ta_status_code   = 2
    ;
SET QID_Q5_B =  last_query_id();




-------------------
call system$wait(4, 'MINUTES');

SELECT CASE 
            WHEN QUERY_ID = '' || $QID_Q1_A || '' THEN 'QID_Q1_A' 
            WHEN QUERY_ID = '' || $QID_Q1_B || '' THEN 'QID_Q1_B' 
            WHEN QUERY_ID = '' || $QID_Q2_A || '' THEN 'QID_Q2_A' 
            WHEN QUERY_ID = '' || $QID_Q2_B || '' THEN 'QID_Q2_B' 
            WHEN QUERY_ID = '' || $QID_Q3_A || '' THEN 'QID_Q3_A' 
            WHEN QUERY_ID = '' || $QID_Q3_B || '' THEN 'QID_Q3_B' 
            WHEN QUERY_ID = '' || $QID_Q4_A || '' THEN 'QID_Q4_A' 
            WHEN QUERY_ID = '' || $QID_Q4_B || '' THEN 'QID_Q4_B' 
            WHEN QUERY_ID = '' || $QID_Q5_A || '' THEN 'QID_Q5_A' 
            WHEN QUERY_ID = '' || $QID_Q5_B || '' THEN 'QID_Q5_B' 

       END AS QID
       , QH.*

FROM SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY QH
WHERE QUERY_ID IN
(

  '' || $QID_Q1_A || ''
, '' || $QID_Q1_B || ''
, '' || $QID_Q2_A || ''
, '' || $QID_Q2_B || ''
, '' || $QID_Q3_A || ''
, '' || $QID_Q3_B || ''
, '' || $QID_Q4_A || ''
, '' || $QID_Q4_B || ''
, '' || $QID_Q5_A || ''
, '' || $QID_Q5_B || ''

)
;







------------------------------------------------------------------------------------------------------------------
-- COMPARE SCHEMA STRUCTURE IN DATABASE
--------------------------------------------------------------------------------------------------------------------

WITH 
AXE AS (SELECT TABLE_NAME, COLUMN_NAME FROM INGEST_HVR_DEV.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'AX_EU')
,
AXN AS (SELECT TABLE_NAME, COLUMN_NAME FROM INGEST_HVR_DEV.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'AX_NA')
,
AXP AS (SELECT TABLE_NAME, COLUMN_NAME FROM INGEST_HVR_DEV.INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'AX_AP')
,
J AS
(
SELECT  AXE.TABLE_NAME   AXE_TABLE_NAME,
        AXE.COLUMN_NAME  AXE_COLUMN_NAME,
        AXN.TABLE_NAME   AXN_TABLE_NAME,
        AXN.COLUMN_NAME  AXN_COLUMN_NAME,
        AXP.TABLE_NAME   AXP_TABLE_NAME,
        AXP.COLUMN_NAME  AXP_COLUMN_NAME
  
FROM AXE 
FULL OUTER JOIN AXN ON AXE.TABLE_NAME=AXN.TABLE_NAME  AND AXE.COLUMN_NAME = AXN.COLUMN_NAME
FULL OUTER JOIN AXP ON AXE.TABLE_NAME=AXP.COLUMN_NAME AND AXE.COLUMN_NAME = AXP.COLUMN_NAME
)
SELECT * FROM J 
WHERE TRUE

AND AXE_TABLE_NAME IS NOT NULL
AND AXN_TABLE_NAME  IS NOT NULL
AND AXP_TABLE_NAME  IS NOT NULL
;


------------------------------------------------------------------------------------------------------------------
-- COUNT NON EXISTING COLUMNS PER TABLE IN DATABASE
--------------------------------------------------------------------------------------------------------------------

with
b as
(
SELECT TABLE_SCHEMA, TABLE_NAME, 
       SUM (CASE WHEN COLUMN_NAME = 'PARTITION' THEN 1 ELSE 0 END) AS COUNT_PARTITION,
       SUM (CASE WHEN COLUMN_NAME = 'RECID' THEN 1 ELSE 0 END) AS COUNT_RECID,
       COUNT(1) COUNT_TOTAL
       

FROM INFORMATION_SCHEMA.COLUMNS
where table_schema like 'AX%'
and table_name not like 'HVR%'
GROUP BY 1, 2
  )
  
  select * from b where (count_partition = 0 or count_recid=0)
  order by 1,2

------------------------------------------------------------------------------------------------------------------
-- CREATE DEVELOPER DATABASE
--------------------------------------------------------------------------------------------------------------------
-- Refer to script in infrastructure repo


------------------------------------------------------------------------------------------------------------------
-- CREATE USER
--------------------------------------------------------------------------------------------------------------------

use role accountadmin;
alter account set saml_identity_provider = '{
"certificate": "MIIC8DCCAdigAwIBAgIQWE3K31nd0aJLtiAoyW0V6DANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0yMTAyMDQwODQ0MjdaFw0yNDAyMDQwODQ0MjZaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqMI9sDDkIqQQZqDMxBMCiRGNEuZ0Ne5duJTXZkCCvjIGq5hPXsn/JuiMZcSFrZMsN++4+DNo+v8ftRk+geYp6qDc347mJbCaLdQMNeclS9/FfEAvGMf9/1o4DeHLejXcnVhapSuOonKB63dsww6LmFaRjl1cIdNPW9RAQ+y/TnimsdmKv9d9qscfpoFmmD1XTJ6Wnxc68X5Yw1sHE8atQGwMcMSTKwlyUcR1MLHKbBPt9I2WV+3JmRvywKJMNLxhhyFde2oDZHLVabDK2cwaWCK8W84YOfe3SNRuYGsPlaoLqO1HJRAd9UW+Ab2OT11O6QhEH3GEyWENQ0ICcp89TQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAGP8O0q15aE63usW6i1K1Rlw1rHFjYWoq/7xmkI4I4gxaQs+fY/+8JQUhdkdldcP1YBMT8rCcBYvkPHGh3Gq2ZANfXFHAQG6GWzhRdU8WNUDfwqYyjODTQwc/SWDS+UsFpjDeAPhfz9teURKpbDGz3wBwca4v7qUHuD9GWkZZ2lu9ure/z4X5UehV4pkS9kA5yc5duiROnNpMgNqj2ZvIhbGElUNw3zOlxZaD9xpdnrhSkHxoLRjlG6HTCodtjVw2xJAVZr3v58mZFcQidDFulC0kwiblDKuGAXbIE84lvgeApDZVNyyYEuC46S0zBFJeBPnVnQQgP6WDs2QGQXDjq",
"ssoUrl":"https://login.microsoftonline.com/2a916b80-031c-46f9-8f14-884c576496ca/saml2",
"type":"ADFS",
"label":"AzureAD"
}';
alter account set sso_login_page = TRUE;
 
 
use role securityadmin;
CREATE OR REPLACE USER marcovandenbaard PASSWORD = '' LOGIN_NAME = 'm.vandenbaard@caldic.nl' DISPLAY_NAME = 'Marco van den Baard';
alter user "ROBERT.SPEULSTRA@INERGY.NL" set default_role = DWH_TST_IA_READ;
USE ROLE SECURITYADMIN;

CREATE OR REPLACE USER "M.VANDERZWAN@CALDIC.NL" PASSWORD = '' LOGIN_NAME = 'M.VANDERZWAN@CALDIC.NL' DISPLAY_NAME = 'Marten van der Zwam' EMAIL='M.VANDERZWAN@CALDIC.NL' default_role=SUPPORT_DEV must_change_password = FALSE;
;
GRANT ROLE SUPPORT_DEV TO USER "M.VANDERZWAN@CALDIC.NL";
GRANT ROLE SUPPORT_TST TO USER "M.VANDERZWAN@CALDIC.NL";
GRANT ROLE SUPPORT_ACC TO USER "M.VANDERZWAN@CALDIC.NL";
GRANT ROLE SUPPORT_PRD TO USER "M.VANDERZWAN@CALDIC.NL";


//CREATE OR REPLACE USER chrisroest PASSWORD = '' LOGIN_NAME = 'chris.roest_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Chris Roest';
//CREATE OR REPLACE USER marcovandenbaard PASSWORD = '' LOGIN_NAME = 'm.vandenbaard@caldic.nl' DISPLAY_NAME = 'Marco van den Baard';
//CREATE OR REPLACE USER renenadorp PASSWORD = '' LOGIN_NAME = 'rene.nadorp_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Rene Nadorp';
//
//CREATE OR REPLACE USER tverweij    PASSWORD = '' LOGIN_NAME = 'tom.verweij_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Tom Verweij';
//CREATE OR REPLACE USER rvzanten    PASSWORD = '' LOGIN_NAME = 'robin.van.zanten_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Robin van Zanten';
//CREATE OR REPLACE USER jvsplunder  PASSWORD = '' LOGIN_NAME = 'jeroen.van.splunder_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Jeroen van Splunder';
//CREATE OR REPLACE USER kmiltenburg PASSWORD = '' LOGIN_NAME = 'koen.miltenburg_inergy.nl#EXT#@caldicglobal.onmicrosoft.com' DISPLAY_NAME = 'Koen Miltenburg';
// 


GRANT ROLE DEVELOPER TO USER "JEROEN.VAN.SPLUNDER@INERGY.NL";
use role securityadmin;
ALTER USER "ROBERT.SPEULSTRA@INERGY.NL"
SET PASSWORD = '*' MUST_CHANGE_PASSWORD = FALSE 
;

------------------------------------------------------------------------------------------------------------------
-- WHITELIST INFO
--------------------------------------------------------------------------------------------------------------------
select t.value:type::varchar as type,
       t.value:host::varchar as host,
       t.value:port as port
from table(flatten(input => parse_json(system$whitelist()))) as t;



------------------------------------------------------------------------------------------------------------------
-- WHITELIST: CREATE AND APPLY
--------------------------------------------------------------------------------------------------------------------
-- DO NOT USE => USE SCRIPT IN REPO!!
-----------------------------------------
USE ROLE ACCOUNTADMIN;
-- ontwikkelaars
set
    rene_nadorp = '';

--inergy kantoren
set
    inergy_vpn = '84.241.179.51';

--Caldic kantoor
set
    caldic_kantoor1 = '';

--Caldic datacenter
set
    caldic_datacenter = '13.94.175.43';

--azure
set
    natgw_common = '51.105.153.169';

--DevOps
set devops_build_agent = '13.79.161.163';

--policy maken
CREATE
OR REPLACE NETWORK POLICY account_whitelist ALLOWED_IP_LIST =($inergy_vpn, $natgw_common, $caldic_datacenter, $devops_build_agent) BLOCKED_IP_LIST =() COMMENT = 'Deze policy bevat alle adressen vanuit waar connectie gemaakt mag worden met dit account';

--policy activeren
USE ROLE ACCOUNTADMIN;

ALTER ACCOUNT
SET
    NETWORK_POLICY = account_whitelist;

CREATE
OR REPLACE NETWORK POLICY azure_whitelist ALLOWED_IP_LIST =(
    $inergy_vpn,
    $natgw_common,
 
) BLOCKED_IP_LIST =() COMMENT = 'Deze policy bevat alle adressen vanuit waar azure connectie kan maken met dit account';

//ALTER USER SLA_DASHBOARD
//SET
//    NETWORK_POLICY = azure_whitelist;

ALTER USER ETL_DEV
SET
    NETWORK_POLICY = azure_whitelist;

ALTER USER ETL_TST
SET
    NETWORK_POLICY = azure_whitelist;

//ALTER USER ETL_ACC
//SET
//    NETWORK_POLICY = azure_whitelist;

//ALTER USER ETL_PRD
//SET
//    NETWORK_POLICY = azure_whitelist;

ALTER USER POWERBI_DEV
SET
    NETWORK_POLICY = azure_whitelist;

ALTER USER POWERBI_TST
SET
    NETWORK_POLICY = azure_whitelist;
//
//ALTER USER POWERBI_ACC
//SET
//    NETWORK_POLICY = azure_whitelist;

//ALTER USER POWERBI_PRD
//SET
//    NETWORK_POLICY = azure_whitelist;

ALTER USER LIQUIBASE_DEV
SET
    NETWORK_POLICY = account_whitelist;

ALTER USER LIQUIBASE_TST
SET
    NETWORK_POLICY = account_whitelist;
//
//ALTER USER LIQUIBASE_ACC
//SET
//    NETWORK_POLICY = account_whitelist;
//
//ALTER USER LIQUIBASE_PRD
//SET
//    NETWORK_POLICY = account_whitelist;
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------



------------------------------------------------------------------------------------------------------------------
-- COMPARE STRUCTURE OF SINGLE TABLE IN 2 DATABASES
--------------------------------------------------------------------------------------------------------------------

use role developer;
set s_db = 'DWH_TST';
set t_db = 'DWH_TST';

set s_sc = 'DA_TMP';
set t_sc = 'DA';

set tb='HTMDM_COUNTRY';


set s = $s_db || '.' || 'INFORMATION_SCHEMA' || '.' || 'COLUMNS';
set t = $t_db || '.' || 'INFORMATION_SCHEMA' || '.' || 'COLUMNS';

with 
s as
(
    select * 
    from   identifier($s)
    where table_name = $tb
    and   table_schema =$s_sc
) 
,
t as
(
    select * 
    from   identifier($t)
    where table_name = $tb
    and   table_schema = $t_sc
  
) 
select * from    s
full outer join  t
where  s.table_name = t.table_name
and    s.column_name = t.column_name
and
( 
      s.column_name is null 
or    t.column_name is null 
or    s.data_type != t.data_type
);



------------------------------------------------------------------------------------------------------------------
-- CREATE READ ONLY ROLE 
--------------------------------------------------------------------------------------------------------------------
-- Statements taken from https://docs.snowflake.com/en/user-guide/security-access-control-configure.html#creating-read-only-roles
use role sysadmin;
create or replace role DWH_TST_IA_READ COMMENT = 'Role with read only access to IA schema';

grant role DWH_TST_IA_READ to role sysadmin;

grant usage on database dwh_tst to role DWH_TST_IA_READ;
grant usage on all schemas in database dwh_tst to role DWH_TST_IA_READ;

grant select on all tables in schema dwh_tst.ia_powerbi to role DWH_TST_IA_READ;
grant select on all views in schema dwh_tst.ia_powerbi to role DWH_TST_IA_READ;

grant select on future tables in schema DWH_TST.IA_POWERBI to role DWH_TST_IA_READ;
grant select on future views in schema DWH_TST.IA_POWERBI to role DWH_TST_IA_READ;

grant usage on warehouse wh_powerbi_tst to role DWH_TST_IA_READ;
grant operate on warehouse wh_powerbi_tst to role DWH_TST_IA_READ;

grant role DWH_TST_IA_READ to user "ROBERT.SPEULSTRA@INERGY.NL";

alter user "ROBERT.SPEULSTRA@INERGY.NL" set default_role = DWH_TST_IA_READ;
alter user "ROBERT.SPEULSTRA@INERGY.NL" set DISABLED=FALSE;





------------------------------------------------------------------------------------------------------------------
-- LINEAGE / EXPLAIN
--------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE PROCEDURE MA.MSPRC_DATALINEAGE( )
RETURNS VARCHAR(16777216)
LANGUAGE JAVASCRIPT
EXECUTE AS CALLER
AS $$
 
   //Opbouwen SQL voor het ophalen van SQL van views
   var sql_get_view_definition = 
		"with sqls as (select TABLE_SCHEMA, TABLE_NAME , VIEW_DEFINITION  , REGEXP_REPLACE(VIEW_DEFINITION,'\r',' ') as VIEW_DEF_CLEAN_R, REGEXP_REPLACE(VIEW_DEF_CLEAN_R,'\n',' ') as VIEW_DEF_CLEAN_RN "+
		", case when SPLIT_PART(lower( ltrim(VIEW_DEFINITION)),' ',1) ='create'	then substring(VIEW_DEFINITION,position(' as ',lower(REGEXP_REPLACE(VIEW_DEF_CLEAN_RN,'\r\n',' ')) )+4) else VIEW_DEFINITION end as VIEW_DEFINITION_CLEAN  "+
		"from INFORMATION_SCHEMA.VIEWS "+
		"where left(table_schema,2) in ('IA') " + 
		") select  TABLE_SCHEMA, TABLE_NAME , VIEW_DEFINITION,VIEW_DEFINITION_CLEAN from sqls" 
		;
       var stmt = snowflake.createStatement(
                {
                sqlText: sql_get_view_definition
                }
        );

    // Execute Statement
    var res = stmt.execute();
	 var recordcounter = 0;
    if (res.getRowCount() == 0) {
        throw "Error: niets gevonden ";
    	} else {

				// Door de alle SQLs heen lopen, resultaat van Explain wegschrijven in tmp_lineage tabel
				while (    res.next() ) {

					recordcounter = recordcounter + 1;

					// SQL opbouwen voor create bij eerste SQL, insert voor alle volgende
					if( recordcounter == 1) {
							var create_insert = "create or replace temp table tmp_lineage as ";
					    } else {
							var create_insert = "insert into tmp_lineage  ";
						}

					// SQL code klaarmaken door quotes te vervangen door dubbele qoutes

					var sql_text  = res.getColumnValue(4);
					var sql_text_quotes = sql_text.replace(/\'/g,"''") ;

					// Code opbouwen voor het uitvoeren van de explain en voor het selecteren van alle velden tbv de resultaat tabel					
		         var sql_explain = "select cast('"+ res.getColumnValue(1) +"' as varchar) as table_schema, cast('"+ res.getColumnValue(2) +"' as varchar) as table_name, cast('"+ sql_text_quotes +"' as varchar) as sql_text, * " +
							"from table(explain_json(system$explain_plan_json( \$\$" + res.getColumnValue(4) + "\$\$ ))) ";

//					return "Explain: " + create_insert+sql_explain + " " 	 ;	
					snowflake.execute (
					            {sqlText: create_insert+sql_explain}
					            );

					// wegschrijven in MA, update als record er al is, anders insert
					var sql_merge = "MERGE INTO ma.MADAD_LINEAGE USING " + 
									"(select table_schema, table_name, sql_text, listagg(\"objects\", ', ') as tables_involved, listagg(  \"expressions\", ', ') as columns_involved " + 
									"from tmp_lineage " + 
									"where \"objects\" is not null " + 
									"group by 1,2,3) table_lineage " + 
									"ON MADAD_LINEAGE.table_schema = table_lineage.table_schema and  MADAD_LINEAGE.table_name = table_lineage.table_name " + 
									"WHEN MATCHED THEN UPDATE set sql_text = table_lineage.sql_text, tables_involved = table_lineage.tables_involved, columns_involved = table_lineage.columns_involved, update_datetime=CURRENT_TIMESTAMP() " + 
									"WHEN NOT MATCHED THEN INSERT (table_schema, table_name, sql_text, tables_involved, columns_involved,update_datetime) " + 
									"values(table_lineage.table_schema, table_lineage.table_name, table_lineage.sql_text, table_lineage.tables_involved, table_lineage.columns_involved,CURRENT_TIMESTAMP())"  
						;
	//				return "Merge: " + sql_merge + " " 	 ;	

					snowflake.execute (
					            {sqlText: sql_merge}
					            );
				}

    }

    try {
        
        return "Succeeded." + " SQL Code: "  + sql_explain;   // Return a success/error indicator.
        }
    catch (err)  {
        throw "Error: " + err + " SQL Code: "  + sql_explain;   // Return a success/error indicator.
}
    
    $$;
    


------------------------------------------------------------------------------------------------------------------
-- SCD Duration by run_id
--------------------------------------------------------------------------------------------------------------------

select  run_id, 
        convert_timezone('America/Los_Angeles', 'Europe/Amsterdam', min (time_stamp))  start_time,
        convert_timezone('America/Los_Angeles', 'Europe/Amsterdam', max (time_stamp))  end_time,
       datediff( minute,
                 min (time_stamp)  
                 ,       
                 max (time_stamp) ) 
       as duration,
       count(distinct ref_table) as number_of_tables
from ma.melog_scd scd
       
group by 1;


------------------------------------------------------------------------------------------------------------------
-- FK Columns [based on naming convention]
--------------------------------------------------------------------------------------------------------------------

select table_schema, table_name, column_name 
from information_schema.columns
where table_schema = 'BA'
AND TABLE_NAME NOT LIKE 'IV_%'
and column_name like '%KEY%'
and column_name not like substring(table_name,4) || '_KEY';






------------------------------------------------------------------------------------------------------------------
-- Compare Table Structure Schema vs Temp Schema
--------------------------------------------------------------------------------------------------------------------

WITH 
BA AS
( 
    SELECT TABLE_NAME, COLUMN_NAME, ORDINAL_POSITION
    from information_schema.columns
    where table_schema='BA'
    AND TABLE_NAME = 'BV_SALESTRADEAGREEMENT'
)
,
BA_TMP AS
( 
    SELECT TABLE_NAME, COLUMN_NAME, ORDINAL_POSITION
    from information_schema.columns
    where table_schema='BA_TMP'
      AND TABLE_NAME = 'BV_SALESTRADEAGREEMENT'

)
SELECT * FROM BA 
FULL OUTER JOIN BA_TMP
ON BA.COLUMN_NAME = BA_TMP.COLUMN_NAME AND BA.TABLE_NAME = BA_TMP.TABLE_NAME
ORDER BY BA.COLUMN_NAME






------------------------------------------------------------------------------------------------------------------
-- Number of Transaction, Reference, Dimension and Facts
--------------------------------------------------------------------------------------------------------------------

select table_schema, sum( case when table_name like 'Dim%' then 0
                                when table_name like 'BA%' then 1
                                when table_name like 'Fct%' then 0
                                when table_name like 'BV%' then 0
                                else 0
                            end) as BA_TRANSACTION_TABLES,
                     sum( case when table_name like 'Dim%' then 0
                                when table_name like 'BA%' then 0
                                when table_name like 'Fct%' then 0
                                when table_name like 'BV%' then 1
                                else 0
                            end) as   BA_REFERENCE_TABLES
                            ,
                     sum( case when table_name like 'Dim%' then 1
                                when table_name like 'BA%' then 0
                                when table_name like 'Fct%' then 0
                                when table_name like 'BV%' then 0
                                else 0
                            end) as   IA_DIMENSION_TABLES
                            ,
                     sum( case when table_name like 'Dim%' then 0
                                when table_name like 'BA%' then 0
                                when table_name like 'Fct%' then 1
                                when table_name like 'BV%' then 0
                                else 0
                            end) as   IA_FACT_TABLES
                            
                            
from information_schema.tables
where table_schema in ('BA', 'IA_POWERBI')
--AND TABLE_NAME LIKE 'Dim'
GROUP BY 1





------------------------------------------------------------------------------------------------------------------
-- Policy References (Masking)
--------------------------------------------------------------------------------------------------------------------

select *
  from table(information_schema.policy_references(policy_name => 'DWH_DEV_RNADORP.MA.MSPOL_MASK_HASH'));
 

select *
  from table(information_schema.policy_references(ref_entity_name => 'DWH_DEV_RNADORP.BA.BV_EMPLOYEE', ref_entity_domain => 'table'));
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------


