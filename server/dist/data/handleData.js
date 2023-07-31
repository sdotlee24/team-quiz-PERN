"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const scraper_js_1 = require("./scraper.js");
const prisma = new client_1.PrismaClient();
const url = "https://www.balldontlie.io/api/v1/";
const getTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url + "teams");
        if (!response.ok) {
            throw new Error("Api GET request failed");
        }
        const d = yield response.json();
        const data = d === null || d === void 0 ? void 0 : d.data;
        //prisma test
        // const user = await prisma.user.create({data: {email: "warriors", password: "nothing"}});
        // await prisma.team.deleteMany();
        data.forEach((team) => __awaiter(void 0, void 0, void 0, function* () {
            //wait a couple seconds/minute before each batch of GET reqs, rate limit = 60/min
            const starters = yield getStarters(team.full_name);
            yield prisma.team.create({ data: { teamName: team.full_name, conference: team.conference, Player: {
                        createMany: {
                            data: starters
                        }
                    } } });
        }));
    }
    catch (error) {
        console.log(error);
    }
});
//TODO: For input section on the frontend, to make it more robust (ex: GSW == warriors == golden state) utilize GPT's api
const getStarters = (team) => __awaiter(void 0, void 0, void 0, function* () {
    const teamInfo = yield (0, scraper_js_1.scrapeLineUps)();
    const starters = [];
    const teamData = teamInfo === null || teamInfo === void 0 ? void 0 : teamInfo.find((t) => t.teamname.includes(team));
    console.log(teamData);
});
//# sourceMappingURL=handleData.js.map