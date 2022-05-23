import * as client from './client.js';
import * as writeCSV from './writeCSV.js';

const run = async (leagueId) => {

  const gameStatus = await client.getGameStatus();
  const currentGameweek = gameStatus.current_event;

  const elementAndTeamInfo = await client.getElementInfo();
  const elementInfo = elementAndTeamInfo.elements;
  const elementTypes = elementAndTeamInfo.element_types;
  const teamInfo = elementAndTeamInfo.teams;

  const leagueData = await client.getLeagueData(leagueId);
  const leagueEntries = leagueData.league_entries;

  console.log("Base data pulled for processPointBreakdowns.");

  let entryIdToNameMap = {};
  for (var entry of leagueEntries) {
    entryIdToNameMap[entry.entry_id] = entry.player_first_name;
  }

  const entryTotalsPerElement = {};
  const entryTotalsPerTeam = {};
  for (let entry of leagueEntries) {
    entryTotalsPerElement[entry.entry_id] = {};
    entryTotalsPerTeam[entry.entry_id] = {};
  }

  const elementTotals = {};

  const positionTotalsPerEntry = {
    1: {},
    2: {},
    3: {},
    4: {}
  };

  const actionTotalsPerEntry = {
    'minutes': {},
    'goals': {},
    'assists': {},
    'clean_sheets': {},
    'saves': {},
    'penalty_saves': {},
    'bonus': {},
    'goals_conceded': {},
    'own_goals': {},
    'penalty_misses': {},
    'yellow_cards': {},
    'red_cards': {}
  };

  console.log("Starting detailed data pulls for processPointBreakdowns - this will take some time...");

  for (let gameweek = 1; gameweek <= currentGameweek; gameweek++) {
    const elementStats = await client.getElementStats(gameweek);
    for (let entry in leagueEntries) {
      let entryId = leagueEntries[entry].entry_id;
      let teamPicks = await client.getEntryPicks(entryId, gameweek);
      for (let element = 0; element < 11; element++) {
        let elementId = teamPicks[element].element;
        if (!(elementId in entryTotalsPerElement[entryId])) {
          entryTotalsPerElement[entryId][elementId] = {
            'id': elementInfo[elementId - 1]['id'],
            'elementName': elementInfo[elementId - 1]['web_name'],
            'team': elementInfo[elementId - 1]['team'],
            'position': elementInfo[elementId - 1]['element_type'],
            'points': elementStats[elementId]['stats']['total_points'],
            'appearances': elementStats[elementId]['stats']['minutes'] > 0
              ? 1
              : 0,
            'goals': elementStats[elementId]['stats']['goals_scored'],
            'assists': elementStats[elementId]['stats']['assists'],
            'clean_sheets': elementStats[elementId]['stats']['clean_sheets'],
            'saves': elementStats[elementId]['stats']['saves'],
            'bonus': elementStats[elementId]['stats']['bonus'],
          }
        } else {
          entryTotalsPerElement[entryId][elementId].points
            += elementStats[elementId]['stats']['total_points'];
          entryTotalsPerElement[entryId][elementId].appearances
            += elementStats[elementId]['stats']['minutes'] > 0
              ? 1
              : 0;
          entryTotalsPerElement[entryId][elementId].goals
            += elementStats[elementId]['stats']['goals_scored'];
          entryTotalsPerElement[entryId][elementId].assists
            += elementStats[elementId]['stats']['assists'];
          entryTotalsPerElement[entryId][elementId].clean_sheets
            += elementStats[elementId]['stats']['clean_sheets'];
          entryTotalsPerElement[entryId][elementId].saves
            += elementStats[elementId]['stats']['saves'];
          entryTotalsPerElement[entryId][elementId].bonus
            += elementStats[elementId]['stats']['bonus'];
        }
        let teamId = elementInfo[elementId - 1]['team'];
        if (!(teamId in entryTotalsPerTeam[entryId])) {
          entryTotalsPerTeam[entryId][teamId] = {
            'name': teamInfo[teamId - 1].name,
            'points': elementStats[elementId]['stats']['total_points'],
          }
        } else {
          entryTotalsPerTeam[entryId][teamId]['points']
            += elementStats[elementId]['stats']['total_points'];
        }
        if (!(elementId in elementTotals)) {
          elementTotals[elementId] = {
            'id': elementInfo[elementId - 1]['id'],
            'elementName': elementInfo[elementId - 1]['web_name'],
            'team': elementInfo[elementId - 1]['team'],
            'position': elementInfo[elementId - 1]['element_type'],
            'points': elementStats[elementId]['stats']['total_points'],
            'appearances': elementStats[elementId]['stats']['minutes'] > 0
              ? 1
              : 0,
            'goals': elementStats[elementId]['stats']['goals_scored'],
            'assists': elementStats[elementId]['stats']['assists'],
            'clean_sheets': elementStats[elementId]['stats']['clean_sheets'],
            'saves': elementStats[elementId]['stats']['saves'],
            'bonus': elementStats[elementId]['stats']['bonus'],
          }
        } else {
          elementTotals[elementId].points
            += elementStats[elementId]['stats']['total_points'];
          elementTotals[elementId].appearances
            += elementStats[elementId]['stats']['minutes'] > 0
              ? 1
              : 0;
          elementTotals[elementId].goals
            += elementStats[elementId]['stats']['goals_scored'];
          elementTotals[elementId].assists
            += elementStats[elementId]['stats']['assists'];
          elementTotals[elementId].clean_sheets
            += elementStats[elementId]['stats']['clean_sheets'];
          elementTotals[elementId].saves
            += elementStats[elementId]['stats']['saves'];
          elementTotals[elementId].bonus
            += elementStats[elementId]['stats']['bonus'];
        }
        let positionId = elementInfo[elementId - 1]['element_type'];
        if (!(entryId in positionTotalsPerEntry[positionId])) {
          positionTotalsPerEntry[positionId][entryId]
            = elementStats[elementId]['stats']['total_points'];
        } else {
          positionTotalsPerEntry[positionId][entryId]
            += elementStats[elementId]['stats']['total_points'];
        }
        for (let action of Object.keys(actionTotalsPerEntry)) {
          if (!(entryId in actionTotalsPerEntry[action])) {
            switch (action) {
              case 'minutes':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['minutes'] > 0
                    ? (elementStats[elementId]['stats']['minutes'] > 59
                      ? 2
                      : 1)
                    : 0;
                break;
              case 'goals':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['goals_scored'] * (8 - positionId);
                break;
              case 'assists':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['assists'] * 3;
                break;
              case 'clean_sheets':
                actionTotalsPerEntry[action][entryId] = positionId < 3
                  ? elementStats[elementId]['stats']['clean_sheets'] * 4
                  : positionId == 3
                    ? elementStats[elementId]['stats']['clean_sheets']
                    : 0;
                break;
              case 'saves':
                actionTotalsPerEntry[action][entryId]
                  = Math.floor(elementStats[elementId]['stats']['saves'] / 3);
                break;
              case 'penalty_saves':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['penalties_saved'] * 5;
                break;
              case 'bonus':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['bonus'];
                break;
              case 'goals_conceded':
                actionTotalsPerEntry[action][entryId] = positionId < 3
                  ? -1 * Math.floor(elementStats[elementId]['stats']['goals_conceded'] / 2)
                  : 0;
                break;
              case 'own_goals':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['own_goals'] * -2;
                break;
              case 'penalty_misses':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['penalties_missed'] * -2;
                break;
              case 'yellow_cards':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['yellow_cards'] * -1;
                break;
              case 'red_cards':
                actionTotalsPerEntry[action][entryId]
                  = elementStats[elementId]['stats']['red_cards'] * -3;
                break;
            }
          } else {
            switch (action) {
              case 'minutes':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['minutes'] > 0
                    ? (elementStats[elementId]['stats']['minutes'] > 59
                      ? 2
                      : 1)
                    : 0;
                break;
              case 'goals':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['goals_scored'] * (8 - positionId);
                break;
              case 'assists':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['assists'] * 3;
                break;
              case 'clean_sheets':
                actionTotalsPerEntry[action][entryId]
                  += positionId < 3
                    ? elementStats[elementId]['stats']['clean_sheets'] * 4
                    : positionId == 3
                      ? elementStats[elementId]['stats']['clean_sheets']
                      : 0;
                break;
              case 'saves':
                actionTotalsPerEntry[action][entryId]
                  += Math.floor(elementStats[elementId]['stats']['saves'] / 3);
                break;
              case 'penalty_saves':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['penalties_saved'] * 5;
                break;
              case 'bonus':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['bonus'];
                break;
              case 'goals_conceded':
                actionTotalsPerEntry[action][entryId]
                  += positionId < 3
                    ? -1 * Math.floor(elementStats[elementId]['stats']['goals_conceded'] / 2)
                    : 0;
                break;
              case 'own_goals':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['own_goals'] * -2;
                break;
              case 'penalty_misses':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['penalties_missed'] * -2;
                break;
              case 'yellow_cards':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['yellow_cards'] * -1;
                break;
              case 'red_cards':
                actionTotalsPerEntry[action][entryId]
                  += elementStats[elementId]['stats']['red_cards'] * -3;
                break;
            }
          }
        }
      }
    }
    console.log("Pulled and processed data for gameweek " + gameweek);
  }

  const bestPlayersPerManager = {};
  for (let entry in entryTotalsPerElement) {
    let tempArray = [];
    for (let element in entryTotalsPerElement[entry]) {
      tempArray.push(entryTotalsPerElement[entry][element]);
    }
    bestPlayersPerManager[entryIdToNameMap[entry]] = tempArray.sort((elementA, elementB) =>
      elementB.points - elementA.points || elementB.appearances - elementA.appearances)
  }

  const bestClubsPerManager = {};
  for (let entry in entryTotalsPerTeam) {
    let tempArray = [];
    for (let element in entryTotalsPerTeam[entry]) {
      tempArray.push(entryTotalsPerTeam[entry][element]);
    }
    bestClubsPerManager[entryIdToNameMap[entry]] = tempArray.sort((elementA, elementB) =>
      elementB.points - elementA.points || elementB.appearances - elementA.appearances)
  }

  const bestPlayersOverall = [];
  for (let entry in elementTotals) {
    bestPlayersOverall.push(elementTotals[entry]);
  }
  bestPlayersOverall.sort((elementA, elementB) =>
    elementB.points - elementA.points || elementB.appearances - elementA.appearances);

  const bestManagersByPosition = {};
  for (let position in positionTotalsPerEntry) {
    let tempArray = Object.entries(positionTotalsPerEntry[position])
      .sort((entryA, entryB) => entryB[1] - entryA[1]);
    bestManagersByPosition[elementTypes[parseInt(position) - 1]['singular_name']] = [];
    for (let entry of tempArray) {
      bestManagersByPosition[elementTypes[parseInt(position) - 1]['singular_name']].push({
        'name': entryIdToNameMap[entry[0]],
        'points': entry[1]
      });
    }
  }

  const bestManagersByAction = {};
  for (let action in actionTotalsPerEntry) {
    let tempArray = Object.entries(actionTotalsPerEntry[action])
      .sort((entryA, entryB) => entryB[1] - entryA[1]);
    bestManagersByAction[action] = [];
    for (let entry of tempArray) {
      bestManagersByAction[action].push({
        'name': entryIdToNameMap[entry[0]],
        'points': entry[1]
      });
    }
  }

  console.log("Data processed for processPointBreakdowns.");

  await writeCSV.bestPlayersPerManager(bestPlayersPerManager);
  await writeCSV.bestClubsPerManager(bestClubsPerManager);
  await writeCSV.bestPlayersOverall(bestPlayersOverall);
  await writeCSV.bestManagersByPosition(leagueEntries, bestManagersByPosition);
  await writeCSV.bestManagersByAction(leagueEntries, bestManagersByAction);

  console.log("CSVs generated for processPointBreakdowns.");

}

export { run };