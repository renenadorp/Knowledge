# Optimizer Functions

## Definition

Optimizer functions are functions used in deep learning models to adjust weights in the layers in order to minimize the loss.

## Common Optimizer Functions

| Name                        | Description |
| --------------------------- | ----------- |
| Stochastic Gradient Descent |             |

## Stochastic Gradient Descent

```python
# from https://ml-cheatsheet.readthedocs.io/en/latest/optimizers.html#sgd
def SGD(data, batch_size, lr):
    N = len(data)
    np.random.shuffle(data)
    mini_batches = np.array([data[i:i+batch_size]
     for i in range(0, N, batch_size)])
    for X,y in mini_batches:
        backprop(X, y, lr)
```

