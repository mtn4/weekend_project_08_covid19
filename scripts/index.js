function loadScripts() {
  const main = document.createElement("script");
  main.src = "./scripts/app/index.js";
  main.type = "module";
  document.body.appendChild(main);
}

window.onload = loadScripts;
