import { readFile, access } from "node:fs/promises";
import { resolve, join } from "node:path";
const root=resolve(import.meta.dirname,".."); const registry=JSON.parse(await readFile(join(root,"registry/modules.json"),"utf8")); const biology=JSON.parse(await readFile(join(root,"packages/biology-data/data/biology.json"),"utf8"));
const errors=[]; const assert=(c,m)=>{if(!c)errors.push(m)}; const allowedMaturity=new Set(["concept","experimental","validated","stable","deprecated"]); const allowedEvidence=new Set(biology.evidence_levels.map((x)=>x.id)); const sourceIds=new Set(biology.sources.map((x)=>x.id));
assert(registry.schemaVersion==="1.0.0","schemaVersion del registro debe ser 1.0.0.");
const moduleIds=registry.modules.map((x)=>x.id); assert(new Set(moduleIds).size===moduleIds.length,"IDs de módulos duplicados.");
const capabilityIds=registry.capabilities.map((x)=>x.id); assert(new Set(capabilityIds).size===capabilityIds.length,"IDs de capacidades duplicados.");
for (const module of registry.modules) {
  assert(allowedMaturity.has(module.maturity),`Madurez inválida en ${module.id}.`); assert(allowedEvidence.has(module.evidenceLevel),`Evidencia inválida en ${module.id}.`); assert(module.clinicalUse===false,`${module.id} debe declarar clinicalUse=false.`); assert(module.limitations.length>0,`${module.id} debe declarar limitaciones.`);
  for (const capability of module.capabilities) assert(capabilityIds.includes(capability),`${module.id} referencia capacidad inexistente ${capability}.`);
  for (const source of module.sourceIds) assert(sourceIds.has(source),`${module.id} referencia fuente inexistente ${source}.`);
  const candidates=[join(root,"modules",module.maturity,module.id,"module.json"),join(root,"modules",module.maturity==="stable"?"validated":module.maturity,module.id,"module.json")]; let found=false; for (const path of candidates){try{await access(path);found=true;break}catch{}} assert(found,`No se encontró manifiesto físico para ${module.id}.`);
}
for (const cap of registry.capabilities) { assert(moduleIds.includes(cap.moduleId),`${cap.id} referencia módulo inexistente.`); assert(allowedMaturity.has(cap.maturity),`Madurez inválida en ${cap.id}.`); assert(allowedEvidence.has(cap.evidenceLevel),`Evidencia inválida en ${cap.id}.`); assert(cap.limitations.length>0,`${cap.id} debe declarar limitaciones.`); }
if(errors.length){console.error(errors.map((x)=>`- ${x}`).join("\n"));process.exit(1)} console.log(`Registro validado: ${registry.modules.length} módulos y ${registry.capabilities.length} capacidades.`);
