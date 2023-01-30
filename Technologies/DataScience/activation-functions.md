# Activation Functions

## Definition

In neural networks, the activation function of a node defines the output of that node, or "neuron," given an input or set of inputs. This output is then used as input for the next node and so on until a desired solution to the original problem is found ([https://en.wikipedia.org/wiki/Activation\_function](https://en.wikipedia.org/wiki/Activation\_function))

## Purpose

The purpose of activation functions is to make neural networks non-linear. They are used in between the layers, where values from one layer serve as input, and the activation function as the output values in the next layer.

## Overview

The image below illustrates where activation functions are used in a neural network.&#x20;

![](<../.gitbook/assets/image (8).png>)

## Most common activation functions

| Name     | Range    | Comments                                                                                                                                                                                       | Mutually Exclusive  |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| Sigmoid  | 0 .. 1   |                                                                                                                                                                                                | N                   |
| Step     | 0 \|\| 1 | Perceptron                                                                                                                                                                                     | N                   |
| Tanh     | -1 .. 1  |                                                                                                                                                                                                | N                   |
| Relu     | 0 .. x   | Most popular in NN                                                                                                                                                                             | N                   |
| Softplus | 0 .. x   |                                                                                                                                                                                                | N                   |
| Softmax  |          | Applied in last layer for mutually exclusively classes with multiple outputs. The network will output a probability distribution over the output classes. The sum of these probabilities is 1. | Y                   |

## Jupyter Notebook \[Python]

The notebook below illustrates different activations functions .

```
%matplotlib inline
```

```python

#import section
from matplotlib import pylab
import pylab as plt
import numpy as np

#sigmoid = lambda x: 1 / (1 + np.exp(-x))
def sigmoid(x):
    return (1 / (1 + np.exp(-x)))

def step(x):
    return x > 1

def tanh(x):
    return np.tanh(x)
    
def relu(x):
    return x * (x>0)

def softplus(x):
    return np.log1p(np.exp(x))
    
mySamples = []
mySigmoid = []

# generate an Array with value ???
# linespace generate an array from start and stop value
# with requested number of elements. Example 10 elements or 100 elements.
# 
x = plt.linspace(-10,10,10)
y = plt.linspace(-10,10,100)

# prepare the plot, associate the color r(ed) or b(lue) and the label 
# please select the relevant activation function to be used in the plot method.
#plt.plot(x, sigmoid(x), 'r', label='linspace(-10,10,10)')
plt.figure(figsize=(10,10))
plt.plot(y, sigmoid(y), 'r', label='linspace(-10,10,100)')

# Draw the grid line in background.
plt.grid()

# Title & Subtitle
plt.title('Sigmoid Function')
#plt.suptitle('Sigmoid')

# place the legen boc in bottom right of the graph
plt.legend(loc='lower right')

# write the Sigmoid formula
plt.text(4, 0.8, r'$\sigma(x)=\frac{1}{1+e^{-x}}$', fontsize=15)

#resize the X and Y axes
plt.gca().xaxis.set_major_locator(plt.MultipleLocator(10))
plt.gca().yaxis.set_major_locator(plt.MultipleLocator(1))
 
# plt.plot(x)
plt.xlabel('X Axis')
plt.ylabel('Y Axis')


# create the graph
plt.show()
```

{% file src="../.gitbook/assets/ActivationFunctions.ipynb" %}
Jupyter Notebook - Activation Functions
{% endfile %}

## Sigmoid Function

The sigmoid function will transform any numeric input to a value between 0 and 1.&#x20;

```python
```

![Sigmoid](<../.gitbook/assets/image (4).png>)

## Step Function

The step function will transform any numeric input value to either 0 or 1. The difference with the sigmoid function is that the returned value is always 1 or 0, never a value in between.

```python
def step(x):
    return x > 1
```

![Step Function](<../.gitbook/assets/image (29).png>)

## Tanh Function

The tanh activation function will transform any numeric value to an output value between -1 and 1

```python
def tanh(x):
    return np.tanh(x)
```

![Tanh function](<../.gitbook/assets/image (15).png>)

## Relu Function

The relu (_rectified linear unit_) function will transform any numeric input value to an output value between 0 and x (the input value).

```python
def relu(x):
    return x * (x>0)
```

![Relu function](<../.gitbook/assets/image (31).png>)

## Softplus

The softplus function will transform any numeric input value to an output value between 0 and x

```python
def softplus(x):
    return np.log1p(np.exp(x))
```

![Softplus function](<../.gitbook/assets/image (7).png>)

## Softmax

The softplus function will transform any numeric input value to an output value between \<TODO>. The sum of the probabilities of all output classes always adds up to one, which is why this activation function is used for multiclass mutually exclusive classification problems.

The formula for softmax is as follows:

![](<../.gitbook/assets/image (22).png>)
