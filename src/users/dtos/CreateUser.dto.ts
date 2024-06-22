//import { ApiModelProperty } from '@nestjs/swagger';

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'El nombre del usuario, debe tener como minimo 3 caracteres',
    example: 'Rafael',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({
    description: 'El email del usuario, debe ser un email valido',
    example: 'example@test.com',
  })
  email: string;

  /**
   * La contraseña, debe ser al menos de 6 caracteres, un número, una mayúscula y un caracter especial.
   *
   * @example: Strong!(Password)
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  // @ApiProperty({
  //   description:
  //     'La contraseña, debe ser al menos de 6 caracteres, un numero y una mayuscula y un caracter especial',
  //   example: 'Strong!(Password)',
  // })
  password: string;

  @IsEmpty()
  @ApiProperty({
    description:
      'Asignada por default al moento de crear el usuario, no se debe enviar en el body',
    default: false,
  })
  isAdmin: boolean;
}
