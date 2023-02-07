# Resource Groups

### What are resource groups? <a href="#what-are-resource-groups" id="what-are-resource-groups"></a>

Resource groups are a fundamental element of the Azure platform. A resource group is a logical container for resources deployed on Azure. These resources are anything you create in an Azure subscription like virtual machines, Application Gateways, and CosmosDB instances. All resources must be in a resource group and a resource can only be a member of a single resource group.

## Tags

### What are tags? <a href="#what-are-tags" id="what-are-tags"></a>

Tags are name/value pairs of text data that you can apply to resources and resource groups. Tags allow you to associate custom details about your resource, in addition to the standard Azure properties a resource has:

* department (like finance, marketing, and more)
* environment (prod, test, dev),
* cost center
* life cycle and automation (like shutdown and startup of virtual machines).

A resource can have up to 15 tags. The name is limited to 512 characters for all types of resources except storage accounts, which have a limit of 128 characters. The tag value is limited to 256 characters for all types of resources. Tags aren't inherited from parent resources. Not all resource types support tags, and tags can't be applied to classic resources.\
