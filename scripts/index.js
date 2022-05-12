const btnContinent = document.querySelector(".btns-container-continents");
const countryInfo = document.querySelector(".country-info");
const countrySelector = document.querySelector("select");
const loader = document.getElementById("loader");
countrySelector.addEventListener("change", showCountryInfo);

let resultsArr = [];
let contObjArr = [];
let asia = {};
let africa = {};
let americas = {};
let europe = {};
let australia = {};
let contDataObjArr = [{}, {}, {}, {}, {}];
let worldTotals = {
  confirmed: 0,
  critical: 0,
  deaths: 0,
  recovered: 0,
  confirmedNew: 0,
  deathsNew: 0,
};
btnContinent.addEventListener("click", (e) => {
  if (e.target.dataset.cnt !== undefined) {
    selectCountryInfo(e.target.dataset.id);
    drawContChart(e.target.dataset.id);
  }
});
async function getData() {
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
  loader.classList.add("display-none");
}
getData();

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
    for (j = 0; j < contObjArr.length; j++) {
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
}
function selectCountryInfo(id) {
  if (id === "0") {
    const countryInfoArr = countryInfo.children;
    for (let i = 0; i < countryInfoArr.length - 1; i++) {
      if (countryInfoArr[i].children.length > 0) {
        countryInfoArr[i].removeChild(countryInfoArr[i].children[0]);
      }
    }
    countryInfo.classList.add("display-none");
  } else {
    countrySelector.innerHTML = `<option selected="selected" disabled="">Select country</option>`;
    for (let i = 0; i < resultsArr[id].value.data.length; i++) {
      const countrySelection = document.createElement("option");
      countrySelection.innerText = `${resultsArr[id].value.data[i].name.common}`;
      countrySelection.setAttribute("value", resultsArr[id].value.data[i].cca2);
      countrySelector.appendChild(countrySelection);
    }
    countryInfo.classList.remove("display-none");
  }
}

async function showCountryInfo(e) {
  loader.classList.remove("display-none");
  const countryData = await axios.get(
    `https:///corona-api.com/countries/${e.target.value}`
  );
  const countryInfoArr = e.target.parentElement.children;
  for (let i = 0; i < countryInfoArr.length - 1; i++) {
    if (countryInfoArr[i].children.length > 0) {
      countryInfoArr[i].removeChild(countryInfoArr[i].children[0]);
    }
    let span = document.createElement("span");
    let val = countryInfoArr[i].getAttribute("val");
    if (i < 4) {
      span.innerText = ` ${countryData.data.data.latest_data[val]}`;
    } else {
      span.innerText = ` ${countryData.data.data.today[val]}`;
    }
    countryInfoArr[i].appendChild(span);
  }
  loader.classList.add("display-none");
}

function drawContChart() {
  // console.log(resultsArr[1].value.data);
}
// const ctx = document.getElementById("myChart").getContext("2d");
// const myChart = new Chart(ctx, {
//   type: "line",
//   data: {
//     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
//     datasets: [
//       {
//         label: "# of Votes",
//         data: [12, 19, 3, 5, 2, 3],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],
//         borderColor: [
//           "rgba(255, 99, 132, 1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
