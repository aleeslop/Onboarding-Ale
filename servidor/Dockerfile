FROM node:18
WORKDIR /app
ENV NODE_ENV=development STATIC_ROOT=..
COPY servidor/package*.json ./
RUN npm ci --include=dev
COPY servidor/ ./
COPY index.html script.js styles.css github.png colaboracion-en-equipo.png practica.png ./
RUN node ./node_modules/typescript/bin/tsc
EXPOSE 3000
CMD ["npm", "start"]