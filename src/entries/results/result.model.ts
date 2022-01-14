import {BelongsToMany, BelongsTo, Column, DataType, HasMany, HasOne, Model, Table, ForeignKey} from "sequelize-typescript";
import {BelongsToOptions} from 'sequelize';
import {ApiProperty} from "@nestjs/swagger";

import {Game} from '../games/game.model';
import {Participant} from '../participants/participant.model';

interface CreateResult {
	recipientId: number;
	santaId: number;
	gameId: number;
}

@Table({tableName: 'results', timestamps: true, paranoid: true, deletedAt: true})
export class Result extends Model<Result, CreateResult> {
	@ApiProperty({example: '1', description: 'id'})
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@ApiProperty({example: '1', description: 'santa id'})
	@ForeignKey(() => Participant)
	@Column({type: DataType.INTEGER})
	santaId: number;

	@ApiProperty({
		name: "ParticipantSanta",
		example: {
			id: 1,
			first_name: "John",
			last_name: "Smith",
			gameId: 1
		},
		description: 'santa description'
	})
	@BelongsTo(() => Participant, 'santaId')
	ParticipantSanta: Participant;

	@ApiProperty({example: '1', description: 'recipient id'})
	@ForeignKey(() => Participant)
	@Column({type: DataType.INTEGER})
	recipientId: number;

	@ApiProperty({
		name: "ParticipantRecipient",
		example: {
			id: 1,
			first_name: "John",
			last_name: "Smith",
			gameId: 1,
			desires: [
				{id: 1, desire: "desire 1"},
				{id: 2, desire: "desire 2"}
			]
		},
		description: 'recipient description & his desires'
	})
	@BelongsTo(() => Participant, 'recipientId')
	ParticipantRecipient: Participant;

	@ApiProperty({example: '1', description: 'game id'})
	@ForeignKey(() => Game)
	@Column({type: DataType.INTEGER})
	gameId: number;

	@BelongsTo(() => Game)
	game: Game;
}
