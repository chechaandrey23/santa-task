import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class GameDTO {
	@ApiProperty({description: 'Game Id', required: false})
	@Transform(({value}) => {return !value?undefined:value*1})
	@ValidateIf(({gameId}) => gameId !== undefined)
	@IsInt()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	gameId: number;
}
