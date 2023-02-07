# Powershell

## Installation

Required components

* **The base PowerShell product** This comes in two variants: PowerShell on Windows, and PowerShell Core on macOS and Linux.
* **The Azure PowerShell module** This extra module must be installed to add the Azure-specific commands to PowerShell.

Install:

1.  Install Homebrew-Cask to obtain more packages, including the PowerShell Core package:bashCopy

    ```
    brew tap caskroom/cask
    ```
2.  Install PowerShell Core:bashCopy

    ```
    brew cask install powershell
    ```
3.  Start PowerShell Core to verify that it installed successfully:bashCopy

    ```
    pwsh
    ```

## Install a Resource Group using Powershell

There are four steps we need to perform:

1. Import the Azure cmdlets.
2. Connect to your Azure subscription.
3. Create the resource group.
4. Verify that creation was successful (see below).

The following illustration shows an overview of these steps.

![An illustration showing the steps to create a resource group.](https://docs.microsoft.com/en-us/learn/modules/automate-azure-tasks-with-powershell/media/5-create-resource-overview.png)

## Powershell Cmdlets

| Cmdlet                                                                                                                                                                 | Effect                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Import-Module Az                                                                                                                                                       | Load the Az module                      |
| Connect-AzAccount                                                                                                                                                      | Login to Azure                          |
| Get-AzContext                                                                                                                                                          | Show which Azure subscription is active |
| Select-AzSubscription -Subscription "Visual Studio Enterprise"                                                                                                         | Select a subscription                   |
| Get-AzResourceGroup                                                                                                                                                    | Get a list of RGs in JSON               |
| Get-AzResourceGroup \| Format-Table                                                                                                                                    | Get a list of RGs in a table            |
| New-AzResourceGroup -Name  -Location                                                                                                                                   | Create a RG                             |
| Get-AzResource                                                                                                                                                         | Get all resources                       |
| Get-AzResource -ResourceGroup ExerciseResources                                                                                                                        | Get all resources within a RG           |
| New-AzVm -ResourceGroupName b17041c1-38a1-4260-8f50-daa8737419ef -Name "testvm-eus-01" -Credential (Get-Credential) -Location "East US" -Image UbuntuLTS -OpenPorts 22 | Create VM                               |
| $vm = Get-AzVM -Name "testvm-eus-01" -ResourceGroupName b17041c1-38a1-4260-8f50-daa8737419ef                                                                           | Load VM info into a variable            |
| $vm.HardwareProfile                                                                                                                                                    | Show a part of the variable             |
| $vm \| Get-AzPublicIpAddress                                                                                                                                           | Show public IP adress of the VM         |
| Get-AzDisk -ResourceGroupName $vm.ResourceGroupName -DiskName $vm.StorageProfile.OSDisk.Name \| Remove-AzDisk -Force                                                   |                                         |
| Get-AzVirtualNetwork -ResourceGroupName ...                                                                                                                            |                                         |
| Get-AzNetworkSecurityGroup -ResourceGroup $vm.ResourceGroupName \| Remove-AzNetworkSecurityGroup -Force                                                                |                                         |
| Get-AzPublicIpAddress -ResourceGroup $vm.ResourceGroupName \| Remove-AzPublicIpAddress -Force                                                                          |                                         |
| Get-AzResource -ResourceType Microsoft.Compute/virtualMachines                                                                                                         | List resources of  type VM              |
