
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const filePath = path.join(__dirname, 'data/FantasyPros_Fantasy_Football_Points_PPR.csv');
const outputPath = path.join(__dirname, 'data/players.json');

const players = [];

const teamData = require('./data/teamData.json');
const playerProj = require('./data/projectionData.json');
const playerProjQB = require('./data/projectedQBData.json');
const playerADP = require('./data/playerADP.json')

fs.createReadStream(filePath)
  .pipe(csv())
  .on('data', (row) => {
    const name = row['Player']?.trim();
    const team = row['Team']?.trim();
    const position = row['Pos']?.trim().toUpperCase();
    if (!name || !team || !position || position === 'K' ) return;
    if (!playerADP[name] || playerADP[name]=='0'){
      return;
    }

    const weeklyPoints = [];

    const safe = (val) => {
      const n = parseFloat(val);
      return isNaN(n) ? 0 : n;
    };
    const adp = playerADP[name];
    const avgPoints = safe(row['AVG']);
    const totalPoints = safe(row['TTL']);
    const AVGSecondHalf = safe(row['AVGSecondHalf']);

  
    projection = playerProj[name];

    if(position == "QB"){
      projection = playerProjQB[name];
    }

    for (let i = 1; i <= 18; i++) {
      const raw = row[i.toString()];
      if (!raw || raw.toUpperCase() === 'BYE' || raw === '-' || raw.toUpperCase() === 'NA') {
        weeklyPoints.push(null);
      } else {
        const pts = parseFloat(raw);
        weeklyPoints.push(isNaN(pts) ? null : pts);
      }
    }

    if (teamData[team]) {
      if (position === 'QB') {
        opportunityScore = (((teamData[team]['passPercentage']) / 65) ** (1 / 3));
      } else if (position === 'RB') {
        opportunityScore = (((teamData[team]['runPercentage']) / 75) ** 1.5) +
                           (((teamData[team][position] / 34.4) ** 0.5) * (1 / 2.8));
      } else if (position === 'WR') {
        opportunityScore = (((teamData[team]['passPercentage']) / 87.53) ** 1.5) +
                           (((teamData[team][position] / 39.2) ** 0.5) * (1 / 2.8));
      } else if (position === 'TE') {
        opportunityScore = (((teamData[team]['runPercentage']) / 87.53) ** 1.5) +
                           (((teamData[team][position] / 16.9) ** 0.5) * (1 / 2.8));
      } else {
        opportunityScore = 0;
      }
    } else {
      console.warn(`⚠️ No team data found for team: ${team}`);
      opportunityScore = 0;
    }

    let expectedProj;
    if (position === 'QB') expectedProj = 430;
    else if (position === 'RB') expectedProj = 360;
    else if (position === 'WR') expectedProj = 400;
    else if (position === 'TE') expectedProj = 260;
    else expectedProj = 260;

    let expectedPoints;
    if (position === 'QB') expectedPoints = 20;
    else if (position === 'RB') expectedPoints = 16;
    else if (position === 'WR') expectedPoints = 16.5;
    else if (position === 'TE') expectedPoints = 11;
    else expectedPoints = 14;

    let expectedMaxAvg;
    if (position === 'QB') expectedMaxAvg = 26;
    else if (position === 'RB') expectedMaxAvg = 21;
    else if (position === 'WR') expectedMaxAvg = 22;
    else if (position === 'TE') expectedMaxAvg = 17;
    else expectedMaxAvg = 11;

    let gamesOverAvg = 0;
    let validGames = 0;

    for (const score of weeklyPoints) {
      if (score !== null) {
        if (score > expectedPoints){
          gamesOverAvg += 1
        }else{
          gamesOverAvg += (score/expectedPoints)**(1/.45);
        }
        
        validGames++;
      }
    }

    if (validGames < 7){
      return;
    }
    if (position === 'QB'){
      pointsRating = 20 * (avgPoints/expectedMaxAvg)**(2);
    }else{
      pointsRating = 20 * (avgPoints/expectedMaxAvg)**(1/2.5);
    }
    
    consistencyRating = 14 * (gamesOverAvg/validGames)
    riseRating = 16 * (AVGSecondHalf/26)**(1.2)
    opportunityScore = 2 * (opportunityScore)
    health = 13 * (validGames/17)**(1/3)
    projectionScore = 35 + (projection/expectedProj)**(.5);


      const SORINErating = (
      pointsRating +
      consistencyRating +
      riseRating +
      opportunityScore +
      health + 
      projectionScore
      );
      
      
    if (!isNaN(SORINErating)) {
      players.push({
        name,
        team,
        position,
        avgPoints,
        AVGSecondHalf,
        weeklyPoints,
        SORINErating,
        projection,
        adp
      });
    } else {
      console.log(`⚠️ Skipping ${name} due to completely invalid data`);
    }
  })
  .on('end', () => {
    console.log(`📊 Parsed ${players.length} players`);
    fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
    console.log(`✅ Data saved to ${outputPath}`);
  });
