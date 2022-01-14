import {Body, Controller, Get, Post, Param, Query, UploadedFile, UploadedFiles, UseInterceptors, ValidationPipe, UsePipes, ConflictException, BadRequestException} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor, AnyFilesInterceptor} from '@nestjs/platform-express';
import {ApiOperation, ApiResponse, ApiTags, ApiProperty, ApiParam} from "@nestjs/swagger";

import {Express} from 'express';

import {ParticipantsService, MaxErrorParticipants} from '../../entries/participants/participants.service';
import {GamesService} from '../../entries/games/games.service';
import {DesiresService} from '../../entries/desires/desires.service';
import {ResultsService, MinErrorParticipants, NotFoundMyRecipient} from '../../entries/results/results.service';

import {Participant} from '../../entries/participants/participant.model';
import {Result} from '../../entries/results/result.model';

// dtos
import {RegistrationParticipantDTO} from './dto/registration-participant.dto';
import {MyRecipientDTO} from './dto/my-recipient.dto';
import {GameDTO} from './dto/game.dto';

class ErrorDTO {
	@ApiProperty({description: 'HTTP Status Code', example: '400'})
	statusCode: number;

	@ApiProperty({description: 'HTTP Message', example: '["Bad Request"]'})
	message: Array<string>;

	@ApiProperty({description: 'HTTP Error Message', example: 'Bad Request'})
	error: string;
}

@UsePipes(new ValidationPipe({transform: true}))
@Controller('game/api')
export class GameController {
	constructor(
		private participants: ParticipantsService,
		private games: GamesService,
		private desires: DesiresService,
		private results: ResultsService
	) {}

	@ApiOperation({summary: 'Registration participant in game hide-santa'})
	@ApiResponse({status: 201, type: Participant})
	@ApiResponse({status: 400, type: ErrorDTO})
	@ApiResponse({status: 409, type: MaxErrorParticipants})
	@Post('/participants/registration')
	public async regParticipant(@Body() registrationParticipantDTO: RegistrationParticipantDTO) {
		return await this.participants.registration({
			first_name: registrationParticipantDTO.first_name,
			last_name: registrationParticipantDTO.last_name,
			desires: registrationParticipantDTO.desires
		});
	}

	@ApiOperation({summary: 'Definition for each member of the hide-santa'})
	@ApiResponse({status: 201, type: Result, isArray: true})
	@ApiResponse({status: 400, type: ErrorDTO})
	@ApiResponse({status: 409, type: MinErrorParticipants})
	@Post('/shuffle')
	public async shuffle() {
		return await this.results.shuffle({});
	}

	@ApiOperation({summary: 'Find out by the id of the recipient of the gift'})
	@ApiResponse({status: 200, type: Result})
	@ApiResponse({status: 400, type: ErrorDTO})
	@ApiResponse({status: 409, type: NotFoundMyRecipient})
	@ApiParam({name: 'id'})
	@Get('/my-recipient/:id')
	public async getMyRecipient(@Param() myRecipientDTO: MyRecipientDTO, @Query() gameDTO: GameDTO) {
		return await this.results.getMyRecipient({
			id: myRecipientDTO.id,
			gameId: gameDTO.gameId
		});
	}
}
