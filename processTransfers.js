import * as client from './client.js';
import * as writeCSV from './writeCSV.js';

const run = async (leagueId) => {

  const leagueData = await client.getLeagueData(leagueId);
  const leagueEntries = leagueData.league_entries;

  let entryIdToNameMap = {};
  for (var entry of leagueEntries) {
    entryIdToNameMap[entry.entry_id] = entry.player_first_name;
  }

  const transfers = await client.getTransfers(leagueId);

  const drafts = await client.getDrafts(leagueId);

  const elementAndTeamInfo = await client.getElementInfo();
  const elementInfo = elementAndTeamInfo.elements;

  console.log("Data pulled for processTransfers.");

  const transfersByManager = {};
  for (let entry of leagueEntries) {
    transfersByManager[entry.entry_id] = {
      'name': entryIdToNameMap[entry.entry_id],
      'total_transfers': 0,
      'successful_waivers': 0,
      'denied_waivers': 0,
      'backup_waivers': 0,
      'free_transfers': 0
    }
  }

  const mostTransferredElements = {};

  for (let draft of drafts) {
    if (!(draft.element in mostTransferredElements)) {
      mostTransferredElements[draft.element] = {
        'name': elementInfo[draft.element - 1].web_name,
        'successful_transfers': 0,
        'unsuccessful_transfers': 0,
        'teams_played': [],
        'unique_transfers': 0,
        'drafted': false
      }
    }
    mostTransferredElements[draft.element].successful_transfers++;
    mostTransferredElements[draft.element].unique_transfers++;
    mostTransferredElements[draft.element].teams_played.push(draft.entry);
    mostTransferredElements[draft.element].drafted = true;
  }

  for (let transfer of transfers) {
    transfersByManager[transfer.entry].total_transfers++;
    if (!(transfer.element_in in mostTransferredElements)) {
      mostTransferredElements[transfer.element_in] = {
        'name': elementInfo[transfer.element_in - 1].web_name,
        'successful_transfers': 0,
        'unsuccessful_transfers': 0,
        'teams_played': [],
        'unique_transfers': 0,
        'drafted': false
      }
    }
    if (transfer.kind == 'f') {
      transfersByManager[transfer.entry].free_transfers++;
      mostTransferredElements[transfer.element_in].successful_transfers++;
      if (!mostTransferredElements[transfer.element_in].teams_played.includes(transfer.entry)) {
        mostTransferredElements[transfer.element_in].teams_played.push(transfer.entry);
        mostTransferredElements[transfer.element_in].unique_transfers++;
      }
    } else if (transfer.result == 'a') {
      transfersByManager[transfer.entry].successful_waivers++;
      mostTransferredElements[transfer.element_in].successful_transfers++;
      if (!mostTransferredElements[transfer.element_in].teams_played.includes(transfer.entry)) {
        mostTransferredElements[transfer.element_in].teams_played.push(transfer.entry);
        mostTransferredElements[transfer.element_in].unique_transfers++;
      }
    } else if (transfer.result == 'di') {
      transfersByManager[transfer.entry].denied_waivers++;
      mostTransferredElements[transfer.element_in].unsuccessful_transfers++;
    } else if (transfer.result == 'do') {
      transfersByManager[transfer.entry].backup_waivers++;
    }
  }

  const mostSuccessfullyTransferredPlayers = [];

  const mostTransfersByManager = [];

  for (let entry in transfersByManager) {
    mostTransfersByManager.push(transfersByManager[entry]);
  }

  mostTransfersByManager.sort((managerA, managerB) => {
    return managerB.total_transfers - managerA.total_transfers;
  });

  for (let element in mostTransferredElements) {
    mostSuccessfullyTransferredPlayers.push(mostTransferredElements[element]);
  }

  const mostUniquelyTransferredPlayers = mostSuccessfullyTransferredPlayers;

  mostSuccessfullyTransferredPlayers.sort((playerA, playerB) => {
    return playerB.successful_transfers - playerA.successful_transfers
      || playerB.unsuccessful_transfers - playerA.unsuccessful_transfers;
  });

  mostUniquelyTransferredPlayers.sort((playerA, playerB) => {
    return playerB.unique_transfers - playerA.unique_transfers
      || playerB.successful_transfers - playerA.successful_transfers;
  });

  console.log("Data processed for processTransfers.");

  await writeCSV.mostTransfersByManager(mostTransfersByManager);
  await writeCSV.mostTransferredPlayers(mostUniquelyTransferredPlayers);

  console.log("CSVs generated for processTransfers.");

}

export { run };