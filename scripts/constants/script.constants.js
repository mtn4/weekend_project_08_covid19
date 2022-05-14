const contName = ["World", "Asia", "Africa", "Americas", "Europe", "Australia"];
const actions = [
  "confirmed",
  "critical",
  "deaths",
  "recovered",
  "confirmedNew",
  "deathsNew",
];
const contObjArr = [];
const asia = {};
const africa = {};
const americas = {};
const europe = {};
const australia = {};
const contDataObjArr = [{}, {}, {}, {}, {}];
const worldTotals = {
  confirmed: 0,
  critical: 0,
  deaths: 0,
  recovered: 0,
  confirmedNew: 0,
  deathsNew: 0,
};
export const initialConstants = {
  actions,
  contObjArr,
  asia,
  africa,
  americas,
  europe,
  australia,
  contDataObjArr,
  worldTotals,
};

export const chartConstants = {
  contName,
  actions,
  contDataObjArr,
};
