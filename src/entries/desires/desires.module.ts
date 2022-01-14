import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";

import {DesiresService} from './desires.service';

import {Desire} from './desire.model';

@Module({
	imports: [
		SequelizeModule.forFeature([Desire]),
	],
	controllers: [],
	providers: [
		DesiresService
	],
	exports: [
		DesiresService
	]
})
export class DesiresModule {}
