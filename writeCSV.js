import * as fs from 'fs/promises';

const directoryReset = async () => {
  await fs.rm("csv", { recursive: true, force: true });
  await fs.mkdir("csv");
}

const leagueStandingProgression = async (entryIdToNameMap, currentGameweek, gameweekRanks) => {
  let firstRow = '';
  for (let gw = 0; gw <= currentGameweek; gw++) {
    if (gw == 0) {
      firstRow += 'Gameweek'
    } else {
      firstRow += gw;
    }
    if (gw < currentGameweek)
      firstRow += ',';
  }
  firstRow += '\n';
  await fs.appendFile('./csv/leagueStandingProgression.csv', firstRow);

  for (let entry in gameweekRanks) {
    let content = entryIdToNameMap[entry];
    content += ',';
    for (let gw = 0; gw < currentGameweek; gw++) {
      content += gameweekRanks[entry][gw];
      if (gw < currentGameweek - 1)
        content += ',';
    }
    if (entry != Object.keys(gameweekRanks)[Object.keys(gameweekRanks).length - 1])
      content += '\n';
    await fs.appendFile('./csv/leagueStandingProgression.csv', content);
  }
}

const headToHeadRecords = async (entryIdToNameMap, records) => {
  let firstRow = ',';
  for (let entry in entryIdToNameMap) {
    firstRow += entryIdToNameMap[entry];
    let thing = Object.keys(entryIdToNameMap)[Object.keys(entryIdToNameMap).length - 1];
    if (entry != Object.keys(entryIdToNameMap)[Object.keys(entryIdToNameMap).length - 1])
      firstRow += ',';
  }
  firstRow += '\n';
  await fs.appendFile('./csv/headToHeadRecords.csv', firstRow);

  for (let entry in records) {
    let content = entryIdToNameMap[entry];
    content += ',';
    for (let record in records[entry]) {
      content += records[entry][record]['W'];
      content += '-';
      content += records[entry][record]['D'];
      content += '-';
      content += records[entry][record]['L'];
      if (record != Object.keys(records[entry])[Object.keys(records[entry]).length - 1])
        content += ',';
    }
    if (entry != Object.keys(records)[Object.keys(records).length - 1])
      content += '\n';
    await fs.appendFile('./csv/headToHeadRecords.csv', content);
  }
}

const totalScoreProgression = async (entryIdToNameMap, currentGameweek, totalScores) => {
  let firstRow = '';
  for (let gw = 0; gw <= currentGameweek; gw++) {
    if (gw == 0) {
      firstRow += 'Gameweek'
    } else {
      firstRow += gw;
    }
    if (gw < currentGameweek)
      firstRow += ',';
  }
  firstRow += '\n';
  await fs.appendFile('./csv/totalScoreProgression.csv', firstRow);

  for (let entry in totalScores) {
    let content = entryIdToNameMap[entry];
    content += ',';
    for (let gw in totalScores[entry]) {
      content += totalScores[entry][gw];
      if (gw < currentGameweek - 1)
        content += ',';
    }
    if (entry != Object.keys(totalScores)[Object.keys(totalScores).length - 1])
      content += '\n';
    await fs.appendFile('./csv/totalScoreProgression.csv', content);
  }
}

const totalScoreAvgDiffProgression = async (entryIdToNameMap, currentGameweek, totalScoreAvgDiff) => {
  let firstRow = '';
  for (let gw = 0; gw <= currentGameweek; gw++) {
    if (gw == 0) {
      firstRow += 'Gameweek'
    } else {
      firstRow += gw;
    }
    if (gw < currentGameweek)
      firstRow += ',';
  }
  firstRow += '\n';
  await fs.appendFile('./csv/totalScoreAvgDiffProgression.csv', firstRow);

  for (let entry in totalScoreAvgDiff) {
    let content = entryIdToNameMap[entry];
    content += ',';
    for (let gw in totalScoreAvgDiff[entry]) {
      content += totalScoreAvgDiff[entry][gw];
      if (gw < currentGameweek - 1)
        content += ',';
    }
    if (entry != Object.keys(totalScoreAvgDiff)[Object.keys(totalScoreAvgDiff).length - 1])
      content += '\n';
    await fs.appendFile('./csv/totalScoreAvgDiffProgression.csv', content);
  }
}

