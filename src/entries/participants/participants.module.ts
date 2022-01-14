import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {ParticipantsService} from './participants.service';

import {Participant} from './participant.model';
import {Desire} from '../desires/desire.model';

import {GamesModule} from '../games/games.module';
import {DesiresModule} from '../desires/desires.module';

@Module({
	imports: [
		SequelizeModule.forFeature([Participant, Desire]),
		GamesModule,
		DesiresModule,
	],
	controllers: [],
	providers: [
		ParticipantsService
	],
	exports: [
		ParticipantsService
	]
})
export class ParticipantsModule {}
