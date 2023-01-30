# DataFactory

## Create Resource

## Key Vault Linked Service



In order for data factory  to access secrets in a key vault, the relevant data factory instance must have a managed identity, as described here: [https://docs.microsoft.com/nl-nl/azure/data-factory/store-credentials-in-key-vault](https://docs.microsoft.com/nl-nl/azure/data-factory/store-credentials-in-key-vault). The application-id associated with this managed identity needs to be granted access to the key vault. To do this, go to the Key Vault resource from the azure portal and select "Access Policies", and click "Add new":

![](<../.gitbook/assets/image (28).png>)

Select the relevant authorization-scheme, and then lookup the azure data factory instance to grant access in the "Select Principal" field, by entering its name or application-id (the one that is associated with the managed identity of the data factory instance).

![](<../.gitbook/assets/image (33).png>)

When the data factory resource is authorized for accessing the key vault as described above a linked service can be created in the Data Factory. To do this, go to the Connections tab in the Azure DataFactory - monitor pane:

![](<../.gitbook/assets/image (17).png>)

Then click "New" and search for "Key Vault". After selecting "Key Vault" as the resource to create a new linked service for, a new window will appear:

![](<../.gitbook/assets/image (16).png>)

Select the Azure Key vault instance from the drop down box, and click Finish.&#x20;



## Extract Zip to CSV (Azure Blob to Azure Blob)

* Doel
  * Een zip-file met csv-bestanden vanuit een Azure Blob Container uitpakken naar een Azure Blob Container
  * CSV bestanden hebben verschillende grootte en layout&#x20;
* Pre-condities
  * Er is een storage account
  * Er is een Data Factory service (V2)
  * Source Zip file staat in een Azure Blob container
  * Er is een target Azure Blob container
* Steps
  1. Open DataFactory Author & Monitor (bijv. via Azure Dashboard => Data Factory service \<naam> => Author & Monitor (een nieuw window wordt gestart)
  2. Click de "Author" button links boven. Het author Data Factory scherm wordt getoond met Pipelines en Datasets: &#x20;
  3. Registreer source dataset (via het + symbool) met de volgende Connection Settings:- LinkedService: zie onder\
     \- File path: locatie van de dataset\
     \- Compression Type: ZipDeflate\
     \- Compression Label: Optimal
  4. Registreer target dataset (via het + symbool) met de volgende Connection settings - LinkedService: zie hieronder\
     \- File path: locatie van de zip-file\
     \- Compression Type: none\
     \- Binary copy: checked.
  5. Creeer een linked service via het + symbool van de dataset onder tabblad Connection met de volgende settings: - Name: \<whatever>\
     \- Description: \<whatever>\
     \- Connect via integration runtime: AutoResolveIntegrationRuntime\
     \- Authentication method: Use Account Key\
     \- Connection String: Enter manually\
     \- Storage account key: \<copy from storage account access keys in Azure Portal>:
  6. Alternatief: \
     \- Authentication method: Use Account key\
     \- Account selection method: From Azure subscription\
     \- Azure subscription: \<select subscription>\
     \- Storage account name: \<select storage account>
  7. Creeer een nieuwe pipeline via het + symbool en keuze "Pipeline"
  8. Sleep "Copy Data" transformatie onder "Data Transformation" op het canvas en geef het een naam
  9. Selecteer Source DataSet
  10. Selecteer Sink DataSet, met Copy Behavior "None"
  11. Run Pipeline via button "Trigger" => Trigger Now
  12. Monitor pipeline via button "Monitor" (linksboven)
* Post-Condities
  * Azure Blob Container met uitgepakte bestanden&#x20;

## DataBricks

Read CSV files (Azure Blob Storage to DataBricks dataset )

1. Create DataBricks Linked service within DataFactory
   * Follow this guide: [https://docs.microsoft.com/nl-nl/azure/data-factory/transform-data-using-databricks-notebook](https://docs.microsoft.com/nl-nl/azure/data-factory/transform-data-using-databricks-notebook)
   * In order to access a ADB Workspace from ADF, a token needs to be generated from ADB (follow this guide: [https://docs.databricks.com/api/latest/authentication.html#generate-token](https://docs.databricks.com/api/latest/authentication.html#generate-token)
   * For an existing ADB Cluster the id can be obtained via ADB/Clusters/\<cluster name>/Spark-UI/Environment

## Python Package in DataBricks

Je kan externe packages in DataBricks gebruiken.. Hiervoor registreer je een library (per Notebook of in de folder Shared voor de workspace). Deze is daarna te gebruiken in je omgeving. ![](blob:https://teams.microsoft.com/c1cb6d5c-7402-4f25-8e3f-6b3584313b12)&#x20;

## Blob Timestamp in Azure Storage Container

De timestamp van een blob in een Azure Storage Container kan binnen DataBricks op de volgende manier bepaald worden.&#x20;

### Stap 1. Installeer library azure.storage.blob

Zie sectie [Python Package in DataBricks in Wiki](https://teams.microsoft.com/l/entity/com.microsoft.teamspace.tab.wiki/tab%3a%3a792b2c79-d89c-467b-86b5-f831e8f6b0bf?label=Python+Package+in+DataBricks+in+Wiki\&context=%7b%0d%0a++%22subEntityId%22%3a+%22%7b%5c%22pageId%5c%22%3a10%2c%5c%22sectionId%5c%22%3a19%2c%5c%22origin%5c%22%3a2%7d%22%2c%0d%0a++%22canvasUrl%22%3a+%22https%3a%2f%2fteams.microsoft.com%2fl%2ftab%2f19%253ace0f8c52ee19419c939f5af9cb0276f1%2540thread.skype%2ftab%253a%253a792b2c79-d89c-467b-86b5-f831e8f6b0bf%3flabel%3dWiki%26tenantId%3dfb571074-850c-4444-b482-daf6de9f124f%22%2c%0d%0a++%22channelId%22%3a+%2219%3ace0f8c52ee19419c939f5af9cb0276f1%40thread.skype%22%0d%0a%7d\&tenantId=fb571074-850c-4444-b482-daf6de9f124f)&#x20;

### Stap 2. Haal timestamp op van blob

In een Python Notebook kan vervolgens mbv deze library de timestamp van blobs bepaald worden. **Voorbeeld**In onderstaand voorbeeld worden de variabelen "storage\_account\_name" en "storage\_account\_access\_key" gebruikt. deze moeten vooraf natuurlijk wel met de juiste waarden zijn gevuld.&#x20;

```
import os, uuid, sys
from azure.storage.blob import BlockBlobService
def run_sample():
    try:
        # Create the BlockBlockService that is used to call the Blob service for the storage account
        block_blob_service = BlockBlobService(account_name=storage_account_name, account_key=storage_account_access_key)         
        container_name ='ingest'
        print("\nList blobs in the container")
        generator = block_blob_service.list_blobs(container_name)
        for blob in generator:
            print("\t Blob name: " + blob.name)
            last_modified = blob.properties.last_modified
            print(last_modified)
    except Exception as e:
        print(e)
        
if __name__ == '__main__':
    run_sample()
```