const bestPlayersPerManager = async (bestPlayersPerManager) => {
  let firstRow = 'Rank,';
  for (let entry in bestPlayersPerManager) {
    firstRow += entry;
    if (entry != Object.keys(bestPlayersPerManager)[Object.keys(bestPlayersPerManager).length - 1]) {
      firstRow += ','
    } else {
      firstRow += '\n'
    }
  }
  await fs.appendFile('./csv/bestPlayersPerManager.csv', firstRow);

  let longestList = 0;
  for (let entry in bestPlayersPerManager) {
    if (longestList < bestPlayersPerManager[entry].length)
      longestList = bestPlayersPerManager[entry].length;
  }
  for (let rank = 1; rank <= longestList; rank++) {
    let content = rank;
    content += ',';
    for (let entry in bestPlayersPerManager) {
      if (rank <= bestPlayersPerManager[entry].length) {
        content += bestPlayersPerManager[entry][rank - 1]['elementName'];
        content += ' - ';
        content += bestPlayersPerManager[entry][rank - 1]['points'];
      }
      if (entry != Object.keys(bestPlayersPerManager)[Object.keys(bestPlayersPerManager).length - 1]) {
        content += ',';
      } else {
        if (rank < longestList)
          content += '\n';
      }
    }
    await fs.appendFile('./csv/bestPlayersPerManager.csv', content);
  }
}

const bestClubsPerManager = async (bestClubsPerManager) => {
  let firstRow = 'Rank,';
  for (let entry in bestClubsPerManager) {
    firstRow += entry;
    if (entry != Object.keys(bestClubsPerManager)[Object.keys(bestClubsPerManager).length - 1]) {
      firstRow += ','
    } else {
      firstRow += '\n'
    }
  }
  await fs.appendFile('./csv/bestClubsPerManager.csv', firstRow);

  let longestList = 0;
  for (let entry in bestClubsPerManager) {
    if (longestList < bestClubsPerManager[entry].length)
      longestList = bestClubsPerManager[entry].length;
  }
  for (let rank = 1; rank <= longestList; rank++) {
    let content = rank;
    content += ',';
    for (let entry in bestClubsPerManager) {
      if (rank <= bestClubsPerManager[entry].length) {
        content += bestClubsPerManager[entry][rank - 1]['name'];
        content += ' - ';
        content += bestClubsPerManager[entry][rank - 1]['points'];
      }
      if (entry != Object.keys(bestClubsPerManager)[Object.keys(bestClubsPerManager).length - 1]) {
        content += ',';
      } else {
        if (rank < longestList)
          content += '\n';
      }
    }
    await fs.appendFile('./csv/bestClubsPerManager.csv', content);
  }
}

const bestPlayersOverall = async (bestPlayersOverall) => {
  let firstRow = 'Rank,Name,Points,Appearances,Goals,Assists,Clean Sheets,Saves,Bonus\n';
  await fs.appendFile('./csv/bestPlayersOverall.csv', firstRow);

  let rank = 1;
  let stats = ['elementName', 'points', 'appearances', 'goals',
    'assists', 'clean_sheets', 'saves', 'bonus'];
  for (let element in bestPlayersOverall) {
    let content = rank;
    for (let stat of stats) {
      content += ',';
      content += bestPlayersOverall[element][stat];
    }
    if (element != Object.keys(bestPlayersOverall)[Object.keys(bestPlayersOverall).length - 1]) {
      content += '\n';
    }
    rank++;
    await fs.appendFile('./csv/bestPlayersOverall.csv', content);
  }
}

