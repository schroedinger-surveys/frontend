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

# Upload to AWS
FROM amazon/aws-cli

ARG AWS_ACCESS_KEY_ID

ARG AWS_SECRET_ACCESS_KEY

ARG SCHROEDINGER_CDN_STORAGE

ENV AWS_ACCESS_KEY_ID "$AWS_ACCESS_KEY_ID"

ENV AWS_SECRET_ACCESS_KEY "$AWS_SECRET_ACCESS_KEY"

ENV SCHROEDINGER_CDN_STORAGE "$SCHROEDINGER_CDN_STORAGE"

WORKDIR /app

COPY --from=build /app/build /app/

RUN aws s3 cp /app s3://${SCHROEDINGER_CDN_STORAGE}/ --recursive --acl public-read

# Serve index.html
FROM nginx:alpine

COPY --from=build /app/build/ /var/www/

COPY nginx/nginx.conf /etc/nginx/nginx.conf

RUN apk add --no-cache curl

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
