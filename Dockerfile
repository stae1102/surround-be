FROM node:lts-alpine

WORKDIR /usr/app/surround
RUN yarn

COPY package*.json ./
COPY yarn.lock ./

COPY . .
RUN yarn install --immutable --immutable-cache --check-cache
RUN yarn prisma db push
RUN yarn prisma generate

RUN yarn build

COPY ../env/.env .env

EXPOSE 8081
CMD ["yarn", "start:prod"]
