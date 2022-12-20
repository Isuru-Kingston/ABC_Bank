FROM node

WORKDIR /app/operation

COPY package.json .

COPY . .

RUN npm install

EXPOSE 8003

CMD ["npm", "start"]