FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package.json package-lock.json* bun.lockb* ./
RUN npm install

# Copy the rest of the app (will be overridden by bind mount in docker-compose dev)
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
