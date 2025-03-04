FROM node:20-alpine

WORKDIR /research_stalker_client

COPY public/ /research_stalker_client/public
COPY src/ /research_stalker_client/src
COPY package.json /research_stalker_client/


RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start", "--", "--port", "3000"]