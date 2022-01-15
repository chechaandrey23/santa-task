import {IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsPositive, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class MyRecipientDTO {
	@ApiProperty({description: 'My participant-id', example: 1})
	@IsNotEmpty()
	@Transform(({value}) => {return value*1})
	@IsInt()
	@IsPositive()
	@Min(1)
	@Max(Math.pow(2, 32) - 1)
	id: number;
}
