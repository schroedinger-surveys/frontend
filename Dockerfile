FROM node:14.8.0-stretch AS build

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --silent --only=prod

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build/ /var/www/

COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
