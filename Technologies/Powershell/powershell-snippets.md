# Powershell Snippets

## Remove Deployments

Azure has a limit (default is 800) for storing deployments (ResourceGroup->Deployments). Once this limit is reached, deployment is no longer possible. The script below can be used to remove deployments. Note that this will not affect resources in any way. It will only remove information about the deployments.

```
$resourceGroupName = "<rg>"
$deployments = Get-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName
$deploymentsToDelete = $deployments | where { $_.Timestamp -lt ((get-date).AddDays(-7)) }

foreach ($deployment in $deploymentsToDelete) {
	Start-Job -ScriptBlock {
		param($resourceGroupName, $deploymentName, $path)
		Select-AzureRmProfile -Path $path
		Remove-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -DeploymentName $deploymentName
	} -ArgumentList @($resourceGroupName, $deployment.DeploymentName, $path) | Out-Null
}
```

## AzCopy to StorageAccount

```
<#
This script uploads a local file to a storage account
#>
param (
    $FileName       = $(throw "FileName parameter is required."),
    $Environment    = $(throw "Environment parameter is required."),
    $SourceSystem   = $(throw "SourceSystem parameter is required."),
    $BlobContainer  = $(throw "BlobContainer parameter is required."),
    $BaseDir        = 'C:<path>'
    )

$UploadRootDir  = Convert-Path .		# current directory
$UploadSubDir   = $BaseDir+"\upload"			# uploaddirectory
$StorageAccount = '<prefix>'+$SourceSystem+$Environment

$SourceFile      = $UploadSubDir+'\'+$FileName

if ($Environment = 'prod') {$DestKey = "<Key>"}
if ($Environment = 'uat')  {$DestKey = ''}
if ($Environment = 'dev')  {$DestKey = ''}


set-alias azc "C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe"  

azc /Source:$SourceFile /Dest:https://$StorageAccount.blob.core.windows.net/$BlobContainer/$FileName  /DestKey:$DestKey /Y

Write-Host -NoNewLine "End of script. Press any key to continue...";
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown');

```