const bestManagersByPosition = async (leagueEntries, bestManagersByPosition) => {
  let firstRow = 'Rank,';
  for (let position in bestManagersByPosition) {
    firstRow += position;
    if (position != Object.keys(bestManagersByPosition)[Object.keys(bestManagersByPosition).length - 1]) {
      firstRow += ','
    } else {
      firstRow += '\n'
    }
  }
  await fs.appendFile('./csv/bestManagersByPosition.csv', firstRow);

  let positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward']
  for (let rank = 1; rank <= leagueEntries.length; rank++) {
    let content = rank;
    for (let position of positions) {
      content += ',';
      content += bestManagersByPosition[position][rank - 1]['name'];
      content += ' - ';
      content += bestManagersByPosition[position][rank - 1]['points'];
      if (position == positions[positions.length - 1]) {
        content += '\n';
      }
    }
    await fs.appendFile('./csv/bestManagersByPosition.csv', content);
  }
}

const bestManagersByAction = async (leagueEntries, bestManagersByAction) => {
  let firstRow = 'Rank,';
  for (let action in bestManagersByAction) {
    firstRow += action;
    if (action != Object.keys(bestManagersByAction)[Object.keys(bestManagersByAction).length - 1]) {
      firstRow += ','
    } else {
      firstRow += '\n'
    }
  }
  await fs.appendFile('./csv/bestManagersByAction.csv', firstRow);

  for (let rank = 1; rank <= leagueEntries.length; rank++) {
    let content = rank;
    for (let action in bestManagersByAction) {
      content += ',';
      content += bestManagersByAction[action][rank - 1]['name'];
      content += ' - ';
      content += bestManagersByAction[action][rank - 1]['points'];
      if (action == Object.keys(bestManagersByAction)[Object.keys(bestManagersByAction).length - 1]) {
        content += '\n';
      }
    }
    await fs.appendFile('./csv/bestManagersByAction.csv', content);
  }
}

const mostTransfersByManager = async (mostTransfersByManager) => {
  let firstRow = 'Name,TotalTransfers,SuccessfulWaivers,FreeTransfers,DeniedWaivers,BackupWaivers';
  firstRow += '\n';
  await fs.appendFile('./csv/mostTransfersByManager.csv', firstRow);
  for (let manager of mostTransfersByManager ) {
    let content = manager['name'];
    content += ',';
    content += manager['total_transfers'];
    content += ',';
    content += manager['successful_waivers'];
    content += ',';
    content += manager['free_transfers'];
    content += ',';
    content += manager['denied_waivers'];
    content += ',';
    content += manager['backup_waivers'];
    if (manager != Object.keys(mostTransfersByManager)[Object.keys(mostTransfersByManager).length - 1]) {
      content += '\n';
    }
    await fs.appendFile('./csv/mostTransfersByManager.csv', content);
  }
}

const mostTransferredPlayers = async (mostTransferredPlayers) => {
  let firstRow = 'Name,TeamsPlayedFor,SuccessfulTransfers';
  firstRow += '\n';
  await fs.appendFile('./csv/mostTransferredPlayers.csv', firstRow);
  for (let player of mostTransferredPlayers ) {
    let content = player['name'];
    content += ',';
    content += player['unique_transfers'];
    content += ',';
    content += player['successful_transfers'];
    if (player != Object.keys(mostTransferredPlayers)[Object.keys(mostTransferredPlayers).length - 1]) {
      content += '\n';
    }
    await fs.appendFile('./csv/mostTransferredPlayers.csv', content);
  }
}


export {
  directoryReset,
  leagueStandingProgression,
  headToHeadRecords,
  totalScoreProgression,
  totalScoreAvgDiffProgression,
  bestPlayersPerManager,
  bestClubsPerManager,
  bestPlayersOverall,
  bestManagersByPosition,
  bestManagersByAction,
  mostTransfersByManager,
  mostTransferredPlayers
};