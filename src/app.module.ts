import {Module} from '@nestjs/common';
import {SequelizeModule} from "@nestjs/sequelize";
import {Dialect} from 'sequelize';

import {GameModule} from './endpoints/game/game.module';

@Module({
	imports: [
		SequelizeModule.forRoot({
			dialect: (process.env.SEQUELIZE_DIALECT as Dialect) || 'sqlite',
			storage: process.env.SEQUELIZE_STORAGE || ':memory:',
			autoLoadModels: !!process.env.SEQUELIZE_AUTOLOAD || true
		}),
		GameModule
	],
	controllers: [

	],
	providers: [

	],
})
export class AppModule {}
