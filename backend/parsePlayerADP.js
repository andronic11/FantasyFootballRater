const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(__dirname, 'data/PlayerADP.csv');
const outputPath = path.join(__dirname, 'data/playerADP.json');

const players = {};

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const safe = (val) => {
        const n = parseFloat(val);
        return isNaN(n) ? 0 : n;
      };
    const player = row['Player']?.trim();
    const ADP = safe(row['ESPN']);
    players[player] = ADP;
  })
  .on('end', () => {
    console.log(`📊 Parsed ${players.length} players`);
    fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
    console.log(`✅ Data saved to ${outputPath}`);
  });