import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const router = express.Router();
router.use(express.json());

router.get("/quiz", async (req, res) => {
    //get random team, and their starter info
    const count = await prisma.team.count();
    const ranIndex = Math.floor(Math.random() * count);
    const team = await prisma.team.findFirst({
        skip: ranIndex
    })
    const teamID = team?.id;
    const players = await prisma.player.findMany({
        where: {
            teamId: teamID
        }
    })
    const choices = ['ppg', 'apg', 'rpg'];
    const stats = []
    const choice = choices[Math.floor(Math.random() * 3)];
    for (let i = 0; i < players.length; i++) {
        const player = players[i] as { [key: string]: any };
        stats.push(player[choice])
    }
  
    res.json({
        name: team?.teamName,
        conf: team?.conference,
        stats,
        choice: choice
    });
    
})

router.post('/guess', (req, res) => {
    const {guess, name} = req.body;
    console.log(guess, name);


})





export {router as quizRouter}