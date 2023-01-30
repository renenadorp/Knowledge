---
description: Keras Tips
---

# Keras

## Basic Steps

1. Import packages
2. Load Dataset
3. Define the model
4. Compile the model
5. Fit the model&#x20;
6. Evaluate the model
7. Predict

## Basic Example: Linear Regression

{% file src="../.gitbook/assets/KerasBasicExample.py" %}
Keras Basic Example
{% endfile %}

In this example  a deep learning model is created using Keras. Because the model consists of only one layer, it is effectively a linear regression model.&#x20;

There is only one input value (feature) and one output value (label) in this example.

First a few Keras packages need to be imported.

```python
from keras.models import Sequential
from keras.layers import Dense
from keras.optimizers import SGD, Adam
import pandas as pd
```

Then we load the dataset

```
df = pd.read_csv('../data/weight-height.csv')
x_act = df['Height'].values
y_act = df['Weight'].values
```

Then a model object is instantiated by calling the Sequential class.&#x20;

```
model = Sequential()
model.add(Dense(1, input_shape=(1,)))
```

The model is defined to consist of a Dense layer, with one output unit. Note that in a jupyter notebook additional information can be obtained about any object or function by hitting Shift-Tab key twice:

Next the model is compiled, in this case using MSE as a cost function. After this the model is trained by calling the fit-function.

![](<../.gitbook/assets/image (24).png>)

```
model.summary()
```

The _model.summary()_ command will display information about the model just created. Note that this basic model has 2 parameters: 1 feature value and 1 bias value.

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
```

The next step is to compile the model, which will tell keras to build the model using the chosen backend, in this case TensorFlow. The compile step takes two parameters:&#x20;

* Optimizer: in this case Adam, with a learning rate of 0.5
* Cost Function: in this case MSE

```
model.compile(Adam(lr=0.5), 'mean_squared_error')
```

Then the model is trained by calling the keras _fit_ method.

```
model.fit(x_act,y_act, epochs=20)
```

This will produce output similar to this:

```
Epoch 1/20
10000/10000 [==============================] - 1s 73us/step - loss: 1242.9151
Epoch 2/20
10000/10000 [==============================] - 0s 27us/step - loss: 561.6362
Epoch 3/20
10000/10000 [==============================] - 0s 27us/step - loss: 546.7185
Epoch 4/20
10000/10000 [==============================] - 0s 27us/step - loss: 521.6127
Epoch 5/20
10000/10000 [==============================] - 0s 27us/step - loss: 488.7867
Epoch 6/20
10000/10000 [==============================] - 0s 26us/step - loss: 466.9658
Epoch 7/20
10000/10000 [==============================] - 0s 28us/step - loss: 428.1853
Epoch 8/20
10000/10000 [==============================] - 0s 26us/step - loss: 406.1171
Epoch 9/20
10000/10000 [==============================] - 0s 26us/step - loss: 364.9266
Epoch 10/20
10000/10000 [==============================] - 0s 28us/step - loss: 349.1375
Epoch 11/20
10000/10000 [==============================] - 0s 26us/step - loss: 320.8907
Epoch 12/20
10000/10000 [==============================] - 0s 27us/step - loss: 309.3795
Epoch 13/20
10000/10000 [==============================] - 0s 27us/step - loss: 279.5250
Epoch 14/20
10000/10000 [==============================] - 0s 28us/step - loss: 267.4921
Epoch 15/20
10000/10000 [==============================] - 0s 28us/step - loss: 256.5498
Epoch 16/20
10000/10000 [==============================] - 0s 27us/step - loss: 238.8909
Epoch 17/20
10000/10000 [==============================] - 0s 28us/step - loss: 222.6736
Epoch 18/20
10000/10000 [==============================] - 0s 26us/step - loss: 218.4207
Epoch 19/20
10000/10000 [==============================] - 0s 25us/step - loss: 203.9496
Epoch 20/20
10000/10000 [==============================] - 0s 27us/step - loss: 211.0487
```

Notice that in each epoch the loss decreases, which is what we expect.

Once the model is created and trained, it can be used to make predictions:

```
y_pred = model.predict(x_act)
```

