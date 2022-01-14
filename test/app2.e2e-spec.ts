import {Test, TestingModule} from '@nestjs/testing';
import {INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import {AppModule} from './../src/app.module';
import * as queryString from 'query-string';

describe('Test main line multi games Hide-Santa', () => {
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

	it('registration participants in two games', async () => {
		jest.setTimeout(60000);

		for(let i = 1; i<3; i++) {
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
				.expect(201);

			expect(res2.body.first_name).toEqual('Hello 2');
			expect(res2.body.last_name).toEqual('World 2');
			expect(res2.body.desires.length).toEqual(3);
			expect(res2.body.desires[0].desire).toEqual('desire 12');
			expect(res2.body.desires[1].desire).toEqual('desire 22');
			expect(res2.body.desires[2].desire).toEqual('desire 32');

			const res_id_2 = res2.body.id;

			const res3 = await request(app.getHttpServer())
				.post('/game/api/participants/registration')
				.send(queryString.stringify({
					first_name: 'Hello 23',
					last_name: 'World 23',
					desires: [
						'desire 123',
						'desire 223',
						'desire 323'
					]
				}, {arrayFormat: 'bracket'})) // x-www-form-urlencoded upload
				.set('Accept', 'application/json')
				.expect(201);

			expect(res3.body.first_name).toEqual('Hello 23');
			expect(res3.body.last_name).toEqual('World 23');
			expect(res3.body.desires.length).toEqual(3);
			expect(res3.body.desires[0].desire).toEqual('desire 123');
			expect(res3.body.desires[1].desire).toEqual('desire 223');
			expect(res3.body.desires[2].desire).toEqual('desire 323');

			const res_id_3 = res3.body.id;

			const res_shuffle = await request(app.getHttpServer())
				.post('/game/api/shuffle')
				.send(queryString.stringify({}, {arrayFormat: 'bracket'})) // x-www-form-urlencoded upload
				.set('Accept', 'application/json')
				.expect(201);

			//console.log(res_shuffle.body);
			expect(res_shuffle.body.length).toEqual(3);
			expect(res_shuffle.body[0].santaId).toEqual(res_id_1);
			expect(res_shuffle.body[1].santaId).toEqual(res_id_2);
			expect(res_shuffle.body[2].santaId).toEqual(res_id_3);
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_shuffle.body[0].recipientId]));
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_shuffle.body[1].recipientId]));
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_shuffle.body[2].recipientId]));

			const res_end_1 = await request(app.getHttpServer())
				.get('/game/api/my-recipient/'+res_id_1)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(res_end_1.body.santaId).toEqual(res_id_1);
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_end_1.body.recipientId]));

			const res_end_2 = await request(app.getHttpServer())
				.get('/game/api/my-recipient/'+res_id_2)
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(res_end_2.body.santaId).toEqual(res_id_2);
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_end_2.body.recipientId]));

			const res_end_3 = await request(app.getHttpServer())
				.get('/game/api/my-recipient/'+res_id_3+'?'+queryString.stringify({gameId: i}, {arrayFormat: 'bracket'}))
				.set('Accept', 'application/json')
				.expect('Content-Type', /json/)
				.expect(200)

			expect(res_end_3.body.santaId).toEqual(res_id_3);
			expect([res_id_1, res_id_2, res_id_3]).toEqual(expect.arrayContaining([res_end_3.body.recipientId]));
		}
	});
});
