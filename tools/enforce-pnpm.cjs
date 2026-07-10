const agent = process.env.npm_config_user_agent || "";
const execpath = process.env.npm_execpath || "";
const usingPnpm = agent.startsWith("pnpm/") || /pnpm/i.test(execpath);
if (!usingPnpm) {
  console.error("Este repositorio usa exclusivamente pnpm. Ejecuta: corepack enable && pnpm install");
  process.exit(1);
}
