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
const scraper_1 = require("./scraper");
const client_1 = require("@prisma/client");
process.setMaxListeners(50);
const prisma = new client_1.PrismaClient();
const url = "https://www.balldontlie.io/api/v1/";
function delay(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    });
}
const getTeams = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(url + "teams");
        if (!response.ok) {
            throw new Error("Api GET request failed");
        }
        const d = yield response.json();
        const data = d === null || d === void 0 ? void 0 : d.data;
        for (let i = 0; i < data.length; i++) {
            //wait a couple seconds/minute before each batch of GET reqs, rate limit = 60/min
            yield delay(20000);
            const team = data[i];
            const starters = yield getStarters(team.name);
            if (!starters || starters.length == 0) {
                continue;
            }
            try {
                yield prisma.team.create({ data: { teamName: team.full_name, conference: team.conference, Player: {
                            createMany: {
                                data: starters
                            }
                        } } });
            }
            catch (error) {
                console.log(error);
                continue;
            }
        }
        ;
    }
    catch (error) {
        console.log(error);
    }
});
const getStarters = (team) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const teamInfo = yield (0, scraper_1.scrapeLineUps)();
    const starters = [];
    const teamData = (_a = teamInfo === null || teamInfo === void 0 ? void 0 : teamInfo.find((t) => t.team.includes(team))) === null || _a === void 0 ? void 0 : _a.starterData;
    let success = true;
    if (teamData) {
        for (let i = 0; i < (teamData === null || teamData === void 0 ? void 0 : teamData.length); i++) {
            const pName = teamData[i].name.trim();
            //handle weird edgecases of nba API
            let playerName = pName.replace(/ü/g, "u");
            if (playerName == 'P.J. Tucker') {
                playerName = 'PJ Tucker';
            }
            const position = teamData[i].pos.trim();
            const res = yield fetch(url + `players?search=${playerName}`);
            const d = yield res.json();
            if (!d.data || d.data.length == 0) {
                success = false;
                break;
            }
            console.log(d.data);
            let data = d.data[0].id;
            //HARD CODE for extreme edge case Error of nba API
            if (data == 448) {
                data = 3089;
            }
            //fetching season averages via player ID
            const res2 = yield fetch(url + `season_averages?player_ids[]=${data}`);
            const a = yield res2.json();
            const { pts: ppg, reb: rpg, ast: apg } = a.data[0];
            starters.push({ playerName, position, ppg, rpg, apg, rating: 50 });
        }
        return success ? starters : [];
    }
});
// const t = async () => {
//     const a = await getStarters('Raptors');
//     console.log(a);
// }
// t();
// const test = async () => {
//     try {
//         await prisma.player.deleteMany();
//         await prisma.team.deleteMany();
//         console.log("Teams deleted successfully");
//       } catch (error) {
//         console.error("Error deleting teams:", error);
//       }
// }
// test();
//# sourceMappingURL=test.js.map