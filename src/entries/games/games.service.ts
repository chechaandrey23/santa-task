import {HttpException, HttpStatus, Injectable, ConflictException, NotAcceptableException} from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Sequelize} from 'sequelize-typescript';
import {Op, Transaction} from 'sequelize';

import {handlerError} from '../../helpers/handler.error';

import {Game} from './game.model';

export interface NewGame {
	transaction?: Transaction;
}

export interface CheckGame extends NewGame {}

@Injectable()
export class GamesService {
	constructor(
		private sequelize: Sequelize,
		@InjectModel(Game) private games: typeof Game
	) {}

	public async getCurrentGame(checkGame: CheckGame) {
		try {
			return await this.sequelize.transaction({...(checkGame.transaction?{transaction: checkGame.transaction}:{})}, async (t) => {
				const res = await this.games.findOne({where: {}, order: [['createdAt', 'DESC']], transaction: t});
				
				if(!res) {
					return await this.newGame({transaction: t});
				} else {
					return res;
				}
			});
		} catch(e) {
			handlerError(e);
		}
	}

	public async newGame(newGame: NewGame) {
		try {
			return await this.sequelize.transaction({...(newGame.transaction?{transaction: newGame.transaction}:{})}, async (t) => {
				const res = await this.games.create({}, {transaction: t});
				return await this.games.findOne({where: {id: res.id}, transaction: t});
			});
		} catch(e) {
			handlerError(e);
		}
	}
}
