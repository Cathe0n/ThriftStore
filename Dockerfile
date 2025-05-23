FROM node:24-alpine3.20 AS builder

WORKDIR /app/

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 3000

RUN sed -i 's/80;/3000;/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

