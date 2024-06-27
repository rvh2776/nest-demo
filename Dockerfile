FROM node:20

# Instalar postgresql-client para despues, poder verificar si levanta la base de datos para hacer la migracion antes de levantar todo.
RUN apt-get update && apt-get install -y postgresql-client

# WORKDIR /app
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

COPY entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]

# CMD [ "npm", "run", "start" ]
