# Base stage
FROM node:22.14.0-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Development stage
FROM base AS development
COPY .env.development .env
EXPOSE 5050
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
RUN npm run build

# Production stage
FROM node:22.14.0-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /app/dist ./dist
COPY .env.production .env
EXPOSE 5050
CMD ["node", "dist/index.js"]