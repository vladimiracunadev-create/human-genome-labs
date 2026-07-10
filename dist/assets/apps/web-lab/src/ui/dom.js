export function byId(id) {
    const element = document.getElementById(id);
    if (!element)
        throw new Error(`No se encontró el elemento #${id}.`);
    return element;
}
export function all(selector) {
    return Array.from(document.querySelectorAll(selector));
}
export function escapeHtml(value) {
    return value.replace(/[&<>'"]/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
    }[character] ?? character));
}
//# sourceMappingURL=dom.js.map