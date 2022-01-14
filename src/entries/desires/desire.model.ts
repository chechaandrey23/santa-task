import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";

import {Participant} from '../participants/participant.model';
import {Game} from '../games/game.model';

interface CreateDesire {
	desire: string;
	participantId: number;
}

@Table({tableName: 'desires', timestamps: true, paranoid: true, deletedAt: true})
export class Desire extends Model<Desire, CreateDesire> {
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING})
	desire: string;

	@ForeignKey(() => Participant)
	@Column({type: DataType.INTEGER})
	participantId: number;

	@BelongsTo(() => Participant)
	participant: Participant;

	@ForeignKey(() => Game)
	@Column({type: DataType.INTEGER})
	gameId: number;

	@BelongsTo(() => Game)
	game: Game;
}
