
# coding: utf-8

# In[10]:


from keras.models import Sequential
from keras.layers import Dense
from keras.optimizers import SGD, Adam
import pandas as pd


# In[11]:


df = pd.read_csv('../data/weight-height.csv')


# In[12]:


x_act = df['Height'].values
y_act = df['Weight'].values


# In[2]:


model = Sequential()


# In[4]:


model.add(Dense(1, input_shape=(1,)))


# In[5]:


model.summary()


# In[8]:


model.compile(Adam(lr=0.5), 'mean_squared_error')


# In[13]:


model.fit(x_act,y_act, epochs=20)


# In[14]:


y_pred = model.predict(x_act)


# In[15]:


y_pred

