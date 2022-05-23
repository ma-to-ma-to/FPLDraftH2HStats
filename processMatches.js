import * as client from './client.js';
import * as writeCSV from './writeCSV.js';


const run = async (leagueId) => {

  const gameStatus = await client.getGameStatus();
  const currentGameweek = gameStatus.current_event;

  const leagueData = await client.getLeagueData(leagueId);
  const leagueEntries = leagueData.league_entries;
  const matches = leagueData.matches;

  console.log("Data pulled for processMatches.");

  // // below variable is potentially useful because it can differentiate
  // // in-progress gameweek results from previous gameweek results
  // const isFinished = gameStatus.current_event_finished;

  let idToNameMap = {};
  for (let entry of leagueEntries) {
    idToNameMap[entry.id] = entry.player_first_name;
  }

  let order = 0;
  let entryOrderMap = {};
  for (let entry of leagueEntries) {
    entryOrderMap[entry.id] = order;
    order++;
  }

  let leaguePointSums = {};
  for (let entry of leagueEntries) {
    leaguePointSums[entry.id] = [];
  }

  let h2hRecords = {};
  for (let entry1 of leagueEntries) {
    h2hRecords[entry1.id] = {};
    for (let entry2 of leagueEntries) {
      h2hRecords[entry1.id][entry2.id] = {
        'W': 0,
        'D': 0,
        'L': 0,
      }
    }
  }

  let totalScores = {};
  for (let entry of leagueEntries) {
    totalScores[entry.id] = [];
  }

  let gameweekStandings = [];
  for (let i = 0; i < currentGameweek; i++) {
    gameweekStandings[i] = [];
  }

  let gameweekRanks = {};
  for (let entry in leagueEntries) {
    gameweekRanks[leagueEntries[entry].id] = [];
  }

  let gameweekTracker = 1;
  let allScores = [];

  const addToLeagueEntries = (player, result) => {
    const sumCount = leaguePointSums[player].length;
    if (sumCount == 0) {
      leaguePointSums[player].push(result);
    } else {
      leaguePointSums[player].push(result + leaguePointSums[player][sumCount - 1]);
    }
  }

  const tallyW = (player1, player2) => {
    h2hRecords[player1][player2]['W']++;
    h2hRecords[player1][player1]['W']++;
  }

  const tallyD = (player1, player2) => {
    h2hRecords[player1][player2]['D']++;
    h2hRecords[player1][player1]['D']++;
  }

  const tallyL = (player1, player2) => {
    h2hRecords[player1][player2]['L']++;
    h2hRecords[player1][player1]['L']++;
  }

  const addToTotalScores = (player, score) => {
    const sumCount = totalScores[player].length;
    if (sumCount == 0) {
      totalScores[player].push(score);
    } else {
      totalScores[player].push(score + totalScores[player][sumCount - 1]);
    }
  }

  const addToAllScores = (result, gameweek) => {
    const sumCount = allScores.length;
    if (sumCount == 0) {
      allScores.push(result);
    } else if (gameweek == gameweekTracker) {
      allScores[gameweek - 1] = result + allScores[gameweek - 1];
    } else {
      allScores.push(result + allScores[sumCount - 1]);
      gameweekTracker++;
    }
  }

  const addToGameweekStandings = (gameweek, id, name, leaguePoints, totalScore) => {
    gameweekStandings[gameweek - 1].push({
      "id": id,
      "name": name,
      "points": leaguePoints,
      "totalScore": totalScore,
    });
  }

  for (let match of matches) {
    let gameweek = match.event;
    let player1 = match.league_entry_1;
    let player2 = match.league_entry_2;
    let player1Score = match.league_entry_1_points;
    let player2Score = match.league_entry_2_points;

    if (gameweek > currentGameweek) break;

    if (player1Score == player2Score) {
      addToLeagueEntries(player1, 1);
      addToLeagueEntries(player2, 1);
      tallyD(player1, player2);
      tallyD(player2, player1);
    }

    if (player1Score > player2Score) {
      addToLeagueEntries(player1, 3);
      addToLeagueEntries(player2, 0);
      tallyW(player1, player2);
      tallyL(player2, player1);
    }

    if (player1Score < player2Score) {
      addToLeagueEntries(player1, 0);
      addToLeagueEntries(player2, 3);
      tallyL(player1, player2);
      tallyW(player2, player1);
    }

    addToTotalScores(player1, player1Score);
    addToTotalScores(player2, player2Score);
    addToAllScores(player1Score, gameweek);
    addToAllScores(player2Score, gameweek);

    addToGameweekStandings(
      gameweek,
      player1,
      idToNameMap[player1],
      leaguePointSums[player1][gameweek - 1],
      totalScores[player1][gameweek - 1]
    );
    addToGameweekStandings(
      gameweek,
      player2,
      idToNameMap[player2],
      leaguePointSums[player2][gameweek - 1],
      totalScores[player2][gameweek - 1]
    );
  }

  gameweekStandings.forEach((standing) => {
    standing.sort((teamA, teamB) =>
      teamB.points - teamA.points || teamB.totalScore - teamA.totalScore
    );
    let rank = 1;
    standing.forEach((entry) => {
      gameweekRanks[entry.id].push(rank);
      rank++;
    });
  });

  let totalScoreAvgDiff = {};
  for (let entry of leagueEntries) {
    totalScoreAvgDiff[entry.id] = [];
  }

  for (let entry in totalScores) {
    let j = 0;
    for (let gw in totalScores[entry]) {
      let average = allScores[j] / 8;
      totalScoreAvgDiff[entry].push(totalScores[entry][gw] - average);
      j++;
    }
  }

  console.log("Data processed for processMatches.");

  await writeCSV.leagueStandingProgression(idToNameMap, currentGameweek, gameweekRanks);
  await writeCSV.headToHeadRecords(idToNameMap, h2hRecords);
  await writeCSV.totalScoreProgression(idToNameMap, currentGameweek, totalScores);
  await writeCSV.totalScoreAvgDiffProgression(idToNameMap, currentGameweek, totalScoreAvgDiff);

  console.log("CSVs generated for processMatches.");

}

export { run };