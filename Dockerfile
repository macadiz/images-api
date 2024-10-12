# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

ARG IMAGES_API_ARG
ARG REDIS_PORT_ARG
ARG ALLOWED_ORIGINS_ARG

ENV IMAGES_API=${IMAGES_API_ARG}
ENV REDIS_PORT=${REDIS_PORT_ARG}
ENV ALLOWED_ORIGINS=${ALLOWED_ORIGINS_ARG}

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

# Start the server using the production build
CMD [ "node", "dist/main.js" ]