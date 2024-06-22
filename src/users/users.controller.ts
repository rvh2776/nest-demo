import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersServices } from './users.service';
import { Request, Response } from 'express';
// import { User } from './users.interface';
// import { User as UserEntity } from './users.entity';
// import { DateAdderInterceptor } from 'src/interceptors/date-adder.interceptor';
import { DateAdderInterceptor } from '../interceptors/date-adder.interceptor'; //! Se cambio para los test.
import { UsersDbService } from './usersDb.service';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { CloudinaryService } from './cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
// import { MinSizeValidatorPipe } from 'src/pipes/min-size-validator.pipe';
import { MinSizeValidatorPipe } from '../pipes/min-size-validator.pipe'; //! Se cambio para los test.
import { AuthService } from './auth.service';
import { UserCredentialsDto } from './dtos/UserCredentials.dto';
// import { AuthGuard } from 'src/guards/auth.guard';
import { AuthGuard } from '../guards/auth.guard'; //! Se cambio para los test.
// import { Roles } from 'src/decorators/roles.decorator';
import { Roles } from '../decorators/roles.decorator'; //! Se cambio para los test.
// import { Role } from 'src/roles.enum';
import { Role } from '../roles.enum'; //! Se cambio para los test.
// import { RolesGuard } from 'src/guards/roles.guard';
import { RolesGuard } from '../guards/roles.guard'; //! Se cambio para los test.
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
//? se puede llamar al UseGuards() en toda la ruta para que valide el token o llamarlo en la ruta que queramos.
// @UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersServices,
    private readonly usersDbService: UsersDbService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly authService: AuthService,
  ) {}

  // @Get()
  // getUsers() {
  //   return this.usersService.getUsers();
  // }

  //? Para filtrar un nombre o lo que sea por Query en la consulta tiene que ir: /users?name=Tota o sea despues de la ruta se agrega el singo (?) mas lo que se busca seguido del signo (=) y el nombre en este caso
  // * Ejemplo: http://localhost:3000/users?name=Rafael
  // @Get()
  // getUsers(@Query('name') name?: string) {
  //   if (name) {
  //     return this.usersService.getUserByName(name);
  //   }
  //   return this.usersService.getUsers();
  // }

  @Get()
  getUsers(@Query('name') name?: string) {
    if (name) {
      return this.usersDbService.getUserByName(name);
    }
    return this.usersDbService.getUsers();
  }

  //?: Crear rutas dentro del users.
  // @Get('profile')
  // getUserProfile() {
  //   return 'Este endpoint retorna el perfil del usuario';
  // }

  //? Validar Header para ver si tiene permisos de ver la ruta.
  // @Get('profile')
  // getUserProfile(@Headers('token') token?: string) {
  //   if (token !== '1234') {
  //     return 'Sin acceso';
  //   }
  //   return 'Este endpoint retorna el perfil del usuario';
  // }

  //? Validar Header con token (AuthGuard).
  @ApiBearerAuth() // Se agrega para poder probar en la API las rutas que necesitan token.
  @Get('profile')
  @UseGuards(AuthGuard)
  getUserProfile(@Req() request: Request & { user: any }) {
    console.log(request.user);
    return 'Este endpoint retorna el perfil del usuario';
  }

  // @Get('profile/images')
  // getUserImages() {
  //   return 'Este endpoint retorna las imagenes del usuario';
  // }

  //? Validando con @UseGuards(), puede ser en una ruta especifica o hacerlo general, llevando el UseGuards() al inicio de la ruta como esta comentado arriba.
  // @Get('profile/images')
  // @UseGuards(AuthGuard)
  // getUserImages() {
  //   return 'Este endpoint retorna las imagenes del usuario';
  // }

  //? Subir archivos a Cloudinay.
  @Post('profile/images')
  @UseInterceptors(FileInterceptor('image'))
  @UsePipes(MinSizeValidatorPipe)
  getUserImages(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000000,
            message: 'El archivo debe ser menor a 100kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // return this.cloudinaryService.uploadImage(file);
    return file;
  }

  //? Cambiar el status code.
  // @HttpCode(418)
  // @Get('coffee')
  // getCoffee() {
  //   return 'No se hacer cafe, soy una tetera';
  // }

  // @HttpCode(418)
  @Get('coffee')
  getCoffee() {
    try {
      throw new Error();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.I_AM_A_TEAPOT,
          error: 'Envio de cafe fallido',
        },
        HttpStatus.I_AM_A_TEAPOT,
      );
    }
  }

  //? Interceptar la response.
  @Get('message')
  getMessage(@Res() response: Response) {
    response.status(200).send('Este es un mensaje');
  }

  // Interceptar la request.
  @Get('request')
  getRequest(@Req() request: Request) {
    console.log(request);
    return 'Esta ruta loguea el request';
  }

  //? Ejemplo de uso de Roles.
  @Get('admin')
  @Roles(Role.Admin)
  @UseGuards(AuthGuard, RolesGuard)
  getAdmin() {
    return 'Ruta protegida';
  }

  //? Ejemplo de uso Auth0.
  @Get('auth0/protected')
  getAuth0Protected(@Req() req: Request) {
    console.log(req.oidc.accessToken);
    return JSON.stringify(req.oidc.user);
  }

  //? parametros por params, este endpoint debe ir al final de los @GET(), porque si no todas las consultas van quedarse en este y no pasan por los otros.
  // @Get(':id')
  // getUserById(@Param('id') id: string) {
  //   return this.usersService.getUserById(Number(id));
  // }

  // @Get(':id')
  // getUserById(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.usersDbService.getUserById(id);
  // }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    const user = await this.usersDbService.getUserById(id);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado!');
    }
    return user;
  }

  // @Post()
  // createUser(@Body() user: User) {
  //   return this.usersService.createUser(user);
  // }

  @Post('signup')
  @UseInterceptors(DateAdderInterceptor)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  createUser(
    @Body() user: CreateUserDto,
    @Req() request: Request & { now: string },
  ) {
    // console.log('dentro del endpoint', request.now);
    // console.log(user);

    return this.authService.signUp({ ...user, createdAt: request.now });
  }

  @Post('signin')
  signin(@Body() user: UserCredentialsDto) {
    return this.authService.signIn(user.email, user.password);
  }

  @Put()
  updateUser() {
    return 'Este endpoint actualiza un usuario';
  }

  @Delete()
  deleteUser() {
    return 'Este endpoint elimina un usuario';
  }
}
