FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM nginx:1.27-alpine

ENV PORT=8080

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080

CMD sh -c 'echo "window.__VENGARA_API_KEY = \"${VITE_GEMINI_API_KEY}\";" > /usr/share/nginx/html/env-config.js && nginx -g "daemon off;"'
