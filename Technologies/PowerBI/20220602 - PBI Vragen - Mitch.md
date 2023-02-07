Vragen
1.  Wat is het verschil tussen een PBI Dashboard en Report?
   ![[Pasted image 20220601090311.png]]




Rapport: in PBI Desktop en dan publiceren
Dashboard: samenvoeging van verschillende een tegel (rapport visual)
Meerdere visualisaties pinnen op een dashboard
2.  Draait een PBI Dashboard bovenop een PBI Report of een Dataset?
    Report
3.  Waarom zou je een Dashboard willen hebben? Maw: waarom volstaat een Report niet?
DB bedoeld voor een overkoepelende view. Bijv voor CFO.
1 keer neergezet bij een klant
Eerder kiezen voor een rapport voor overkoepelend niveau.
Meestal rapporten in verschillende werkruimten: vanwege rechten.

    
4.  Wat kost de ontwikkeling van gemiddeld Report (bijv. met 2 tabs), in mandagen?
    
5.  Wat kost de ontwikkeling van een gemiddeld Dashboard, in mandagen?
   Minimaal. Click and play. 2 uur.
6. Dataset vs AAS
7. RBAC
	1.   Op werkruimten (domein)
	2.  RLS
	3. App toegang voor eindgebruikers
	![[Pasted image 20220601091206.png]]
![[Pasted image 20220601090958.png]]
![[Pasted image 20220601091058.png]]
Toegang voor developers tot werkruimte.

8. Implementatie RLS: hoeveel tijd
	1. Dynamisch (locatie): 8 uur 
	2. Rol aanmaken in PBI. Groepen koppelen aan een rol. 
	3. Security tabel: bijv email - locatie
	4. Filteren in PBI 
	   ![[Pasted image 20220601093036.png]]
	   JL: filiaalmanager: alleen eigen filiaal. 
	   OLS: meer complex. Vooral combi RLS en OLS is complex => 3/4 dagen 
	   
9. PBI Data
	1. PBI Dataset: connectie met dwh, relaties + kpi's Bron voor alle rapporten. Shared Dataset. In 1 werkruimte:
	   ![[Pasted image 20220601091735.png]]
	   2. AAS Datamodel
		   1. Onder water gaat PBI voor elk rapport een datamodel maken
		   ![[Pasted image 20220601091842.png]]
		   ![[Pasted image 20220601091916.png]]
		   Azure Analysis Services. Gaan we niet meer doen. Publiceren naar PBI service => cache in PBI (NRT)

