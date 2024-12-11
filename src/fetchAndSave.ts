import axios from 'axios'
import * as fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function fetchAndSaveLottoNumber() {
    try {
        const reponse = await axios.get('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=856');
        const data = reponse.data;
        const drwNoDate = data.drwNoDate.replace(/[/\\?%*:|"<>]/g, '-');
        const fileName = `${drwNoDate}.json`;

        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));

        console.log(`File saved as ${fileName}`);

        await execPromise('git config --global user.name "github-actions[bot]"');
        await execPromise('git config --global user.email "github-actions[bot]@users.noreply.github.com"');
        await execPromise(`git add "${fileName}"`);
        await execPromise(`git commit -m "Add lotto number response file for ${drwNoDate}"`);
        const githubToken = process.env.GITHUB_TOKEN;
        await execPromise(`git push https://${githubToken}@github.com/your-username/your-repo.git`);
        console.log('File committed and pushed to the repository');
    } catch (error) {
        console.error('Error fetching lotto number:', error);
    }
}

fetchAndSaveLottoNumber();