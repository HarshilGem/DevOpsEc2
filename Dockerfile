# ---------- Build React Frontend ----------
    FROM node:18 AS frontend-build

    WORKDIR /app/client
    COPY client/package*.json ./
    RUN npm install
    COPY client/ ./
    RUN npm run build
    
    # ---------- Build Backend ----------
    FROM node:18 AS backend-build
    
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    # Remove the client source (not needed in backend image)
    RUN rm -rf client
    
    # ---------- Production Image ----------
    FROM node:18 AS production
    
    WORKDIR /app
    
    # Copy backend
    COPY --from=backend-build /app /app
    
    # Copy frontend build to backend's public directory
    RUN mkdir -p /app/client/build
    COPY --from=frontend-build /app/client/build /app/client/build
    
    # Install Nginx
    RUN apt-get update && apt-get install -y nginx
    
    # Copy Nginx config
    COPY nginx.conf /etc/nginx/nginx.conf
    
    # Expose ports
    EXPOSE 80 4000
    
    # Start both backend and nginx
    CMD service nginx start && node server.js
