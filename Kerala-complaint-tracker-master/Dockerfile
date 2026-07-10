FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.27-alpine

# Default for local Docker. Railway will override PORT automatically.
ENV PORT=8080

COPY --from=build /app/dist /usr/share/nginx/html

# Nginx Docker image will envsubst this template at runtime
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Runtime env config injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

EXPOSE 8080
