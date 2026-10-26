# admin
FROM node:22-alpine

ENV APP_HOME=/usr/app/
RUN mkdir -p ${APP_HOME}
# 작업 시작 위치
WORKDIR $APP_HOME
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

CMD ["npm", "run", "start"]
