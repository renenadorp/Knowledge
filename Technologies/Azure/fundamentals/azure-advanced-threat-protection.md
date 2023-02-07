# Azure Advanced Threat Protection

**Azure Advanced Threat Protection** (Azure ATP) is a cloud-based security solution that identifies, detects, and helps you investigate advanced threats, compromised identities, and malicious insider actions directed at your organization.

Azure ATP is capable of detecting known malicious attacks and techniques, security issues, and risks against your network.

### Azure ATP components <a href="#azure-atp-components" id="azure-atp-components"></a>

Azure ATP consists of several components.

**Azure ATP portal**

Azure ATP has its own portal, through which you can monitor and respond to suspicious activity. The Azure ATP portal allows you to create your Azure ATP instance, and view the data received from Azure ATP sensors. You can also use the portal to monitor, manage, and investigate threats in your network environment. You can sign in to the Azure ATP portal at [https://portal.atp.azure.com](https://portal.atp.azure.com/). You must sign in with a user account that is assigned to an Azure AD security group that has access to the Azure ATP portal.

**Azure ATP sensor**

Azure ATP sensors are installed directly on your domain controllers. The sensor monitors domain controller traffic without requiring a dedicated server or configuring port mirroring.

**Azure ATP cloud service**

Azure ATP cloud service runs on Azure infrastructure and is currently deployed in the United States, Europe, and Asia. Azure ATP cloud service is connected to Microsoft's intelligent security graph.

![Screenshot of Azure Advanced Threat Protection dashboard and event timeline, showing security events such as HoneyToken activity, remote execution attempt detected, and suspicious service created](https://docs.microsoft.com/en-us/learn/modules/intro-to-security-in-azure/media/7-atp-sa-timeline.png)
