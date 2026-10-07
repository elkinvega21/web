# Frontend — imagen de Angular servida con nginx
FROM node:22-alpine AS build
WORKDIR /app
COPY apps/frontend/package.json apps/frontend/package-lock.json ./
RUN npm ci
COPY apps/frontend ./
RUN npm run build -- --configuration production

FROM nginx:1.27-alpine
COPY --from=build /app/dist/adventure-frontend/browser /usr/share/nginx/html
COPY docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
