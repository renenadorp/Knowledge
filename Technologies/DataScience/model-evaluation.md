---
description: This page describes techniques for model evaluation
---

# Model Evaluation

## Metrics

The main metrics used for model evaluation are:&#x20;

* Accuracy
* Precision
* Recall
* F1-score

All of these metrics are available in the sklearn.metrics package. All these score functions take as input parameters: y\_actual and y\_predicted

```python
from sklearn.metrics import accuracy_score, precision_score, f1_score, recall_score
accuracy = accuracy_score(y_actual, y_predicted)
precision = precision_score(y_actual, y_predicted)
recall = recall_score(y_actual, y_predicted)

```

Alternatively, these scores can be calculated using the sklearn.classification\_report function:

```python
from sklearn.metrics import classification_report
classification_report(y_act, y_pred)
```

```

              precision    recall  f1-score   support

           0       0.78      0.92      0.84        50
           1       0.90      0.74      0.81        50

   micro avg       0.83      0.83      0.83       100
   macro avg       0.84      0.83      0.83       100
weighted avg       0.84      0.83      0.83       100
```

### Example Confusion Matrix

For illustration purposes, consider the confusion matrix below, showing false/true positives and negatives.

|                    | Predicted Positive | Predicted Negative | Total |
| ------------------ | -----------------: | -----------------: | ----: |
| Condition Positive |             TP: 50 |             FN: 10 |    60 |
| Condition Negative |             FP: 30 |             TN: 70 |   100 |
| Total              |                 80 |                 80 |   160 |

In rows the true classes are shown. In columns the predicted classes. The first cell (true class = A, predicted class = A) shows the number of true positive predicted classes.&#x20;

### Accuracy

Overall accuracy of a classification model.

$$
(TP+TN) / Total
$$

Based on the example confusion matrix above: 50 / 160

### Precision

Number of accurately predicted positives (TP) divided by actual number of predicted positives

$$
TP / Predicted Positive
$$

Based on the example confusion matrix above: 50 / 80 = 0.625

### Recall

Number of accurately predicted positives (TP) divided by actual positives

$$
TP / Condition Positive
$$

Based on the example confusion matrix above: 50 / 60 = 0.8333

### F1-score

Combined score of Recall and Precision.

$$
2*p*r / (p+r)
$$

Based on the example confusion matrix above: 2\*(0.625\*0.8333) / (0.625 + 0.8333) = 0.71&#x20;

### Multi class Confusion Matrix

A confusion matrix can also be created for multi class classifiers.

|         | Pred A | Pred B | Pred C | Pred D |
| ------- | ------ | ------ | ------ | ------ |
| Class A | 75     |        |        |        |
| Class B |        | 84     | 7      |        |
| Class C | 2      |        | 89     |        |
| Class D |        |        |        | 31     |

