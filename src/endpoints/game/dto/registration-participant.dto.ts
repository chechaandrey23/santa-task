import {
	IsInt, IsNotEmpty, Min, Max, MinLength, MaxLength, IsNumberString, IsString, IsArray, IsBoolean, IsEmail, ValidateIf, ValidateNested, IsMobilePhone, ArrayMinSize, ArrayMaxSize
} from 'class-validator';
import {Transform, Type} from 'class-transformer';
import {ApiProperty} from "@nestjs/swagger";

export class RegistrationParticipantDTO {
	@ApiProperty({description: 'First name', example: 'John'})
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	first_name: string;

	@ApiProperty({description: 'Last name', example: 'Smith'})
	@IsNotEmpty()
	@IsString()
	@MinLength(1)
	@MaxLength(255)
	last_name: string;

	@ApiProperty({description: 'Array with desires', example: '["desire 1", "desire 2"]'})
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(10)
	@IsString({each: true})
	@MinLength(1, {each: true})
	@MaxLength(255, {each: true})
	desires: Array<string>;
}
