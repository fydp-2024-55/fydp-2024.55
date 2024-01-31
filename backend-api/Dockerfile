# Use the official Python 3.11 image
FROM python:3.11

# Set up code directory
RUN mkdir -p /usr/src/backend-api
WORKDIR /usr/src/backend-api

# Install Linux dependencies
RUN apt-get update \
    && apt-get install -y libssl-dev npm

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && \
    apt-get install -y nodejs
RUN npm install -g npm@8

# Install ganache
RUN npm install -g ganache

# Copy local code to the container
COPY . .

# Install Python packages
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

RUN ["ganache", "--detach"]

# RUN ["alembic", "upgrade", "head"]

# Run the server
EXPOSE 8000
ENV CONNECTION_URL=http://host.docker.internal:8545
CMD ["python", "main.py"]
