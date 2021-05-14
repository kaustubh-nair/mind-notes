FROM node

WORKDIR /app/frontend
COPY package.json /app/frontend
COPY public/ /app/frontend/public
COPY src /app/frontend/src

RUN npm install

EXPOSE 3000
CMD ["npm", "start"]
