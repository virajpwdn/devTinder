# Stage 1: Build
FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

# Stage 2: Runtime
FROM node:24-alpine
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

COPY package*.json ./ 

COPY --chown=nodejs:nodejs . .

RUN apk add --no-cache python3 make g++

RUN npm ci


USER nodejs

EXPOSE 3000

CMD ["node", "app.js"]