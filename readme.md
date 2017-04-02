# Learning Python

## Install & Manage multi-version
- install `pyenv` with `homebrew`
- show version can install: `$ pyenv install --list`
- install a version: `$ pyenv install 3.6.1`
- show all installed version: `$ pyenv versions`
- change local path python version: `$ pyenv local 3.6.1`

## Use Virtual Environment
create virtual environment with `pyenv` plugin `virtualenv`, it can install with `homebrew`.
- create new virtualenv: `$ pyenv virtualenv 3.6.1 playground`
- show all virtualenv: `$ pyenv virtualenvs`
- activate a virtualenv: `$ pyenv activate playground`
- deactivate current env: `$ pyenv deactivate`
- remove a virtualenv: `$ rm -rf ~/.pyenv/versions/playground`
