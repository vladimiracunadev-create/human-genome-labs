import { all } from "./dom.js";
export function initializeNavigation() {
    const tabs = all(".tab");
    const views = all(".view");
    tabs.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.view;
            tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.view === target));
            views.forEach((view) => view.classList.toggle("active", view.id === target));
        });
    });
}
//# sourceMappingURL=navigation.js.map