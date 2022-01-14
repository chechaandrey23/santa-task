import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ResultsService} from './results.service';

import {Result} from './result.model';
import {Participant} from '../participants/participant.model';

import {GamesModule} from '../games/games.module';

@Module({
	imports: [
		SequelizeModule.forFeature([Result, Participant]),
		GamesModule
	],
	controllers: [],
	providers: [
		ResultsService
	],
	exports: [
		ResultsService
	]
})
export class ResultsModule {}
