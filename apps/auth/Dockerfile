FROM node

WORKDIR /usr/src/app

COPY package*.json . 

RUN npm install

COPY . .

# docker compose overited
# CMD ["node", "dist/apps/api/main"]