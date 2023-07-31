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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeLineUps = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const scrapeLineUps = () => __awaiter(void 0, void 0, void 0, function* () {
    const browser = yield puppeteer_1.default.launch({ headless: "new" });
    try {
        const page = yield browser.newPage();
        yield page.goto("https://www.lineups.com/nba/lineups");
        const starters = yield page.evaluate(() => {
            const teams = Array.from(document.querySelectorAll('.t-stripped tbody'));
            const data = teams.map((team) => {
                const teamname = team.querySelector('.t-header span').innerHTML;
                const starters = Array.from(team.querySelectorAll('.t-content'));
                const starterData = starters.map((starter) => ({
                    pos: starter.querySelector('td').innerHTML,
                    name: starter.querySelector('.long-player-name').innerHTML
                }));
                return { team: teamname, starterData };
            });
            return data;
        });
        yield browser.close();
        return starters;
    }
    catch (err) {
        console.log(err);
    }
});
exports.scrapeLineUps = scrapeLineUps;
//# sourceMappingURL=scraper.js.map