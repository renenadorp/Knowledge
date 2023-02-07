# Data Preprocessing

## Exploration

### Summary Statistics

A quick way to explore the properties of the features of a dataset is the Pandas describe() function. This will give you summary statistics of all the features in the dataset.

```python
import pandas as pd
df = pd.read_csv(..)
df.describe()
```

![Example output for Pandas describe()](<../.gitbook/assets/image (19).png>)

### Pairplot

```python
import seaborn as sns
import pandas as pd
df = pd.read_csv(...)
sns.pairplot(df, hue='Outcome')
```

### Histogram

A fast way to produce a histogram for all features in a dataset in a single figure is the Pandas hist() function.

```python
import pandas as pd
_ = df.hist(figsize=(15,10))
```

### Correlation Heatmap

To quickly explore correlation between features in the dataset, you can use the Pandas corr() function in combination with a seaborn heatmap visualization.&#x20;

```python
import pandas as pd
import seaborn as sns
df = pd.read_csv(...)
sns.heatmap(df.corr(), annot=True)
```

![](<../.gitbook/assets/image (36).png>)

## Vectorization

Vectorization is the process to convert input data into vectors / tensors.&#x20;

### One Hot Encoding

Custom function for one-hot-encoding

```python
def to_one_hot(labels, dimension=46):
results = np.zeros((len(labels), dimension))
for i, label in enumerate(labels):
results[i, label] = 1.
return results
one_hot_train_labels = to_one_hot(train_labels)
one_hot_test_labels = to_one_hot(test_labels)
```

One-hot-encoding using keras&#x20;

```python
from keras.utils.np_utils import to_categorical
one_hot_train_labels = to_categorical(train_labels)
one_hot_test_labels = to_categorical(test_labels)
```

## Rescaling

| Package               | Name           | Scale             |
| --------------------- | -------------- | ----------------- |
| sklearn.preprocessing | MinMaxScaler   | 0 .. 1            |
| sklearn.preprocessing | StandardScaler | mean = 0, std = 1 |

### MinMax Scaler

```python
#MinMax Scaler
from sklearn.preprocessing import MinMaxScaler
mms = MinMaxScaler()
df['Weight_mms'] = mms.fit_transform(df[['Weight']])
df['Height_mms'] = mms.fit_transform(df[['Height']])
```

### Standard Scaler

```python
#Standard Scaler
from sklearn.preprocessing import StandardScaler
ss = StandardScaler()
df['Weight_ss'] = ss.fit_transform(df[['Weight']])
df['Height_ss'] = ss.fit_transform(df[['Height']])
```
