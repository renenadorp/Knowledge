# Costing

## Customer Types

* **Enterprise** - Enterprise customers sign an Enterprise Agreement with Azure that commits them to spend a negotiated amount on Azure services, which they typically pay annually. Enterprise customers also have access to customized Azure pricing.
* **Web direct** - Direct Web customers pay general public prices for Azure resources, and their monthly billing and payments occur through the Azure website.
* **Cloud Solution Provider** - Cloud Solution Provider (CSP) typically are Microsoft partner companies that a customer hires to build solutions on top of Azure. Payment and billing for Azure usage occur through the customer's CSP.

## Usage meters

When you provision an Azure resource, Azure creates one or more meter instances for that resource. The meters track the resources' usage, and generate a usage record that is used to calculate your bill. Each meter tracks a _particular kind of usage_. For example, a meter might track bandwidth usage (ingress or egress network traffic in bits-per-second), the number of operations, size (storage capacity in bytes), or similar items.\


## Factors Affecting Cost

* Resource Type
* Services
* Location
*   Billing Zones

    Bandwidth refers to data moving in and out of Azure datacenters. Most of the time inbound data transfers (data going _into_ Azure datacenters) are free. For outbound data transfers (data going _out_ of Azure datacenters), the data transfer pricing is based on **Billing Zones**.

## Azure Cost Estimation

[Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).&#x20;

&#x20;[Total Cost of Ownership calculator](https://azure.microsoft.com/pricing/tco/)

## Cost Saving Options

* Azure Hybrid Benefit for Windows Server
* Azure Hybrid Benefit for SQL Server
* Use Dev/Test subscription offers
  * [Enterprise Dev/Test](https://azure.microsoft.com/offers/ms-azr-0148p/) &#x20;
  * [Pay-As-You-Go Dev/Test](https://azure.microsoft.com/offers/ms-azr-0023p/)&#x20;
*   Use SQL Server Developer Edition

    SQL Server Developer Edition is a free product for **nonproduction use**. Developer Edition has all the same features that Enterprise Edition has, but for nonproduction workloads, you can save dramatically on your licensing costs. [documented pricing guidance](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-sql-server-pricing-guidance).
* Use constrained instance sizes for database workloads

## Relevant Links

* [Setting up spending limits in Azure](https://docs.microsoft.com/azure/billing/billing-spending-limit)
* [Azure budgets](https://docs.microsoft.com/azure/billing/billing-cost-management-budget-scenario)
* [Explore flexible purchasing options for Azure](https://azure.microsoft.com/pricing/purchase-options/)
* [Understand terms on your Microsoft Azure invoice](https://docs.microsoft.com/azure/billing/billing-understand-your-invoice)
* [Bandwidth Pricing Details](https://azure.microsoft.com/pricing/details/bandwidth/)

### &#x20;
