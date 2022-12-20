FROM node

WORKDIR /app/branch

COPY package.json .

COPY . .

RUN npm install

EXPOSE 8001

CMD ["npm", "start"]