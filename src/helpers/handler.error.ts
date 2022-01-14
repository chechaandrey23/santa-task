import {HttpException, HttpStatus, ConflictException, NotAcceptableException, InternalServerErrorException} from '@nestjs/common';

export function handlerError(e: Error, data: object = {}) {
	if(e instanceof HttpException) {
		throw e;
	} else {
		console.error(e);
		throw new InternalServerErrorException({...data, ...{reason: e.toString()}});
	}
}
