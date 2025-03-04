FROM node:20-alpine

WORKDIR /ResearchStalker-client

COPY public/ /ResearchStalker-client/public
COPY src/ /ResearchStalker-client/src
COPY package.json /ResearchStalker-client/


RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "start", "--", "--port", "8080"]