import puppeteer from 'puppeteer'
import { start } from 'repl';


export const scrapeLineUps = async () => {
    const browser = await puppeteer.launch({headless: "new"});
    try {
        const page = await browser.newPage();
        await page.goto("https://www.lineups.com/nba/lineups");
        const starters = await page.evaluate(() => {
            const teams = Array.from(document.querySelectorAll('.t-stripped tbody'));
            const data = teams.map((team: any) => {
                const teamname = team.querySelector('.t-header span').innerHTML;
                const starters = Array.from(team.querySelectorAll('.t-content'));
                const starterData = starters.map((starter: any) => ({
                    pos: starter.querySelector('td').innerHTML,
                    name: starter.querySelector('.long-player-name').innerHTML
                }));
                return {team: teamname, starterData};
            })

            return data
        })
        await browser.close();
        return starters;
    } catch (err) {
        console.log(err);
    }
}

scrapeLineUps();