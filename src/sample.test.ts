import axios from 'axios';
import * as fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

async function fetchAndSaveLottoNumber() {
    try {
        const response = await axios.get('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=859');
        const data = response.data;
        const drwNoDate = data.drwNoDate.replace(/[/\\?%*:|"<>]/g, '-'); // 파일명 안전하게 변경

        const fileName = `${drwNoDate}.json`;
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        console.log(`File saved as ${fileName}`);

        // Git commands to add, commit, and push the file
        await execPromise('git config --global user.name "github-actions[bot]"');
        await execPromise('git config --global user.email "github-actions[bot]@users.noreply.github.com"');
        await execPromise(`git add "${fileName}"`);
        await execPromise(`git commit -m "Add lotto number response file for ${drwNoDate}"`);

        // Git push using GitHub token
        const githubToken = process.env.GITHUB_TOKEN;
        await execPromise(`git push https://${githubToken}@github.com/kodaewon/TempAction.git`);
        console.log('File committed and pushed to the repository');
    } catch (error) {
        console.error('Error fetching lotto number:', error);
    }
}

test('fetchAndSaveLottoNumber should fetch data and save it to a file', async () => {
    await fetchAndSaveLottoNumber();
});