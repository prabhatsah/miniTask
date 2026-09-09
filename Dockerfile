FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY tsconfig.json ./
COPY prisma.config.ts ./

COPY prisma ./prisma

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate

COPY generated ./generated

COPY src ./src

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]