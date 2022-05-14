import { btnContinent, btnAction, countrySelector } from "./index.js";
import { resultsArr } from "./initial_app.js";
import { chartConstants } from "../constants/script.constants.js";
import { chartsElements } from "./load_dom_elements.js";
const { contName, actions, contDataObjArr } = chartConstants;
const { countryInfo, loader, ctx } = chartsElements;
let myChart = "";
function removeBorder(btns) {
  for (let i = 0; i < btns.length; i++) {
    btns[i].classList.remove("selected");
  }
}
export function handleContinentBtn(e) {
  if (e.target.dataset.cnt !== undefined) {
    removeBorder(btnContinent.children);
    e.target.classList.add("selected");
    if (e.target.dataset.id !== "0") {
      removeBorder(btnAction.children);
      btnAction.style.visibility = "hidden";
    } else {
      btnAction.style.visibility = "visible";
    }
    myChart.destroy();
    drawChartCont(
      contChartTotals(contDataObjArr[e.target.dataset.id], actions),
      actions,
      contName[e.target.dataset.id]
    );
    selectCountryInfo(e.target.dataset.id);
  }
}

export function handleActionBtn(e) {
  if (e.target.dataset.val !== undefined) {
    removeBorder(btnAction.children);
    e.target.classList.add("selected");
    myChart.destroy();
    drawChartActions(
      worldChartTotals(e.target.dataset.val),
      contName.slice(1),
      e.target.dataset.val
    );
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
    countrySelector.innerHTML = ``;
  } else {
    countrySelector.innerHTML = `<option selected="selected" disabled="">Select country</option>`;
    for (let i = 0; i < resultsArr[id].value.data.length; i++) {
      const countrySelection = document.createElement("option");
      countrySelection.innerText = `${resultsArr[id].value.data[i].name.common}`;
      countrySelection.setAttribute("value", resultsArr[id].value.data[i].cca2);
      countrySelector.appendChild(countrySelection);
    }
  }
  showContinentInfo(id);
}
export function showContinentInfo(id) {
  const countryInfoArr = countryInfo.children;
  for (let i = 0; i < countryInfoArr.length - 1; i++) {
    if (countryInfoArr[i].children.length > 0) {
      countryInfoArr[i].removeChild(countryInfoArr[i].children[0]);
    }
    let span = document.createElement("span");
    let val = countryInfoArr[i].getAttribute("val");
    if (i < 4) {
      span.innerText = ` ${contDataObjArr[id][val]}`;
    } else {
      let newCase = `${val}New`;
      span.innerText = ` ${contDataObjArr[id][newCase]}`;
    }
    countryInfoArr[i].appendChild(span);
  }
}

export async function showCountryInfo(e) {
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
  let countryArr = countryTotals(countryData);
  myChart.destroy();
  drawChartCont(
    countryTotals(countryData),
    actions,
    countryData.data.data.name
  );
  loader.classList.add("display-none");
}
function countryTotals(countryData) {
  let newArr = [];
  for (let i = 0; i < 6; i++) {
    if (i < 4) {
      newArr.push(countryData.data.data.latest_data[actions[i]]);
    } else if (i === 5) {
      newArr.push(countryData.data.data.today["deaths"]);
    } else {
      newArr.push(countryData.data.data.today["confirmed"]);
    }
  }
  return newArr;
}
export function contChartTotals(contObj, actionsArr) {
  let newArr = [];
  for (let i = 0; i < 6; i++) {
    newArr.push(contObj[actionsArr[i]]);
  }
  return newArr;
}
function worldChartTotals(type) {
  let chartTypeArr = [];
  for (let i = 1; i < contDataObjArr.length; i++) {
    chartTypeArr.push(contDataObjArr[i][type]);
  }
  return chartTypeArr;
}
export function drawChartCont(dataArr, labelArr, name) {
  myChart = new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: "bar",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: name,
          data: dataArr,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
          datalabels: {
            color: "black",
            anchor: "end",
            align: "top",
          },
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
function drawChartActions(dataArr, labelArr, action) {
  myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labelArr,
      datasets: [
        {
          data: dataArr,
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
          datalabels: {
            color: "black",
            anchor: "end",
            align: "top",
          },
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: `${
            action.charAt(0).toUpperCase() + action.slice(1)
          } Cases Continents Chart`,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}
