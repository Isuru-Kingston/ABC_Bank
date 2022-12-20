FROM node

WORKDIR /app/user

COPY package.json .

COPY . .

RUN npm install

EXPOSE 8002

CMD ["npm", "start"]