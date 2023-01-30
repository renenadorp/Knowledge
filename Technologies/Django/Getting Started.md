# Django Structure
A Django web application consists of:
- A Project 
- One or more apps

# Create a project
Create a django project with the following command, from within the project directory
```
django-admin startproject portfolio .
```
The dot at the end avoids creation of additional folders.

# Create an app
``` django-admin start app projects```

# Register the app
Edit the file ``` portfolio/settings.py```. [Note that "portfolio" is the name of the project in this example]
Add the newly created app in the list of installed apps:
```
# Application definition

INSTALLED_APPS = [

'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
''
]
```