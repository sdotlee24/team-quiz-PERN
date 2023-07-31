import { scrapeLineUps } from "./scraper";
import {Team} from "../types/teamInterface.js";
import { PrismaClient } from '@prisma/client';

process.setMaxListeners(50);
const prisma = new PrismaClient();

const url: string = "https://www.balldontlie.io/api/v1/";

async function delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  }
const getTeams = async () => {
    try {
        const response = await fetch(url + "teams");
        if (!response.ok) {
            throw new Error("Api GET request failed")
        }
        const d = await response.json();
        const data: Team[] = d?.data;

        for (let i = 0; i < data.length; i++) {
            //wait a couple seconds/minute before each batch of GET reqs, rate limit = 60/min
            await delay(20000);
            const team = data[i];
            const starters: any = await getStarters(team.name);
            if (!starters || starters.length == 0) {
                continue;
            }
            try {
                await prisma.team.create({data: {teamName: team.full_name, conference: team.conference, Player: {
                    createMany: {
                        data: starters
                    }}}})
            } catch (error) {
                console.log(error);
                continue;

            }
            
            

        };
    } catch (error) {
        console.log(error);
    }
}


const getStarters = async (team: string) => {
    const teamInfo = await scrapeLineUps();
    const starters = [];
    const teamData = teamInfo?.find((t) => t.team.includes(team))?.starterData;
    let success = true;
    if (teamData) {
        for (let i = 0; i < teamData?.length; i++) {
            const pName = teamData[i].name.trim();
            //handle weird edgecases of nba API
            let playerName = pName.replace(/ü/g, "u");
            if (playerName == 'P.J. Tucker') {
                playerName = 'PJ Tucker';
            }
            const position = teamData[i].pos.trim();
            const res = await fetch(url + `players?search=${playerName}`);
            const d = await res.json();
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
            const res2 = await fetch(url + `season_averages?player_ids[]=${data}`);
            const a = await res2.json();
            const {pts: ppg, reb: rpg, ast: apg} = a.data[0];
            starters.push({ playerName, position, ppg, rpg, apg, rating: 50});
        }
        
        return success? starters : [] 
    }
}



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
