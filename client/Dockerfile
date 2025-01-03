FROM node:16-alpine AS build
WORKDIR /app
LABEL maintainer="test@gmail.com"
COPY package*.json ./
RUN npm ci
COPY . .
ARG configuration=production
RUN npm run build --configuration=${configuration}

FROM nginx:stable-alpine AS runtime
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]