---
description: Information about python
---

# Python

## virtualenv

Most developers use a virtualenv for their projects, in order to sandbox requirements, packages and dependencies. Below an example of creating and using such a virtual environment

```bash
$ virtualenv -p /usr/bin/python3.5 databrickscli
```

The command above will create a virtual environment call "databrickscli" using python version 3.5. Expected output:

```
Running virtualenv with interpreter /usr/bin/python3.5
Using base prefix '/usr'
New python executable in /home/<>/databrickscli/bin/python3.5
Also creating executable in /home/<>/databrickscli/bin/python
Installing setuptools, pip, wheel...
done.
```

To activate the environment, use the following command:

```
$ source /databrickscli/bin/activate
```

The command prompt will change, and look like this:

```
(databrickscli) rene:$ 
```

