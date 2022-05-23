import fetch from 'node-fetch';

const GAME_STATUS_URL = 'https://draft.premierleague.com/api/game';
const ELEMENT_INFO_URL = 'https://draft.premierleague.com/api/bootstrap-static';
const LEAGUE_DATA_URL_A = 'https://draft.premierleague.com/api/league/';
const LEAGUE_DATA_URL_B = '/details';
const ENTRY_PICKS_URL_A = 'https://draft.premierleague.com/api/entry/';
const ENTRY_PICKS_URL_B = '/event/';
const ELEMENT_STATS_URL_A = 'https://draft.premierleague.com/api/event/';
const ELEMENT_STATS_URL_B = '/live';
const TRANSFERS_URL_A = 'https://draft.premierleague.com/api/draft/league/';
const TRANSFERS_URL_B = '/transactions';
const DRAFTS_URL_A = 'https://draft.premierleague.com/api/draft/';
const DRAFTS_URL_B = '/choices';

const getGameStatus = async () => {
  const response = await fetch(GAME_STATUS_URL);
  const body = await response.text();
  return JSON.parse(body);
}

const getElementInfo = async () => {
  const response = await fetch(ELEMENT_INFO_URL);
  const body = await response.text();
  return JSON.parse(body);
}

const getLeagueData = async (leagueId) => {
  let url = LEAGUE_DATA_URL_A.concat(leagueId, LEAGUE_DATA_URL_B);
  const response = await fetch(url);
  const body = await response.text();
  return JSON.parse(body);
}

const getEntryPicks = async (entryId, gameweek) => {
  let url = ENTRY_PICKS_URL_A.concat(entryId, ENTRY_PICKS_URL_B, gameweek);
  const response = await fetch(url);
  const body = await response.text();
  return JSON.parse(body).picks;
}

const getElementStats = async (gameweek) => {
  let url = ELEMENT_STATS_URL_A.concat(gameweek, ELEMENT_STATS_URL_B);
  const response = await fetch(url);
  const body = await response.text();
  return JSON.parse(body).elements;
}

const getTransfers = async (leagueId) => {
  let url = TRANSFERS_URL_A.concat(leagueId, TRANSFERS_URL_B);
  const response = await fetch(url);
  const body = await response.text();
  return JSON.parse(body).transactions;
}

const getDrafts = async (leagueId) => {
  let url = DRAFTS_URL_A.concat(leagueId, DRAFTS_URL_B);
  const response = await fetch(url);
  const body = await response.text();
  return JSON.parse(body).choices;
}

export {
  getGameStatus,
  getElementInfo,
  getLeagueData,
  getEntryPicks,
  getElementStats,
  getTransfers,
  getDrafts
};