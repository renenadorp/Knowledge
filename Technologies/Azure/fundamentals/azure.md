# Azure Templates (ARM)

## References

* Azure Quickstart Templates: [https://github.com/Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates)
* Template Functions: [https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-functions &#x20;  ](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-functions)
* Template Outputs: [https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-templates-outputs  ](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-templates-outputs)
* Best practicses: [https://docs.microsoft.com/nl-nl/azure/azure-resource-manager/template-best-practices](https://docs.microsoft.com/nl-nl/azure/azure-resource-manager/template-best-practices)

## Deployment Behaviour

* By default, Resource Manager handles deployments as **incremental** updates to a resource group.
* Leaves unchanged resources that exist in the resource group but are not specified in the template.
* Adds resources that are specified in the template but do not exist in the resource group.
* Does not re-provision resources that exist in the resource group in the same condition defined in the template.
* Re-provisions existing resources that have updated settings in the template.

## Template Structure

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {},
    "variables": {},
    "resources": [],
    "outputs": {}
}
```

## Template Functions

| Numeric     | String         | Array    | Resource         | Logical | Comparison      | Deployment |
| ----------- | -------------- | -------- | ---------------- | ------- | --------------- | ---------- |
| Add()       | Base64()       | Concat() | listAccountSas() | and     | equals          | deployment |
| copyIndex() | concat()       | Length() | listKeys()       | bool    | greater         | parameters |
| div()       | padLeft()      | Split()  | listSecrets      | if      | greaterOrEquals | variables  |
| int()       | replace()      |          | list\*()         | not     | less            |            |
| length()    | split()        |          | providers()      | or      | lessOrEquals    |            |
| mod()       | string()       |          | reference()      |         |                 |            |
| mul()       | substring()    |          | resourceGroup()  |         |                 |            |
| Sub()       | toLower()      |          | resourceId()     |         |                 |            |
|             | toUpper()      |          | subscription()   |         |                 |            |
|             | trim()         |          |                  |         |                 |            |
|             | uniqueString() |          |                  |         |                 |            |
|             | Uri()          |          |                  |         |                 |            |

## Template Validation

A general best practice is to first validate the template before actually deploying it. This can be done with the following command:

```
Test-azResourceGroupDeployment -ResourceGroupName <RG>  -TemplateFile <TemplateFileName>.json -TemplateParameterFile <TemplateParameterFileName>.json
```

The validation command above will return nothing if all is well. If not it will return an error message.

Sometimes the error message does not provide enough detail. If you're lucky Azure will give you a tracking-id that you can use to find more detailed information about the error. See example below.

```
Test-azResourceGroupDeployment -ResourceGroupName BI4IT  -TemplateFile Templates/StorageAccount.json -TemplateParameterFile ./Templates/StorageAccountParameters.json

Code    : InvalidTemplateDeployment
Message : The template deployment 'f752318e-3d77-4a63-a92f-6684f631f2d2' is not valid according to the validation procedure. The tracking id is 
          '2bfbcaf2-96cb-4d16-8f56-8046834924cf'. See inner errors for details. Please see https://aka.ms/arm-deploy for usage details.
Details : {Microsoft.Azure.Commands.ResourceManager.Cmdlets.SdkModels.PSResourceManagerError}

```

Command to obtain more detailed information:

```
Get-AzLog -CorrelationId xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -DetailedOutput
```

## Linked Templates

Example template-file with a linked template stored in a storage account. In order to be able to access the storage account a SAS token is passed as a parameter.

```
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "Customer": {
            "type": "string",
            "defaultValue": "Carglass"
        },
        "Environment": {
            "type": "string",
            "allowedValues": [
                "dev",
                "tst",
                "prd"
            ],
            "defaultValue": "dev"
        },
        "ResourceNamePrefix": {
            "type": "string",
            "defaultValue": "cgazbi"
        },
        "DevOpsAccountSASToken": { "type": "string" }


    },
    "variables": {
        "StorageAccountNameDevOps"  : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'staDevOps')]"},
        "StorageAccountNameLog"     : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'stalog',parameters('Environment'))]"},
        "StorageAccountNameFSX"     : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'stafsx',parameters('Environment'))]"},
        "StorageAccountNameBOM"     : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'stabom',parameters('Environment'))]"},
        "DataFactoryName"           : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'dft',parameters('Environment'))]"},
        "DataBricksWorkspaceName"   : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'dbr',parameters('Environment'))]"},
        "SQLServerName"             : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'sql',parameters('Environment'))]"},
        "SQLDatabaseName"           : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'dwh',parameters('Environment'))]"},
        "KeyVaultName"              : {"type":"string", "value": "[concat(parameters('ResourceNamePrefix'),'kvt',parameters('Environment'))]"},
        "DevOpsContainer"           : {"type":"string", "value": "[parameters('Environment')]"}
        
        
    },
    "resources": [
        {
           "apiVersion": "2017-05-10",
           "name": "linkedTemplateStorageAccountLog",
           "type": "Microsoft.Resources/deployments",
           "properties": {
             "mode": "Incremental",
             "templateLink": {

                "uri": "[concat('https://', variables('StorageAccountNameDevOps').value, '.blob.core.windows.net/', parameters('Environment').value,'/Templates/StorageAccount.json', parameters('DevOpsAccountSASToken'))]",
                "contentVersion":"1.0.0.0"
             },
             "parameters": {
                "StorageAccountName": {"value":"[variables('StorageAccountNameLog').value]"}
              }
           }
        }
      ],    
      "outputs": { 
        "resultMessageStorageAccount": {
            "type": "string",
            "value": "[reference('linkedTemplateStorageAccount').outputs.resultMessage.value]"
        }


      }
}
```
