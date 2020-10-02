# Build
FROM node:14.8.0-stretch AS build

ARG SCHROEDINGER_CDN_PUBLIC

ENV SCHROEDINGER_CDN_PUBLIC "$SCHROEDINGER_CDN_PUBLIC"

WORKDIR /app

COPY package.json .

COPY package-lock.json .

RUN npm install --silent

COPY . .

RUN PUBLIC_URL=${SCHROEDINGER_CDN_PUBLIC} npm run build

# Serve index.html
FROM nginx:alpine

COPY --from=build /app/build/ /var/www/

COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
