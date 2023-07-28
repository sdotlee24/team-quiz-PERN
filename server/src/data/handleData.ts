import {Team} from "../types/teamInterface.js";
import { PrismaClient } from '@prisma/client';
import { scrapeLineUps } from "./scraper.js";

const prisma = new PrismaClient()

const url: string = "https://www.balldontlie.io/api/v1/";

const getTeams = async () => {
    try {
        const response = await fetch(url + "teams");
        if (!response.ok) {
            throw new Error("Api GET request failed")
        }
        const d = await response.json();
        const data: Team[] = d?.data;
        //prisma test
        // const user = await prisma.user.create({data: {email: "warriors", password: "nothing"}});
        // await prisma.team.deleteMany();
        

        data.forEach(async team => {
            //wait a couple seconds/minute before each batch of GET reqs, rate limit = 60/min

            const starters: any = await getStarters(team.full_name);

            await prisma.team.create({data: {teamName: team.full_name, conference: team.conference, Player: {
                createMany: {
                    data: starters
                }
            }}})

        });
    } catch (error) {
        console.log(error);
    }
}
//TODO: For input section on the frontend, to make it more robust (ex: GSW == warriors == golden state) utilize GPT's api


const getStarters = async (team: string) => {
    const teamInfo = await scrapeLineUps();
    const starters = [];
    const teamData = teamInfo?.find((t) => t.teamname.includes(team));
    console.log(teamData);

}



