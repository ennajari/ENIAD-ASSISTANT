# Multi-stage Dockerfile for chatbot-ui frontend
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency definitions
COPY chatbot-ui/package*.json ./
RUN npm ci

# Copy source code and build
COPY chatbot-ui/ ./
RUN npm run build

# Nginx Production Stage
FROM nginx:alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
