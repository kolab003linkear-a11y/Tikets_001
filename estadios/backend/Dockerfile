FROM node:20-alpine

# Instalar OpenSSL requerido por Prisma en Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "dev"]