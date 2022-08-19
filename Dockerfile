FROM node:17-alpine3.15 as builder

WORKDIR /usr/src/app

COPY . .

COPY .env.production .env

RUN npm install

RUN npm run build

FROM nginx:alpine as production-build

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

#RUN rm rm /etc/docker/nginx/default.conf

COPY ./etc/docker/nginx/default.conf /etc/nginx/conf.d

#RUN rm -rf /usr/share/nginx/html/*

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

