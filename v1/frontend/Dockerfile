FROM node:18-alpine
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci --silent
COPY . .
CMD ["npm", "run", "dev"]
