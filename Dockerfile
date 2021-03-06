FROM node:10-alpine

COPY package*.json ./

RUN npm install --production

# initialise environment variables
ENV NODE_ENV production
ENV APP_PREFIX ''
ENV DB_USER ''
ENV DB_PASSWORD ''
ENV DB_HOST localhost
ENV DB_PORT 27017
ENV DB_DATABASE node_base
ENV APP_PORT 5000
ENV APP_NAME node-base
ENV RATE_LIMIT_MAX 100
ENV RATE_LIMIT_WINDOW_MS 900000

COPY . .

# specify the working directory
WORKDIR src

EXPOSE 5000 5000

# run application
CMD ["node", "server.js"]
