import {Module} from '@nestjs/common';

import {GameController} from './game.controller';

import {ParticipantsModule} from '../../entries/participants/participants.module';
import {GamesModule} from '../../entries/games/games.module';
import {DesiresModule} from '../../entries/desires/desires.module';
import {ResultsModule} from '../../entries/results/results.module';

@Module({
	imports: [
		ParticipantsModule,
		GamesModule,
		DesiresModule,
		ResultsModule
	],
	controllers: [
		GameController
	],
	providers: [

	]
})
export class GameModule {}
