import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";
import {ApiProperty} from "@nestjs/swagger";

import {Game} from '../games/game.model';
import {Desire} from '../desires/desire.model';

interface CreateParticipant {
	first_name: string;
	last_name: string;
	gameId: number;
}

@Table({tableName: 'participants', timestamps: true, paranoid: true, deletedAt: true})
export class Participant extends Model<Participant, CreateParticipant> {
	@ApiProperty({example: '1', description: 'id'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@ApiProperty({example: 'John', description: 'First name'})
	@Column({type: DataType.STRING})
	first_name: string;

	@ApiProperty({example: 'Smith', description: 'Last name'})
	@Column({type: DataType.STRING})
	last_name: string;

	@ApiProperty({example: '1', description: 'game id'})
	@ForeignKey(() => Game)
	@Column({type: DataType.INTEGER})
	gameId: number;

	@BelongsTo(() => Game)
	game: Game;

	@ApiProperty({example: '[\n{"id": 1, "desire": "desire 1"},\n{"id": 2, "desire": "desire 2"}\n]', description: 'desires participant'})
	@HasMany(() => Desire)
	desires: Desire[];
}
