FROM node:22.19

RUN mkdir -p qr-access-app 
WORKDIR /qr-access-app

RUN apt-get update && apt-get install -y \
    pkg-config \
    gcc \
    && rm -rf /var/lib/apt/lists/*
 
COPY package*.json .

RUN npm install 

COPY . .

EXPOSE 4173 

CMD ["npm", "run", "preview","--", "--host", "0.0.0.0"]