FROM node:18-alpine as builder

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install

COPY . .

RUN npm run build 

#certbot
FROM certbot/certbot:latest as certbot

RUN certbot certonly --webroot --webroot-path=/var/www/certbot --email wjdjwl545@naver.com --agree-tos -d pick-fresh24.com

#nginx 
FROM nginx:1.25-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]