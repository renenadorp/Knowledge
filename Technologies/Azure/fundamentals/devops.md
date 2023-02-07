---
description: Azure DevOps Tips
---

# DevOps

## Pipelines

### Build Pipelines

Screenshot below shows a build pipeline. In the first step an Azure Key Vault is accessed to retrieve secret values, e.g. password, database names. These values are available as pipeline variables (e.g.  $(jdbcPassword) for SQL database password ) in consecutive steps. The names of the variables are the same as the secret names.

![Build Pipeline](<../.gitbook/assets/image (37).png>)

The last task of this pipeline is to publish a pipeline artifact to make it available for release pipelines.

## DataBricks Devops Integration

Ref: [https://medium.com/@bedatse/azure-devops-ci-cd-with-azure-databricks-and-data-factory-part-1-c05a44536a8e](https://medium.com/@bedatse/azure-devops-ci-cd-with-azure-databricks-and-data-factory-part-1-c05a44536a8e)

Azure DevOps CI/CD with Azure Databricks

#### Prerequisites <a href="#77a4" id="77a4"></a>

You need to have an _**Azure account**_, an _**Azure DevOps organisation**_, you can leverage either _**GitHub**_ as repository or _**Azure Repos**_ as repository. In this series, we will assume you are using Azure Repos.

You will need to _**create a project**_ on Azure DevOps, together with a _**repository**_. A sample repository can be found [here](https://dev.azure.com/bedatse/azure-dataops/\_git/databricks-sample).

You will need a _**git client**_, or command line git. We will use command line git throughout the series, thus assuming that you also have a terminal, such as Terminal on Mac, or [Git-Bash](https://git-scm.com/downloads) on Windows.

You will need a _**text editor**_ other than the normal Databricks notebook editor. [Visual Studio Code](https://code.visualstudio.com/) is a good candidate for that. If the text editor have built-in git support, that will be even better.

**Checklist**

1. Azure Account
2. Azure DevOps Organisation and DevOps Project
3. Azure Service Connections set up inside Azure DevOps Project
4. Git Repos (Assuming you are using Azure Repository)
5. Git Client (Assuming you are using command line Git)
6. Text Editor (e.g. Visual Studio Code, Sublime Text, Atom)

#### Step 0: Set up your repository and clone it onto your local workstation <a href="#05ec" id="05ec"></a>

0–1. In your Azure DevOps, [set up your SSH key or Personal Access Token](https://docs.microsoft.com/en-us/azure/devops/repos/git/auth-overview?view=azure-devops).

0–2. Create git repo on Azure DevOps with initial README![](https://cdn-images-1.medium.com/freeze/max/32/1\*hoztdKgZr990HsaoQyLBrw.png?q=20)![](https://cdn-images-1.medium.com/max/848/1\*hoztdKgZr990HsaoQyLBrw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/848/1\*hoztdKgZr990HsaoQyLBrw.png">0–2. Create your git repo on Azure DevOps inside a project with initial README.

0–3. Locate your git repository URL for git clone![](https://cdn-images-1.medium.com/freeze/max/32/1\*BIIwR6NK60F0XPlCR4bOow.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*BIIwR6NK60F0XPlCR4bOow.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*BIIwR6NK60F0XPlCR4bOow.png">0–3. Locate your git URL for cloning

0–4. Clone the repository via git using the following command

```
$ git clone <repository-url>
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*VonKM4D0xGpeDnh0\_hCgjg.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*VonKM4D0xGpeDnh0\_hCgjg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*VonKM4D0xGpeDnh0\_hCgjg.png">0–4. Now you have cloned your repository locally.

#### Step 1: Provisioning Azure Databricks and Azure Key Vault with Azure Resource Manager Template <a href="#de8a" id="de8a"></a>

We want to automated the service provisioning or service updates. When you need to set up another set of Databricks, or update anything, you can just update configuration json in the repository, or variables stored on Azure DevOps Pipeline, which we will cover in the next steps. Azure DevOps Pipeline will take care of everything else for you.

1–1. Copy `template.json` `parameters.json` `azure-pipeline.yml` `notebook-run.json.tmpl` from [this commit](https://dev.azure.com/bedatse/azure-dataops/\_git/databricks-example?version=GC33b8bb26b1bc321650ee066031240b5de2cf2d87) of the example repository, put them into your repository local folder.

1–2. Stage the changed file in git, commit and push it onto the Azure Repo.

```
$ git add -A
```

```
$ git commit -m '<your-commit-message>'
```

```
$ git push
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*aX-fS3np-yqdr-cE8UbV4w.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*aX-fS3np-yqdr-cE8UbV4w.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*aX-fS3np-yqdr-cE8UbV4w.png">1–2. Commit and Push infrastructure code and build pipeline code onto repository![](https://cdn-images-1.medium.com/freeze/max/32/1\*1aAdGIVUSFR4wbnfjZn6LA.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*1aAdGIVUSFR4wbnfjZn6LA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*1aAdGIVUSFR4wbnfjZn6LA.png">1–2. After pushing code back into repository, it should look like this.

1–3. Create your build pipeline, go to **Pipelines > Builds** on the sidebar, click **New Pipeline** and select **Azure DevOps Repo**. Select your repository and review the pipeline `azure-pipeline.yml` which has already been uploaded in step 1–2. Click **Run** to run the build pipeline for the first time.![](https://cdn-images-1.medium.com/freeze/max/32/1\*TFvbkN4eBnfECU3Z0C6LFA.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*TFvbkN4eBnfECU3Z0C6LFA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*TFvbkN4eBnfECU3Z0C6LFA.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*8K7LeazVy9YAedhqF3SZCQ.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*8K7LeazVy9YAedhqF3SZCQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*8K7LeazVy9YAedhqF3SZCQ.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*\_2laZHuNHwFYS1z1xOlq\_A.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*\_2laZHuNHwFYS1z1xOlq\_A.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*\_2laZHuNHwFYS1z1xOlq\_A.png">1–3–1 Create new Build Pipeline![](https://cdn-images-1.medium.com/freeze/max/32/1\*4usufKX3QrUtHSHxQHwsIA.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*4usufKX3QrUtHSHxQHwsIA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*4usufKX3QrUtHSHxQHwsIA.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*WasepUqazDO6Z6kSpvOOFw.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*WasepUqazDO6Z6kSpvOOFw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*WasepUqazDO6Z6kSpvOOFw.png">1–3–2 Review the content of the pipelines and execution result

The build pipeline currently only do one thing, which is to pack the Azure Resource Manager JSONs into a build artifact, which can be consumed on later steps for deployment. Let take a look what is inside of the artefact now.

In your build, click **Artifacts** > **arm\_templates**. The details of the artifact will be displayed.![](https://cdn-images-1.medium.com/freeze/max/32/1\*Ug572crPuig3PdM7AScp-A.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*Ug572crPuig3PdM7AScp-A.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*Ug572crPuig3PdM7AScp-A.png">The artifact **arm\_template** contains ARM JSON files.

1–4. Create variable group for your deployment. You don’t want to hardcode your variables inside the pipeline, such that you can make it reusable in another project or environment with least effort. First, let’s create a group for your Project, storing all variables that would be the same across all environments.

Go to **Pipelines** > **Library**, Click on **+Variable group**. Type in your variable group name, as an example, we are using _Databricks Pipeline_ as the variable group name. Add a variable with _Name_ `project_name` with _Value_ `databricks-pipeline` . Save the changes after you are done.![](https://cdn-images-1.medium.com/freeze/max/32/1\*APlwjDYxXzsL0iwN1v\_ttw.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*APlwjDYxXzsL0iwN1v\_ttw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*APlwjDYxXzsL0iwN1v\_ttw.png">1–4–1 Project-wide Variable Group

Create another group named _Dev Environment Variables_, this one will have more variables in it, as listed below.

* `databricks_location`: \<databricks location>
* `databricks_name`: \<databricks name>
* `deploy_env`: \<deployment environment name>
* `keyvault_owner_id`: \<your user object ID in Azure AD>
* `keyvault_name`: \<key vault name for storing databricks token>
* `rg_groupname`: \<resource group name>
* `rg_location`: \<resource group location>
* `tenant_id`:\<your Azure AD tenant ID>

![](https://cdn-images-1.medium.com/freeze/max/32/1\*pRWfytEyHt63m4dqdxvJiQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*pRWfytEyHt63m4dqdxvJiQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*pRWfytEyHt63m4dqdxvJiQ.png">

1–5. Create a new release pipeline, Go to **Pipelines** > **Releases**, click on **+New**. Select start with an _**Empty job**_ when you are asked to select a template. Name your stage _**Dev Environment**_, in future tutorials, we will be cloning this stage for _**Staging Environment**_ and _**Production Environment**_.![](https://cdn-images-1.medium.com/freeze/max/32/1\*u4snaOtA28kwpvHVME83aA.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*u4snaOtA28kwpvHVME83aA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*u4snaOtA28kwpvHVME83aA.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*AWr2YRPxkVo1X9YG8B\_Pjw.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*AWr2YRPxkVo1X9YG8B\_Pjw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*AWr2YRPxkVo1X9YG8B\_Pjw.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*DDn4KzH0eapq1uNg7Vu7gQ.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*DDn4KzH0eapq1uNg7Vu7gQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*DDn4KzH0eapq1uNg7Vu7gQ.png">1–5–1 Create New Release Pipeline

Add your build artifact from your repository as the source artifact. In this example, we will add from databricks example. Click **+Add** next to _**Artifacts**_.

Select **Build** as _**Source type**_, select your _**Project**_ and _**Source**_. Select **Latest** as _**Default version**_, keep _**Source alias**_ unchanged. Click **Add** when you are done.![](https://cdn-images-1.medium.com/freeze/max/32/1\*efhNQNVJ0qxW-NGS8G2vSQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*efhNQNVJ0qxW-NGS8G2vSQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*efhNQNVJ0qxW-NGS8G2vSQ.png">1–5–4 Add an artifact to the release pipeline as trigger.

Before moving onto specifying _Tasks_ in the _**Dev Environment Stage**_, let’s link the variable group with the release pipeline and the Dev Environment Stage.

Go to **Variables** > **Variable groups**, Click **Link variable group**. Link your _**Databricks Pipeline**_ created in step 1–4 with scope set to _**Release**_. Link your _**Dev Environment Variables**_ created in step 1–4 with scope set to _**Stages**_, and apply to _**Dev Environment**_ stage.![](https://cdn-images-1.medium.com/freeze/max/32/1\*bZUIAcEKFpJkEYY4v3j\_Pw.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*bZUIAcEKFpJkEYY4v3j\_Pw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*bZUIAcEKFpJkEYY4v3j\_Pw.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*qc6lRC-uTldA7D9Tl-q2yw.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*qc6lRC-uTldA7D9Tl-q2yw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*qc6lRC-uTldA7D9Tl-q2yw.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*WgdeO3IjbFmlxJHUn-pILQ.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*WgdeO3IjbFmlxJHUn-pILQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*WgdeO3IjbFmlxJHUn-pILQ.png">1–5–5 Link Databricks Pipeline Project Variable Group with Release scope

With variable groups linked, we are ready for setting up tasks in the _**Dev Environment**_ stage. Click **Tasks** > **Agent job**, review the settings in there.![](https://cdn-images-1.medium.com/freeze/max/32/1\*KVXVdPgQnjWPB690UPnDnQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*KVXVdPgQnjWPB690UPnDnQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*KVXVdPgQnjWPB690UPnDnQ.png">1–5–6 Empty Agent Job

Click the **+** sign next to the Agent job, add an **Azure Resource Group Deployment** task.![](https://cdn-images-1.medium.com/freeze/max/32/1\*0B9pFjwrv7lyxvqTx37tgw.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*0B9pFjwrv7lyxvqTx37tgw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*0B9pFjwrv7lyxvqTx37tgw.png">1–5–7 Add task to Deployment stage

Now, we can configure **Azure Resource Group Deployment** task. Select the service connections from previous step, keep _**Action**_ as **Create or update resource group**. For _**Resource group name**_ and _**location**_, type in `$(rg_groupname)` and `$(rg_location)` respectively.

For _**Template**_ and _**Template Parameters**_, click on the _**More**_ action button next to the text field, select **template.json** and **parameters.json** inside _\_databricks-example/arm\_template_. Before we set our override template parameters, let us set the _**Deployment mode**_ to **Incremental**.![](https://cdn-images-1.medium.com/freeze/max/32/1\*\_gyNIssQU\_hNkCSX03ZaJw.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*\_gyNIssQU\_hNkCSX03ZaJw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*\_gyNIssQU\_hNkCSX03ZaJw.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*BNbFseS\_yzVibqu9BnHA8A.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*BNbFseS\_yzVibqu9BnHA8A.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*BNbFseS\_yzVibqu9BnHA8A.png">1–5–8 Configuring Resource Group Task

The most challenging part in this section is _**Override template parameters**_, we have made this simple for you. Just copy the following snippet into the text field for now. This will allow you to override the default value specified in the _parameters file_ by the value specified in _Variable Group_.

```
-keyvaultName "$(keyvault_name)" -keyvaultLocation "$(databricks_location)" -workspaceName "$(databricks_name)" -workspaceLocation "$(databricks_location)" -tier "standard" -sku "Standard" -tenant "$(tenant_id)" -enabledForDeployment false -enabledForTemplateDeployment true -enabledForDiskEncryption false -networkAcls {"defaultAction":"Allow","bypass":"AzureServices","virtualNetworkRules":[],"ipRules":[]}
```

After all these, save your release pipeline and we are ready to create a release.

1–6. Create a release by going back to **Pipelines** > **Releases** screen. Click on **Create a release** button, then click Create. Your release will then be queued.![](https://cdn-images-1.medium.com/freeze/max/32/1\*UpwyCu7RmfC4jk38cBbhlw.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*UpwyCu7RmfC4jk38cBbhlw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*UpwyCu7RmfC4jk38cBbhlw.png">1–6–1 Create a release![](https://cdn-images-1.medium.com/freeze/max/32/1\*uzpZrmc9H\_7Qv7dixwNKUg.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*uzpZrmc9H\_7Qv7dixwNKUg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*uzpZrmc9H\_7Qv7dixwNKUg.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*\_nD0iQp9YnL-U0lEV5hnPg.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*\_nD0iQp9YnL-U0lEV5hnPg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*\_nD0iQp9YnL-U0lEV5hnPg.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*yNQz1vubFkzDEDdYKpE1og.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*yNQz1vubFkzDEDdYKpE1og.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*yNQz1vubFkzDEDdYKpE1og.png">1–6–2 Wait for provisioning result

#### Step 2: Generate Azure Databricks API Token and store the token into Azure Key Vault <a href="#c4c6" id="c4c6"></a>

2–1. Access Azure Portal, look for the newly created resource group and Databricks, and launch Databricks Workspace as usual.![](https://cdn-images-1.medium.com/freeze/max/32/1\*HNaOnsGLWteKUS20h0cIMQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*HNaOnsGLWteKUS20h0cIMQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*HNaOnsGLWteKUS20h0cIMQ.png">2–1 Access Databricks Workspace via Azure Portal

2–2. After logging into the workspace, click the **user icon** on the top right corner, select **User Settings**. Click **Generate New Token**, give it a meaningful comment and click **Generate**. We will use this token in our pipeline for Notebook deployment. Your token will only be displayed once, make sure you do not close the dialog or browser before you have copied it into key vault.![](https://cdn-images-1.medium.com/freeze/max/32/1\*RL-oPXYHF\_-1h9HQj149RQ.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*RL-oPXYHF\_-1h9HQj149RQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*RL-oPXYHF\_-1h9HQj149RQ.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*otkGirPuvDJ\_PNZrEzTEmg.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*otkGirPuvDJ\_PNZrEzTEmg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*otkGirPuvDJ\_PNZrEzTEmg.png">2–2 Generate new token

2–3. In another browser window, open Azure Portal, navigate to Azure Key Vault under the newly created Resource group. Access the **Secrets** tab, click **Generate/Import**. Set the _**Name**_ as `databricks-token`, and copy the newly generated token into _**Value**_. Click **Create** to save the token inside Azure Key Vault securely. Now you can safely close the![](https://cdn-images-1.medium.com/freeze/max/32/1\*L6ZZu4pC4Bx4XCDtAlBSdQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*L6ZZu4pC4Bx4XCDtAlBSdQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*L6ZZu4pC4Bx4XCDtAlBSdQ.png">2–3 Save Databricks token into Azure Key Vault

2–4. While we are in the Databricks workspace, also go to **Git Integration** tab and check _**Git provider**_ setting, make sure it is set to **Azure DevOps Services**, or to the repository of your choice.![](https://cdn-images-1.medium.com/freeze/max/32/1\*cdPOkeMiSHAdBbZMYlxthw.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*cdPOkeMiSHAdBbZMYlxthw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*cdPOkeMiSHAdBbZMYlxthw.png">2–4 Ensure git integration settings is set to Azure DevOps Services

2–5. Go to Azure DevOps Portal, go to **Pipelines** > **Library**. Click **+Variable Group** to create new Variable Group. This time we are linking an Azure Key Vault into Azure DevOps as variable group. This allows Azure DevOps to obtain token from Azure Key Vault securely for deployment. Name the variable group as _**Databricks Dev Token**_, select **Link secrets from an Azure key vault as variables**. Select the correct Azure subscription service connections and Key vault respectively. Click **+Add** and select _databricks-token_ in the _**Choose secrets**_ dialog. Click **Save**.![](https://cdn-images-1.medium.com/freeze/max/32/1\*p3ByEDtVTQ9u3E2wb6Vxbg.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*p3ByEDtVTQ9u3E2wb6Vxbg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*p3ByEDtVTQ9u3E2wb6Vxbg.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*yw9mBpnITmVip9IQHP95qw.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*yw9mBpnITmVip9IQHP95qw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*yw9mBpnITmVip9IQHP95qw.png">

#### Step 3: Link your workbook development with Source code repository <a href="#e244" id="e244"></a>

Databricks workspaces integrate with git seamlessly as an IDE. We have in previous steps 2–4 set up the integration between Databricks and a source code repository. We can now link the workbook with the repository and commit into a repository directly.

3–1. Open your notebook as usual, notice **Revision history** on the right top section of the screen. Click on **Revision history** to bring up the version history side panel.![](https://cdn-images-1.medium.com/freeze/max/32/1\*m\_JRtRpgOh9BV0lrGM6g7g.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*m\_JRtRpgOh9BV0lrGM6g7g.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*m\_JRtRpgOh9BV0lrGM6g7g.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*rAHwGGQt2euoxiLVjzIIEA.png?q=20)![](https://cdn-images-1.medium.com/max/636/1\*rAHwGGQt2euoxiLVjzIIEA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/636/1\*rAHwGGQt2euoxiLVjzIIEA.png">3–1 Version history side panel.

3–2. Click on Git: **Not Linked** to update _**Git Preferences**_. Link your workbook to _Azure DevOps Repo_, which should be the URL of your git repository, and set the **Path in Git Repo** to the location which you want Databricks to save your notebook inside the repository.![](https://cdn-images-1.medium.com/freeze/max/32/1\*iV1bzHAgazP5\_eghg2FxFg.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*iV1bzHAgazP5\_eghg2FxFg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*iV1bzHAgazP5\_eghg2FxFg.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*mMkRNcxNZfzyKH0cNDi0QA.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*mMkRNcxNZfzyKH0cNDi0QA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*mMkRNcxNZfzyKH0cNDi0QA.png">![](https://cdn-images-1.medium.com/freeze/max/32/1\*ZblfmrUMLrcTwJkNoILqtQ.png?q=20)![](https://cdn-images-1.medium.com/max/424/1\*ZblfmrUMLrcTwJkNoILqtQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/424/1\*ZblfmrUMLrcTwJkNoILqtQ.png">3–2 Link workbook with repository![](https://cdn-images-1.medium.com/freeze/max/32/1\*EHTgHNvwNZijQ4ZuiCiG3Q.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*EHTgHNvwNZijQ4ZuiCiG3Q.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*EHTgHNvwNZijQ4ZuiCiG3Q.png">3–2 Committed change pushed into git repo.

3–3. The committed change is pushed into git repository. What does that mean? That means it will trigger the build pipeline. With a little bit of further configuration, we can actually update the build pipeline to package this notebook into a deployable package, and use it to trigger a deployment pipeline. Now download the _**azure-pipelines.yml**_ from [this commit](https://dev.azure.com/bedatse/azure-dataops/\_git/databricks-example?version=GC0a69292c7cbe20ccbab55d9b7d8becdfec423213), replace the original _**azure-pipelines.yml**_ from step 1–1, commit and push the change back to the repository.![](https://cdn-images-1.medium.com/freeze/max/32/1\*\_np4uBAIXVyDkdfwXdr-bA.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*\_np4uBAIXVyDkdfwXdr-bA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*\_np4uBAIXVyDkdfwXdr-bA.png">3–3 Build triggered by the pipeline update.

#### Step 4: Deploy the version controlled Notebook onto Databricks for automated tests <a href="#22f9" id="22f9"></a>

Since we have prepared our notebook build package, let us complete the flow by deploying it onto the Databricks that we have created and execute a run from the pipeline.

4–1. Go to **Pipelines** > **Library**, edit the project based Variable group _**Databricks Pipeline**_, we need to specify a variable here such that the release pipeline will pickup from the variable which notebook to deploy. Add `notebook_name` variable with value `helloworld` . Click **Save** after it is done.![](https://cdn-images-1.medium.com/freeze/max/32/1\*WbawJspxIvStyxESvY0\_zQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*WbawJspxIvStyxESvY0\_zQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*WbawJspxIvStyxESvY0\_zQ.png">4–1 Update Variable group with notebook\_name variable

4–2. Go to **Pipelines** > **Releases**, select _**Databricks Release Pipeline**_, Click **Edit**. Navigate to the _**Tasks**_ tab. Add _**Use Python Version**_ task and drag it above the original _**Create Databricks Resource Group**_ task. No further configuration is needed.’

4–3. Add Bash Task at the end of the job. Rename it to _Install Tools_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. This is to install the needed python tools for deploying notebook onto Databricks via command line interface.

```
python -m pip install --upgrade pip setuptools wheel databricks-cli
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*ZS0UTa024IdyVWWixnRQEQ.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*ZS0UTa024IdyVWWixnRQEQ.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*ZS0UTa024IdyVWWixnRQEQ.png">4–3 Configure Install Tools Task

4–4. Add Bash Task at the end of the job. Rename it to _Authenticate with Databricks CLI_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. The variable `databricks_location` is obtained from variable group defined inside the pipeline, while `databricks-token` is obtained from variable group linked with Azure Key Vault.

```
databricks configure --token <<EOF
https://$(databricks_location).azuredatabricks.net
$(databricks-token)
EOF
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*RhlsQdVDMR94YEls8l50SA.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*RhlsQdVDMR94YEls8l50SA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*RhlsQdVDMR94YEls8l50SA.png">4–4 Configure CLI Authentication Task

4–5. Add Bash Task at the end of the job. Rename it to _Upload Notebook to Databricks_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. The variable `notebook_name` is retrieved from the release scoped variable group.

```
databricks workspace mkdirs /build
databricks workspace import --language PYTHON --format SOURCE --overwrite _databricks-example/notebook/$(notebook_name)-$(Build.SourceVersion).py /build/$(notebook_name)-$(Build.SourceVersion).py
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*gXnohfF2DsIwH\_JH2wM9dg.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*gXnohfF2DsIwH\_JH2wM9dg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*gXnohfF2DsIwH\_JH2wM9dg.png">4–5 Configure Upload Notebook Task

4–6. Add Bash Task at the end of the job. Rename it to _Create Notebook Run JSON_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. This is to prepare a job execution configuration for the test run, using the template `notebook-run.json.tmpl`.

```
# Replace run name and deployment notebook path
cat _databricks-example/notebook/notebook-run.json.tmpl | jq '.run_name = "Test Run - $(Build.SourceVersion)" | .notebook_task.notebook_path = "/build/$(notebook_name)-$(Build.SourceVersion).py"' > $(notebook_name)-$(Build.SourceVersion).run.json
```

```
# Check the Content of the generated execution file
cat $(notebook_name)-$(Build.SourceVersion).run.json
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*6zt6DzGiatheO8K5a6jw8A.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*6zt6DzGiatheO8K5a6jw8A.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*6zt6DzGiatheO8K5a6jw8A.png">4–6 Configure Notebook Run JSON Creation task

4–7. Add Bash Task at the end of the job. Rename it to _Run Notebook on Databricks_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. This is to execute the notebook prepared in the Build pipeline, i.e. committed by you thru the Databricks UI, via Job Cluster.

```
echo "##vso[task.setvariable variable=RunId; isOutput=true;]`databricks runs submit --json-file $(notebook_name)-$(Build.SourceVersion).run.json | jq -r .run_id`"
```

You might have noticed there is weird template here with `##vso[task.setvariable variable=RunId; isOutput=true;]` . This is to save the `run_id` from the output of the `databricks runs submit` command into Azure DevOps as variable `RunId` , such that we can reuse that run id in next steps.![](https://cdn-images-1.medium.com/freeze/max/32/1\*P8PIgHwrDMtFXy43T5QUrw.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*P8PIgHwrDMtFXy43T5QUrw.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*P8PIgHwrDMtFXy43T5QUrw.png">4–7 Configure Notebook Execution Task

4–8. Add Bash Task at the end of the job. Rename it to _Wait for Databricks Run to complete_. Select _**Type**_ as **Inline**, copy the following scripts to the _**Script**_ text area. This is to wait for the previously executing Databricks job and get the execution state from the run result.

```
echo "Run Id: $(RunId)"
```

```
# Wait until job run finish
while [ "`databricks runs get --run-id $(RunId) | jq -r '.state.life_cycle_state'`" != "INTERNAL_ERROR" ] && [ "`databricks runs get --run-id $(RunId) | jq -r '.state.result_state'`" == "null" ]
do 
echo "Waiting for Databrick job run $(RunId) to complete, sleep for 30 seconds"
sleep 30
done
```

```
# Print Run Results
databricks runs get --run-id $(RunId)
```

```
# If not success, report failure to Azure DevOps
if [ "`databricks runs get --run-id $(RunId) | jq -r '.state.result_state'`" != "SUCCESS" ]
then
echo "##vso[task.complete result=Failed;]Failed"
fi
```

![](https://cdn-images-1.medium.com/freeze/max/32/1\*0PEgoaNpTzSaSQcLPfaReA.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*0PEgoaNpTzSaSQcLPfaReA.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*0PEgoaNpTzSaSQcLPfaReA.png">4–8 Configure Databricks Run task

4–9. Remember we have added Databricks token from Azure Key vault? It is now to put it in use. Access the **Variables** Tab, click _**Variable groups**_, Link the variable group _**Databricks Dev Token**_ with _**Dev Environment**_ Stage.![](https://cdn-images-1.medium.com/freeze/max/32/1\*2sQeJZjqBzbPe816z28lVg.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*2sQeJZjqBzbPe816z28lVg.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*2sQeJZjqBzbPe816z28lVg.png">4–9 Link the Token variable group with Environment

4–10. **Save** the Release Pipeline, and _**create a release**_ to test the new pipeline.![](https://cdn-images-1.medium.com/freeze/max/32/1\*toVZxLj0vl6otr3gVBdz9A.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*toVZxLj0vl6otr3gVBdz9A.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*toVZxLj0vl6otr3gVBdz9A.png">4–10 Deployment and execution result

Tada! Now your notebook is being deployed back to your Development environment, and successfully executed via a Job cluster!

Why do we want to do that? It is because you would like to test if the notebook can be executed on a cluster other than the interactive cluster you have been developing your notebook, ensuring your notebook is portable.

#### Let’s recap what we have done <a href="#1523" id="1523"></a>

![](https://cdn-images-1.medium.com/freeze/max/32/1\*jkCJY4Y\_rBPa4t3ZZt7M8g.png?q=20)![](https://cdn-images-1.medium.com/max/1272/1\*jkCJY4Y\_rBPa4t3ZZt7M8g.png)\<img class="progressiveMedia-noscript js-progressiveMedia-inner" src="https://cdn-images-1.medium.com/max/1272/1\*jkCJY4Y\_rBPa4t3ZZt7M8g.png">

1. We have set up Databricks and Azure Key Vault provisioning via Azure Resource Manager Template.
2. We have set up Git integration with Databricks.
3. We have set up preliminary build steps and publish notebook as build artifacts.
4. We have been using Azure Key Vault for securely managing deployment credentials.
5. We have set up automated deployment and job execution flow with Databricks, which the job execution can be served as a very simple deployment test.

#### Edit on 3 March 2019 <a href="#eb25" id="eb25"></a>

We have found that the key vault cannot be created automatically with the current ARM template, this tutorial will be updated in future. For now, please manually create the key vault for the first time in the resource group.
