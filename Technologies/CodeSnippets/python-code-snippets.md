---
description: Code snippets for deep learning with Python.
---

# Python Code Snippets

## Deep Learning Code Snippets

### Model Reset

```
params = model.get_weights()
params = [np.zeros(w.shape) for w in params]
model.set_weights(params)
```

### Model Fit

```python
model.fit(x_train, y_train, epochs=20, verbose=0)
```

## IO Code Snippets

## Pandas

### Shifting data

```python
#Shift data by 1 period
PG['simple_return'] = (PG['close'] / PG['close'].shift(1)) - 1
```
