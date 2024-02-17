# Backend API

All commands and folders referenced in this README are relative to the `backend-api/` directory of the repo.

## Requirements
[Python 3.11](https://www.python.org/downloads/release/python-3117/).
[NodeJS v21](https://nodejs.org/en/download).

## Install dependencies

### Install Ganache
Run `npm install --global ganache` to install Ganache. This is used to create an Ethereum blockchain locally.

### Create virtual environment
Run `python3 -m venv env` (Mac) or `py -m venv env` (Windows) to create a Python virtual environment. 

### Activate virtual environment
Run `source env/bin/activate` (Mac) or `source .\env\Scripts\activate` (Windows) to activate the virtual environment.

### Install Python packages
In the virtual environment, run `pip install -r requirements.txt` to install Python packages.

### Make database
Run `alembic upgrade head` to create a database and load the schema.

## Create Ethereum blockchain
Run `ganache` to create an Ethereum blockchain network. This does not have to be run in the virtual environment. This must be running before the development server is started.

## Run development server
In the virtual environment, run `python3 main.py` to start development server on [http://localhost:8000](http://localhost:8000). Any changes to the code will cause the server to automatically reload.

## Swagger Docs
Go to [http://localhost:8000/docs]() for the Swagger Docs. The entire API schema can be found there, and API calls can be made from there. Refresh the page after any code changes.

## Manage migrations with Alembic

1. Import all model classes into alembic/env.py with `from app.models.<file> import *`
2. Run `alembic revision --autogenerate -m "<revision message>"` to create a new revision.
3. Run `alembic current` to get the current revision.
4. Run `alembic history --verbose` to get the revision history.
5. Run `alembic upgrade <revision id | +<number of steps>>` to move forward in the revision history.
6. Run `alembic downgrade <revision id | -<number of steps>>` to move backward in the revision history.

