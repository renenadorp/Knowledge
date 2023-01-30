---
description: Information about Logistic Regression
---

# Logistic Regression

## Definition

Logistic Regression is a classification technique using a logistic function for prediction, usually a sigmoid-function (see [activation-functions](https://rene-nadorp.gitbook.io/developertips/\~/edit/drafts/-LVceQwzIO\_-bEOycjG4/deep-learning/activation-functions)).

The general form of a logistic regression function is&#x20;

$$
ŷ = f(wX + b)
$$

Where f = sigmoid function.

## Cost Function for Logistic Regression

For logistic regression usually the _cross\_entropy_ is used as a cost-function

$$
c_i=-(1-y_i)log(1-ŷ_i)-y_ilog(ŷ_i)
$$

##
