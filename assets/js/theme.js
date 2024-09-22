import { ThemeManager } from './components/theme.js';

let themeToggleButtonElement = document.querySelector('[data-theme-toggle]');
let themeManager = new ThemeManager(themeToggleButtonElement);
themeManager.init();

document.addEventListener("turbo:load", (event) => {
  let themeToggleButtonElement = document.querySelector('[data-theme-toggle]');
  themeManager.setToggleButtonElement(themeToggleButtonElement);
});