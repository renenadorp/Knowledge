---
description: Tips about Git
---

# Git

## Git Flow

GitFlow is a best practice for using git, developed by [Vincent Driessen](https://nvie.com/about/). Please refer to his webpage for detailed information: [https://nvie.com/posts/a-successful-git-branching-model/](https://nvie.com/posts/a-successful-git-branching-model/).

![gitflow](../.gitbook/assets/gitflow.png)

The basic idea of gitflow is to have developers doing their work in feature-branches, and then merging their work with the development branch once they submit a pull-request. Continuous integration runs on the deverlopment branch. Once development is completed a release is created in the release branch. The release branch is used to make a selection of features to be promoted to production and to test before release. Finally a release is merged with the master branch and then deployed to production.

## Git Commands

| Command                 | Description                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------- |
| git pull                |                                                                                       |
| git add .               | Add objects to the repository to be tracked. The dot indicates the current directory. |
| git commit -m "message" | Commit changed objects to the local repository                                        |
| git push                | Push committed changes to a remote repository                                         |
| git push heroku master  | Push committed changes to the remote respository "heroku" in the master branch        |
|                         |                                                                                       |
