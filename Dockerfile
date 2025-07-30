# Use official Node.js LTS image
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies for backend
COPY package*.json ./
RUN npm install

# Copy backend source
COPY . .

# Build React frontend
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
RUN npm run build

# Move build to backend public directory (if needed)
WORKDIR /app

# (Optional) If your backend serves static from client/build, no need to move
# Otherwise, uncomment below to move build to /app/public
# RUN mv client/build public/

# Expose port
EXPOSE 4000

# Start the server
CMD ["node", "server.js"] 