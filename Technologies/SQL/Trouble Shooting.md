
# Requested tenant identifier '00000000-0000-0000-0000-000000000000' is not valid. Tenant identifiers may not be an empty GUID.
## Description
Error message when trying to login to database with SSMS using AAD authentication with MFA
## Cause
Azure Active Directory admin not set for SQL Server DB

## Solution
Set admin on DB in Azure Portal:
Portal->ResourceGroup->SQL Server -> Azure Active Directory -> Set admin
![[Pasted image 20221103153645.png]]
