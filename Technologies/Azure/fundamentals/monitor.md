# Monitor

Azure provides two primary services to monitor the health of your apps and resources.

1. Azure Monitor
2. Azure Service Health



## Azure Monitor

![Icon representing Azure Monitor](https://docs.microsoft.com/en-us/learn/modules/intro-to-governance/media/7-azuremonitor.png)

**Azure Monitor** maximizes the availability and performance of your applications by delivering a comprehensive solution for collecting, analyzing, and acting on telemetry from your cloud and on-premises environments. It helps you understand how your applications are performing and proactively identifies issues affecting them and the resources they depend on.

#### Data sources <a href="#data-sources" id="data-sources"></a>

Azure Monitor can collect data from a variety of sources. You can think of monitoring data for your applications in tiers ranging from your application, any operating system and services it relies on, down to the platform itself.

| Data tier                          | Description                                                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Application monitoring data        | Data about the performance and functionality of the code you have written, regardless of its platform.                               |
| Guest OS monitoring data           | Data about the operating system on which your application is running. This could be running in Azure, another cloud, or on-premises. |
| Azure resource monitoring data     | Data about the operation of an Azure resource.                                                                                       |
| Azure subscription monitoring data | Data about the operation and management of an Azure subscription, as well as data about the health and operation of Azure itself.    |
| Azure tenant monitoring data       | Data about the operation of tenant-level Azure services, such as Azure Active Directory.                                             |

#### Diagnostic settings <a href="#diagnostic-settings" id="diagnostic-settings"></a>

As soon as you create an Azure subscription and start adding resources such as virtual machines and web apps, Azure Monitor starts collecting data. _**Activity Logs**_ record when resources are created or modified and _**Metrics**_** ** tell you how the resource is performing and the resources that it's consuming.

You can extend the data you're collecting into the actual operation of the resources by enabling **diagnostics** and adding an agent to compute resources. Under the resource settings you can enable Diagnostics

* _Enable guest-level monitoring_
* _Performance counters_: collect performance data
* _Event Logs_: enable various event logs
* _Crash Dumps_: enable or disable
* _Sinks_: send your diagnostic data to other services for more analysis
* _Agent_: configure agent settings

### Azure Monitor Tools

**Application Insights** is a service that monitors the availability, performance, and usage of your web applications, whether they're hosted in the cloud or on-premises. It leverages the powerful data analysis platform in Log Analytics to provide you with deeper insights into your application's operations. Application Insights can diagnose errors, without waiting for a user to report them. Application Insights includes connection points to a variety of development tools, and integrates with Microsoft Visual Studio to support your DevOps processes.

**Azure Monitor for containers** is a service that is designed to monitor the performance of container workloads, which are deployed to managed Kubernetes clusters hosted on Azure Kubernetes Service (AKS). It gives you performance visibility by collecting memory and processor metrics from controllers, nodes, and containers, which are available in Kubernetes through the metrics API. Container logs are also collected.

**Azure Monitor for VMs** is a service that monitors your Azure VMs at scale, by analyzing the performance and health of your Windows and Linux VMs (including their different processes and interconnected dependencies on other resources, and external processes). Azure Monitor for VMs includes support for monitoring performance and application dependencies for VMs hosted on-premises, and for VMs hosted with other cloud providers.\


## Azure Service Health

![Icon representing Azure Monitor](https://docs.microsoft.com/en-us/learn/modules/intro-to-governance/media/7-azureservicehealth.png)

**Azure Service Health** is a suite of experiences that provide personalized guidance and support when issues with Azure services affect you. It can notify you, help you understand the impact of issues, and keep you updated as the issue is resolved. Azure Service Health can also help you prepare for planned maintenance and changes that could affect the availability of your resources.

Azure Service Health is composed of the following views.

**Azure Status** provides a global view of the health state of Azure services. With Azure Status, you can get up-to-the-minute information on service availability. Everyone has access to Azure Status and can view all services that report their health state.

**Service Health** provides you with a customizable dashboard that tracks the state of your Azure services in the regions where you use them. In this dashboard, you can track active events such as ongoing service issues, upcoming planned maintenance, or relevant _Health advisories_. When events become inactive, they are placed in your _Health history_ for up to 90 days. Finally, you can use the **Service Health** dashboard to create and manage service _Health alerts_, which notify you whenever there are service issues that affect you.

**Resource Health** helps you diagnose and obtain support when an Azure service issue affects your resources. It provides you details with about the current and past state of your resources. It also provides technical support to help you mitigate problems. In contrast to Azure Status, which informs you about service problems that affect a broad set of Azure customers, _Resource Health_ gives you a personalized dashboard of your resources' health. _Resource Health_ shows you times, in the past, when your resources were unavailable because of Azure service problems. It's then easier for you to understand if an SLA was violated.\
