import {BelongsToMany, BelongsTo, Column, DataType, HasMany, Model, Table, ForeignKey} from "sequelize-typescript";

interface CreateGame {
	title?: string;
}

@Table({tableName: 'games', timestamps: true, paranoid: true, deletedAt: true})
export class Game extends Model<Game, CreateGame> {
	@Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
	id: number;

	@Column({type: DataType.STRING})
	title: string;
}
