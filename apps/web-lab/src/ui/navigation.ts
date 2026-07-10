import { all } from "./dom.js";

export function initializeNavigation(): void {
  const tabs = all<HTMLButtonElement>(".tab");
  const views = all<HTMLElement>(".view");

  tabs.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.view;
      tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === target));
      views.forEach((view) => view.classList.toggle("active", view.id === target));
    });
  });
}
