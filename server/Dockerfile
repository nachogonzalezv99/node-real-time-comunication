FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Compilar TypeScript
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]