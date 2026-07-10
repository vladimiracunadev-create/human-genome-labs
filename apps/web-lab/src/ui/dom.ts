export function byId<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) throw new Error(`No se encontró el elemento #${id}.`);
  return element as T;
}

export function all<T extends Element>(selector: string): T[] {
  return Array.from(document.querySelectorAll<T>(selector));
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  }[character] ?? character));
}
