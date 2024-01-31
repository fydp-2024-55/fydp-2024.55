FROM python:3.9.15

# Set up code directory
RUN mkdir -p /usr/src/blockchain
WORKDIR /usr/src/blockchain

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

# Install Python dependencies
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Start ganache
RUN ["ganache", "--detach"]

# Deploy the smart contract
RUN ["brownie", "run", "deploy"]
