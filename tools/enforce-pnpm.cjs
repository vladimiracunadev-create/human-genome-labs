const agent = process.env.npm_config_user_agent || "";
if (!agent.startsWith("pnpm/")) {
  console.error("Este repositorio usa exclusivamente pnpm. Ejecuta: corepack enable && pnpm install");
  process.exit(1);
}
