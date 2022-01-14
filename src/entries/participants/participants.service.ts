import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';
import {ApiProperty} from "@nestjs/swagger";

import {handlerError} from '../../helpers/handler.error';

import {GamesService} from '../games/games.service';
import {DesiresService} from '../desires/desires.service';

import {Participant} from './participant.model';
import {Desire} from '../desires/desire.model';

export interface NewParticipant {
	first_name: string;
	last_name: string;
	desires: string[];
	transaction?: Transaction;
}

export class MaxErrorParticipants {
	@ApiProperty({example: 'Error Message', description: 'Maximum participants Error Message'})
	reason: string;
}

@Injectable()
export class ParticipantsService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Participant) private participants: typeof Participant,
		@InjectModel(Desire) private desires: typeof Desire,
		private gamesService :GamesService,
		private desiresService: DesiresService
	) {}

	public async registration(newParticipant: NewParticipant) {
		try {
			return await this.sequelize.transaction({...(newParticipant.transaction?{transaction: newParticipant.transaction}:{})}, async (t) => {
				const game = await this.gamesService.getCurrentGame({transaction: t});

				if(await this.participants.count({where: {gameId: game.getDataValue('id')}, transaction: t}) >= 500) {
					throw new ConflictException({
						gameId: game.getDataValue('id'),
						reason: `The maximum number of participants has already been registered in the game "${game.getDataValue('id')}"`
					} as MaxErrorParticipants);
				}

				const res = await this.participants.create({
					first_name: newParticipant.first_name,
					last_name: newParticipant.last_name,
					gameId: game.getDataValue('id')
				}, {transaction: t});

				const res1 = await this.desiresService.createDesires({
					desires: newParticipant.desires,
					participantId: res.getDataValue('id'),
					gameId: game.getDataValue('id'),
					transaction: t
				});

				return await this.participants.findOne({include: [{model: Desire}], where: {id: res.getDataValue('id')}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}
}
