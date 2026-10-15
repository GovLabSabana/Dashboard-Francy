FROM node:20-alpine

WORKDIR /app

COPY package.json ./
COPY server.js ./
COPY index.html ./
COPY Dashboard_Executive_Escuela_Gobierno_V12_Corregido.html ./

ENV PORT=3000
EXPOSE 3000

USER node

CMD ["node", "server.js"]
