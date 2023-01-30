# CLI

## Installation (Mac)

```
brew install azure-cli
```

## Finding Azure CLI Commands

```
az find -q blob
az storage blob --help
```

| Command                                                                    | Effect                                |
| -------------------------------------------------------------------------- | ------------------------------------- |
| az group list --output table                                               | Show resource groups in a table       |
| az group list                                                              | Show resource groups as json          |
| az group list --query "\[?name == '9d11f87d-d22a-4037-95cb-bd3b19e61900']" | Show resource groups based on a query |
| az webapp list --output table                                              | list web apps                         |

## VM

### Create a virtual machine with Azure CLI

```
az vm create \
  --name myVM \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --image UbuntuLTS \
  --location eastus \
  --size Standard_DS2_v2 \
  --admin-username azureuser \
  --generate-ssh-keys
```

```
az vm get-instance-view \
  --name myVM \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --output table
```

Bash-script te downloaden en uit te voeren waarmee Nginx wordt geïnstalleerd en een basistartpagina wordt geconfigureerd.

```
az vm extension set \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --vm-name myVM \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings "{'fileUris':['https://raw.githubusercontent.com/MicrosoftDocs/mslearn-welcome-to-azure/master/configure-nginx.sh']}" \
  --protected-settings "{'commandToExecute': './configure-nginx.sh'}"
```

```
az vm open-port \
  --name myVM \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --port 80
```

```
az vm show \
  --name myVM \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --show-details \
  --query [publicIps] \
  --output tsv
```

```
az vm resize \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --name myVM \
  --size Standard_DS3_v2
```

```
az vm show \
  --resource-group 35670acc-31d5-41fc-a5e6-18a5cb239ae6 \
  --name myVM \
  --query "hardwareProfile" \
  --output tsv
```
