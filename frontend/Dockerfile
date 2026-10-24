# ===================================================================
# 1. Build Stage: Build Vite React Application
# ===================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors first to take advantage of Docker layer caching
COPY package*.json ./

RUN npm ci

# Copy remaining source code
COPY . .

# Build production bundle to dist/
RUN npm run build

# ===================================================================
# 2. Production Stage: Serve with Nginx Reverse Proxy
# ===================================================================
FROM nginx:alpine

# Remove default nginx html files
RUN rm -rf /usr/share/nginx/html/*

# Copy built frontend assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
