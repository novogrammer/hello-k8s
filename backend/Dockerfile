FROM node:20.18.0-bookworm


# RUN apt-get update && apt-get install -y \
#     lame \
#     && apt-get clean \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

EXPOSE 4000

CMD ["npm", "run", "start"]

