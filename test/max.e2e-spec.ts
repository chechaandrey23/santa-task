import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import * as queryString from 'query-string';

jest.useRealTimers();

describe('Test max participants game Hide-Santa', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		// close!!!
	});

	it('generate error max-participants', async () => {
		jest.setTimeout(60000);

		for(let i=0; i<500; i++) {
			const res1 = await request(app.getHttpServer())
				.post('/game/api/participants/registration')
				.send(queryString.stringify({
					first_name: 'Hello',
					last_name: 'World',
					desires: [
						'desire 1',
						'desire 2',
						'desire 3'
					]
				}, {arrayFormat: 'bracket'})) // x-www-form-urlencoded upload
				.set('Accept', 'application/json')
				.expect(201);

			expect(res1.body.first_name).toEqual('Hello');
			expect(res1.body.last_name).toEqual('World');
			expect(res1.body.desires.length).toEqual(3);
			expect(res1.body.desires[0].desire).toEqual('desire 1');
			expect(res1.body.desires[1].desire).toEqual('desire 2');
			expect(res1.body.desires[2].desire).toEqual('desire 3');

			const res_id_1 = res1.body.id;

			await new Promise((r) => setTimeout(r, 10));
		}

		const res2 = await request(app.getHttpServer())
			.post('/game/api/participants/registration')
			.send(queryString.stringify({
				first_name: 'Hello 2',
				last_name: 'World 2',
				desires: [
					'desire 12',
					'desire 22',
					'desire 32'
				]
			}, {arrayFormat: 'bracket'})) // x-www-form-urlencoded upload
			.set('Accept', 'application/json')
			.expect(409);

		expect(res2.body.reason).toEqual('The maximum number of participants has already been registered in the game "1"');

	}, 60000);
});
