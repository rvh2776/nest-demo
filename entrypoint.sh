#!/bin/bash

# Espero a que el servicio de Postgres esté disponible
until pg_isready -h postgres-db -p 5432 -U $DB_USERNAME
do
  echo "Esperando a que PostgreSQL esté disponible..."
  sleep 2
done

echo "PostgresSQL iniciado, corriendo migración..."
# Corro las migraciones
npm run migration:run

echo "Iniciando aplicación..."
# Inicio la aplicación
npm run start:prod