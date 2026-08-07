# Production Dockerfile for HireCore OS Express Backend API Server

FROM node:22-alpine

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose HTTP API Port
EXPOSE 5000

# Set environment runtime
ENV NODE_ENV=production

# Start Express server
CMD ["node", "index.js"]
