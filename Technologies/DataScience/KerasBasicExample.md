

```python
from keras.models import Sequential
from keras.layers import Dense
from keras.optimizers import SGD, Adam
```

    Using TensorFlow backend.



```python
model = Sequential()
```


```python
model.add(Dense(1, input_shape=(1,)))
```


```python
model.summary()
```

    _________________________________________________________________
    Layer (type)                 Output Shape              Param #   
    =================================================================
    dense_1 (Dense)              (None, 1)                 2         
    =================================================================
    Total params: 2
    Trainable params: 2
    Non-trainable params: 0
    _________________________________________________________________

