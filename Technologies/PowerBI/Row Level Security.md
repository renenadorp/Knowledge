# Dynamic RLS
Steps:
- Create Role in PBI Service
- Create BridgeTable between User and Dimension Table
- Create Datamodel in PowerBI Desktop:

```mermaid
graph TD;
	User --> DimUserBridge;
	Dim --> DimUserBridge;
	Dim --> Fact;
	
```
- Note the direction of the arrows. These are very relevant for PBI. 
- Write DAX code using LOOKUP for each Dimension

# Static RLS
