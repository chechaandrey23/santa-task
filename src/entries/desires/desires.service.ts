import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Desire} from './desire.model';

export interface NewDesires {
	gameId: number;
	participantId: number;
	desires: string[];
	transaction?: Transaction;
}

@Injectable()
export class DesiresService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Desire) private desires: typeof Desire,
	) {}

	public async createDesires(newDesires: NewDesires) {
		try {
			return await this.sequelize.transaction({...(newDesires.transaction?{transaction: newDesires.transaction}:{})}, async (t) => {
				const ress =  await this.desires.bulkCreate(newDesires.desires.map((entry) => {
					return {desire: entry, participantId: newDesires.participantId, gameId: newDesires.gameId};
				}), {transaction: t});

				return await this.desires.findAll({where: {id: ress.map((entry) => {return entry.getDataValue('id')})}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}
}
