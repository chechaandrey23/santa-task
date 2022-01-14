import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {GamesService} from './games.service';

import {Game} from './game.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Game]),
	],
	controllers: [],
	providers: [
		GamesService
	],
	exports: [
		GamesService
	]
})
export class GamesModule {}
