# Trouble Shooting

## Git pull --reset
```bash
The following untracked working tree files would be overwritten by checkout:        README.md
Please move or remove them before you switch branches.
Aborting | git fetch --all git rest --hard 
```
_Cause_
Remote and local branch are out of synch regarding commits.

_Resolution_
```bash
git fetch --all
git rest --hard origin/<branch-name>