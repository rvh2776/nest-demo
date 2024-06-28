#!/bin/bash

GREEN='\033[0;32m'
ROJO="\033[;31m"
BLUE='\033[0;34m'
CLEAR="\033[0m"

#* Cargar solo las variables específicas del archivo .env
set -a
source .env.development
set +a

#? Para probar si esta tomando las variables de entorno que se necesitan.
#echo "Variables de entorno importadas: Host: ${DB_HOST} - Port: ${DB_PORT} - UsuarioDB: ${DB_USERNAME}"

echo
echo -e "${GREEN}Script iniciado. ${CLEAR}"
echo

#* Espero a que el servicio de Postgres esté disponible, usando pg_isready de postgresSQL
# until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USERNAME
# do
#   echo "Esperando a que PostgreSQL esté disponible..."
#   sleep 2
# done

#* Espero a que el servicio de Postgres esté disponible, usando Netcat (Herramienta para verificar redes)
until nc -z $DB_HOST $DB_PORT
do
  echo -e "${ROJO} Esperando a que PostgreSQL esté disponible... ${CLEAR}"
  sleep 2
done

echo -e "${BLUE} PostgresSQL iniciado, corriendo migración... ${CLEAR}"

# Genero nombre de migración basado en la fecha y hora actuales
MIGRATION_NAME="auto_migration_$(date +%Y/%m/%d_%H:%M:%S)"

echo -e "${GREEN} Fecha: ${MIGRATION_NAME} ${CLEAR}"

# Corro las migraciones
npm run migration:generate src/migrations/$MIGRATION_NAME
npm run build
npm run migration:run

echo
echo -e "${GREEN} Script finalizado. ${CLEAR}"
echo