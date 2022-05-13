export async function getData() {
  const asiaData = axios.get(
    "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/asia"
  );
  const africaData = axios.get(
    "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/africa"
  );
  const americasData = axios.get(
    "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/Americas"
  );
  const europeData = axios.get(
    "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/europe"
  );
  const australiaData = axios.get(
    "https://nameless-citadel-58066.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/oceania"
  );
  const worldData = axios.get("https://corona-api.com/countries");

  resultsArr = await Promise.allSettled([
    worldData,
    asiaData,
    africaData,
    americasData,
    europeData,
    australiaData,
  ]);
  createContinentObj(resultsArr[1].value.data, asia);
  createContinentObj(resultsArr[2].value.data, africa);
  createContinentObj(resultsArr[3].value.data, americas);
  createContinentObj(resultsArr[4].value.data, europe);
  createContinentObj(resultsArr[5].value.data, australia);
  calcData(resultsArr[0].value.data.data);
  showContinentInfo(0);
  drawChartCont(contChartTotals(contDataObjArr[0], actions), actions, 0);
  loader.classList.add("display-none");
}

function createContinentObj(arr, obj) {
  for (let i = 0; i < arr.length; i++) {
    obj[arr[i].cca2] = 1;
  }
  contObjArr.push(obj);
}

function resetContObjDataArr() {
  for (let i = 0; i < contDataObjArr.length; i++) {
    contDataObjArr[i]["confirmed"] = 0;
    contDataObjArr[i]["critical"] = 0;
    contDataObjArr[i]["deaths"] = 0;
    contDataObjArr[i]["recovered"] = 0;
    contDataObjArr[i]["confirmedNew"] = 0;
    contDataObjArr[i]["deathsNew"] = 0;
  }
}

function calcData(WorldArray) {
  resetContObjDataArr();
  for (let i = 0; i < WorldArray.length; i++) {
    let cont;
    for (let j = 0; j < contObjArr.length; j++) {
      if (contObjArr[j][WorldArray[i].code]) {
        cont = j;
        break;
      }
    }
    if (cont !== undefined) {
      contDataObjArr[cont]["confirmed"] += WorldArray[i].latest_data.confirmed;
      worldTotals["confirmed"] += WorldArray[i].latest_data.confirmed;
      contDataObjArr[cont]["critical"] += WorldArray[i].latest_data.critical;
      worldTotals["critical"] += WorldArray[i].latest_data.critical;
      contDataObjArr[cont]["deaths"] += WorldArray[i].latest_data.deaths;
      worldTotals["deaths"] += WorldArray[i].latest_data.deaths;
      contDataObjArr[cont]["recovered"] += WorldArray[i].latest_data.recovered;
      worldTotals["recovered"] += WorldArray[i].latest_data.recovered;
      contDataObjArr[cont]["confirmedNew"] += WorldArray[i].today.confirmed;
      worldTotals["confirmedNew"] += WorldArray[i].today.confirmed;
      contDataObjArr[cont]["deathsNew"] += WorldArray[i].today.deaths;
      worldTotals["deathsNew"] += WorldArray[i].today.deaths;
    }
  }
  contDataObjArr.unshift(worldTotals);
}
