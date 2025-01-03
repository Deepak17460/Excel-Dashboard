#!/bin/bash

if ! command -v docker &> /dev/null
then
    sudo apt update
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed."
fi

if ! command -v docker-compose &> /dev/null
then
    sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi

if ! command -v node &> /dev/null
then
    sudo apt update
    sudo apt install -y nodejs npm
else
    echo "Node.js is already installed."
fi

echo "Installing dependencies for the client..."
cd client && npm install

echo "Installing dependencies for the server..."
cd ../server && npm install

echo "Building Docker images for client and server..."
docker-compose build

echo "Starting all services using Docker Compose..."
docker-compose up -d

echo "Waiting for MySQL to be fully up..."
until docker exec mysql mysqladmin --user=root --password=$DATABASE_PASSWORD --host=mysql --silent --wait=10 ping; do
    echo "Waiting for MySQL to be ready..."
    sleep 5
done

echo "Running database migrations inside the node_app container..."
docker exec -it node_app npx sequelize-cli db:migrate

echo "Application started. Please open your browser and go to http://99.81.128.143:3000"
