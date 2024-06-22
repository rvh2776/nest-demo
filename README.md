# SoyHenry: Carrera full stack developer (M4).

## Descripción:
### Tarea módulo M4: consiste en crear un back-end para un e-commerce.

En esta actividad se utilizán las siguientes tecnologías: NestJs, Typescript, TypeORM, SQL, etc...


## Instalaciones y configuraciones

### Clona el repositorio.

```
git clone git@github.com:pi-rym/PM4-rvh2776.git
```

#### Entra a la carpeta del proyecto.

```
cd PM4-rvh2776
```

#### Instala las dependencias.

```
npm install
```

#### Instalar librerias para validar con DTOs.

```
npm install class-validator class-transformer
```

#### Instalar mapped-types para los update parciales de los DTOs.

```
npm install @nestjs/mapped-types
```

#### Instalar librerias y de mas para usar TypeOrm y PostgresSQL.

```
npm install @nestjs/typeorm @nestjs/config typeorm pg
```

#### Instalar UUID.

```
npm install uuid
```

#### Se debe tener el servidor PostgresSQL instalado y funcionando.
* Debe de estar creada la base de datos que se va a usar.


#### Agregar configuracion al archivo: package.json para las migraciones de la base de datos.

* Se coloca en los script debajo de la ultima linea que en este caso es: "test:e2e": "jest --config ./test/jest-e2e.json",

```
"typeorm": "ts-node ./node_modules/typeorm/cli",
"migration:run": "npm run typeorm migration:run -- -d ./src/config/typeorm.ts",
"migration:generate": "npm run typeorm -- -d ./src/config/typeorm.ts migration:generate",
"migration:create": "npm run typeorm migration:create",
"migration:revert": "npm run typeorm -- -d ./src/config/typeorm.ts migration:revert",
"migration:show": "npm run typeorm -- -d ./src/config/typeorm.ts migration:show"
```

#### Para crear migraciones o revertir, seguir los suigientes pasos por ejemplo.

```
npm run typeorm migration:create src/migrations/prueba
```

* Se va a generar en la carpeta src/migrations/xxxx-prueba.ts
* En el mismo se van a generar las class con el: up y down, los mismos van a contener los cambios que se van a generar en la bases de datos.
* up: es lo nuevo que se sube a la base de datos.
* down: es lo que nos permite revertir la accion, o sea hace lo contrario.

* Con esto podemos revertir automaticamente los cambios en la base de datos si hay algun error y sin perder los datos.

#### Se debe generar la carpeta migration en el dist para poder usar el script.

```
npm run build
```

#### Para correr la migracion.

```
npm run migration:run
```
* Se va a crear la tabla: migrations con los datos de la migracion.
* Con esto tenemos probado el script de migraciones de base de datos.

#### Crear primer migracion real.

```
npm run migration:generate src/migrations/intial
```

#### Crear las tablas en la base de datos.

```
npm run build

npm run migration:run
```

#### Conectar entities con la base de datos.

* Por ejemplo en el users.module.ts

```
@Module({
    imports: [TypeOrmModule.forFeature([User])],
    ... resto del codigo
})
```

* Asi estariamos importando: users.entities.ts o sea las entities de users.

#### Instalar reglas de tipado para trabajar con el gestor de archivos: Multer.

```
npm install -D @types/multer
```

#### Instalar Cloudinary para poder usar la API para subir archivos a su cloud.

```
npm install cloudinary
```

#### Instalar buffer-to-stream.

```
npm install buffer-to-stream
```

#### Instalar Bcrypt para encriptar los password.

```
npm install bcrypt
```

#### Al agregar la nueva columna: password en las entities de users, va tirar error al intentar escribir en la base de datos.

* Se debe crear la migracion para actualizar la tabla de users para que se agregue el campo: password.
* Recordar que si la tabla de users tiene datos hay que limpiarlos antes de hacer la migracion, porque de lo contrario va a dar error.

* Si no se quiere borrar los datos existentes en la tabla se debe crear la nueva columna como nullable y agregar un valor por default.
* Para poder generar la migracion sin problemas y luego actualizar los datos de ese campo cambiando el valor por defecto si se quiere.

* Ejemplo:
```
  // Nuevo campo agregado con un valor por defecto
  @Column({ default: 'default_value' })
  newField: string;
```

```
npm run migration:generate src/migrations/add_password
npm run build
npm run migration:run
```

#### Instalar @nestjs/swagger en este caso, esta libreria se usa para lo mismo que venimos usando a: @nestjs/mapped-types extender DTOs.

```
npm install @nestjs/swagger
```

#### Integrar Swagger.

* Agregar al archivo principal de la app: main.ts

```
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Demo Nest')
    .setDescription(
      `API construida con Nest, usando Swagger para documentar el desarroyo del modulo M4 de la especialidad Backend de la carrera Fullstack Developer de Henry`,
    )
    .setVersion('1.0')
    .addBearerAuth() // Este parametro nos permite pasar token de autorizacion a las pruebas de la API, se pueden agregar diferentes tipos de autorizacion.
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
```

* Agregar al archivo de configuracion: nest-cli.json

```
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "classValidatorShim": true,
          "introspectComments": true
        }
      }
    ]
  }
}
```

#### Instalar la libreria de: JSON Web Token (JWT).

```
npm install --save @nestjs/jwt
```

#### Instalar la libreria para usar Open ID Connect (Auth0).

```
npm install express-openid-connect
```

### para levantar tanto la app, como el sevidor de base de datos desde containers.

```
docker-compose up
```

<br>
<font color='lime'><p align="right">Rafael V.H.</p></font>