FROM node

WORKDIR /app/auth

COPY package.json .

COPY . .

RUN npm install

EXPOSE 8004

CMD ["npm", "start"]