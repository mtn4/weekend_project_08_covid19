const countrySelector = document.querySelector("select");
const btnContinent = document.querySelector(".btns-container-continents");
const btnAction = document.querySelector(".btns-container-actions");

import { getData } from "./initial_app.js";
import {
  handleContinentBtn,
  handleActionBtn,
  showCountryInfo,
} from "./charts.js";

countrySelector.addEventListener("change", showCountryInfo);
btnContinent.addEventListener("click", handleContinentBtn);
btnAction.addEventListener("click", handleActionBtn);

getData();
