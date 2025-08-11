const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(__dirname, 'data/2024FantasyTeamStats.csv');
const outputPath = path.join(__dirname, 'data/teamData.json');

const teams = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const safe = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
      };
    const teamName = row['Name']?.trim();
    const points = safe(row['PTS']);
    const QB = safe(row['QB']);
    const RB = safe(row['RB']);
    const WR = safe(row['WR']);
    const TE = safe(row['TE']);
    const runPercentage = safe(row['Run%']);
    const passPercentage = safe(row['Pass%']);

    //teams[team] = {'QB': QB, 'RB': RB, 'WR': WR, 'TE': TE, 'runPer': runPercentage, 'passPer': passPercentage };
    teams[teamName] = {points, QB, RB, WR, TE, runPercentage, passPercentage}
    // teams.push({
    //     teamName, points, QB, RB, WR, TE, runPercentage, passPercentage
    // });
  })
  .on('end', () => {
    console.log(`📊 Parsed ${teams.length} teams`);
    fs.writeFileSync(outputPath, JSON.stringify(teams, null, 2));
    console.log(`✅ Data saved to ${outputPath}`);
  });