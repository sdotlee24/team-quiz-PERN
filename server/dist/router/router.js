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
exports.quizRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const router = express_1.default.Router();
exports.quizRouter = router;
router.use(express_1.default.json());
router.get("/quiz", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //get random team, and their starter info
    const count = yield prisma.team.count();
    const ranIndex = Math.floor(Math.random() * count);
    const team = yield prisma.team.findFirst({
        skip: ranIndex
    });
    const teamID = team === null || team === void 0 ? void 0 : team.id;
    const players = yield prisma.player.findMany({
        where: {
            teamId: teamID
        }
    });
    const choices = ['ppg', 'apg', 'rpg'];
    const stats = [];
    const choice = choices[Math.floor(Math.random() * 3)];
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        stats.push(player[choice]);
    }
    res.json({
        name: team === null || team === void 0 ? void 0 : team.teamName,
        conf: team === null || team === void 0 ? void 0 : team.conference,
        stats,
        choice: choice
    });
}));
router.post('/guess', (req, res) => {
    const { guess, name } = req.body;
    console.log(guess, name);
});
//# sourceMappingURL=router.js.map