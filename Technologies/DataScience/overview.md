---
description: Overview / Quick Ref of Deep Learning Techniques
---

# Overview

## Terminology Graph

![](<../.gitbook/assets/image (14).png>)

## Fully Connected Architecture

The diagram below shows the general architecture of a deep learning model.

![](<../.gitbook/assets/image (34).png>)

The input consists of a matrix PxN, with P rows, representing the observations, and N columns, representing the features of those observations

The first step is to assign weights to the features for each row. This results in an NxM matrix for each row, with N features and W weights. Every node in the output layer is connected to every input node.&#x20;

In addition to the calculation of the weights, a bias is calculated for each column. This results in a vector B with values for each column.

The last calculation that is done within each layer is the non-linear transformation (in this case the sigmoid). This results in the output of the layer, which is a PxM matrix, with M nodes from the first layer, and P data points (rows).

This process is repeated for each layer, as many times as we want.

The number of nodes in the last layer is equal to the number of values that need to be predicted. For a regression problem, this will be a value based on the input from the previous layer. For a binary classification, a calculation is added to the output of the previous layer in order to get a value between 0 and 1. This is usually done with a sigmoid function.



