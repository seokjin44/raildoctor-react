FROM node:14.17.0-alpine AS build-env

WORKDIR /app

# Libraries
COPY ./package-lock.json .
COPY ./package.json .
RUN npm install

COPY . .
RUN npm run build

# Start app
FROM nginx:stable-alpine

COPY --from=build-env /app/build /usr/share/nginx/html
EXPOSE 80

WORKDIR /
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
