import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';
import {ApiProperty} from "@nestjs/swagger";

import {handlerError} from '../../helpers/handler.error';

import {Result} from './result.model';
import {Participant} from '../participants/participant.model';
import {Desire} from '../desires/desire.model';

import {GamesService} from '../games/games.service';

export interface Shuffle {
	transaction?: Transaction;
}

export interface MyRecipient extends Shuffle {
	id: number;
	gameId?: number;
}

export class MinErrorParticipants {
	@ApiProperty({example: 'Error Message', description: 'Minimum participants Error Message'})
	reason: string;
}

export class NotFoundMyRecipient {
	@ApiProperty({example: 'Error Message', description: 'Not Found My Recipient Error Message'})
	reason: string;
}

@Injectable()
export class ResultsService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Result) private results: typeof Result,
		@InjectModel(Participant) private participants: typeof Participant,
		private gamesService: GamesService,
	) {}

	public async shuffle(shuffle: Shuffle) {
		try {
			return await this.sequelize.transaction({...(shuffle.transaction?{transaction: shuffle.transaction}:{})}, async (t) => {
				const game = await this.gamesService.getCurrentGame({transaction: t});

				const res = await this.participants.findAll({where: {gameId: game.getDataValue('id')}, transaction: t});

				if(res.length < 3) {
					throw new ConflictException({
						gameId: game.getDataValue('id'),
						reason: `In the game "${game.getDataValue('id')}" at least 3 participants must be registered.`
					} as MinErrorParticipants);
				}

				const recipients = this.shuffleArray(res.map((entry) => {return entry.getDataValue('id')}));

				const ress = await this.results.bulkCreate(res.map((entry, index) => {
					return {santaId: entry.getDataValue('id'), recipientId: recipients[index], gameId: game.getDataValue('id')};
				}), {transaction: t});

				await this.gamesService.newGame({transaction: t});

				return await this.results.findAll({where: {id: ress.map((entry) => {return entry.getDataValue('id')})}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}

	// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	protected shuffleArray(array: any[]) {
		let currentIndex = array.length,  randomIndex;

		while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
		}

		return array;
}

	public async getMyRecipient(myRecipient: MyRecipient) {
		try {
			return await this.sequelize.transaction({...(myRecipient.transaction?{transaction: myRecipient.transaction}:{})}, async (t) => {
				const gameId = myRecipient.gameId || ((await this.gamesService.getCurrentGame({transaction: t})).getDataValue('id') * 1 - 1);

				let resultModelName = this.results.name.toString();
				const res = await this.results.findOne({
					include: [
						{model: Participant, as: 'ParticipantSanta'},
						{model: Participant, as: 'ParticipantRecipient', include: [Desire]}
					],
					where: {
						santaId: myRecipient.id,
						gameId: gameId
					},
					transaction: t,
					//subQuery:false
				});

				if(res) {
					return res;
				} else {
					throw new ConflictException({
						gameId: gameId,
						reason: `Unable to find recipient "${myRecipient.id}" in game "${gameId}"`
					} as NotFoundMyRecipient);
				}
			});
		} catch(e) {
			handlerError(e);
		}
	}
}
