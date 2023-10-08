import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { getTeams } from '../src/data/getData'
import { Team } from "../dist/types/teamInterface";
import request from 'supertest'
import { app } from "../src/index"
import exp from "constants";


describe("DB connection", () => {

    beforeAll(async () => {
        const prisma = new PrismaClient();
    })

    test('Web scraping integrity', async () => {
        const prisma = new PrismaClient();
        const players = await prisma.player.findMany()

        expect(players.length).toBeGreaterThan(130);
        expect(players[0].rating).toBe(50);

        const expectedData = {
            id: expect.any(Number),
            playerName: expect.any(String),
            position: expect.stringMatching(/^(PG|SG|PF|SF|C)$/),
            ppg: expect.any(Number),
            rpg: expect.any(Number),
            apg: expect.any(Number),
            rating: expect.any(Number),
            teamId: expect.any(Number)

        }
        expect(players[0]).toEqual(expect.objectContaining(expectedData));

    })

    test('team API integrity', async () => {
        const mockAxios = new MockAdapter(axios);
        const resData = [{
            id: 1,
            abbreviation: 'ATL',
            city: 'Atlanta',
            conference: 'East',
            division: 'Southeast',
            full_name: 'Atlanta Hawks',
            name: 'Hawks'
        }]
        mockAxios.onGet('https://www.balldontlie.io/api/v1/teams').reply(200, resData);
        const data = await getTeams();
        expect(data).toMatchObject(expect.objectContaining(Team))
    })

    test('GET quiz test', async () => {
        const response = await request(app).get('/quiz');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', expect.any(String));
        expect(response.body).toHaveProperty('conf', expect.stringMatching(/East|West/));
        expect(response.body).toHaveProperty('stats');
        expect(response.body).toHaveProperty('choice', expect.stringMatching(/apg|ppg|rpg/  ));
    })
})