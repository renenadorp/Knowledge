# Loss Functions

## Definition

Cost Functions are functions that give an overall score for the difference between predicted values and actual values of a given dataset.

## Mean Squared Error (MSE)

Total of (actual - predicted)^2 divided by the number of observations. Formula:

$$
\sum_{i=1}^{N}(y_i-ŷ_i)^2* \frac{1}{N}
$$

## Categorical Cross Entropy

Always used in tandem with the Softmax activation function. It measures the distance between two probability distributions: eg, between the probability distribution output by the network and the true distribution of the labels. By minimizing the distance between these two distributions, you train the network to output something as close as possible to the true labels.

