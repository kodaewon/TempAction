import axios from 'axios';
import * as fs from 'fs';
import { execSync } from 'child_process';

async function fetchAndSaveLottoNumber() {
    try {
        const response = await axios.get('https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=861');
        const data = response.data;
        const drwNoDate = data.drwNoDate;

        const fileName = `${drwNoDate}.json`;
        fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
        console.log(`File saved as ${fileName}`);

        // Git commands to add, commit, and push the file
        execSync('git config --global user.name "github-actions[bot]"');
        execSync('git config --global user.email "github-actions[bot]@users.noreply.github.com"');
        execSync(`git add ${fileName}`);
        execSync(`git commit -m "Add lotto number response file for ${drwNoDate}"`);
        execSync('git push');
        console.log('File committed and pushed to the repository');
    } catch (error) {
        console.error('Error fetching lotto number:', error);
    }
}

fetchAndSaveLottoNumber();