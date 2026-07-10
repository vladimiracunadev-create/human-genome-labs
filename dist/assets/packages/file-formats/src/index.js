import { oneBasedClosedToZeroBasedHalfOpen } from "../../scientific-contracts/src/index.js";
export function parseFasta(text, options = {}) {
    const normalizeWhitespace = options.normalizeWhitespace ?? true;
    const records = [];
    let header = null;
    let sequence = [];
    const flush = () => {
        if (header === null)
            return;
        const [id = "unnamed", ...rest] = header.trim().split(/\s+/);
        const raw = sequence.join("");
        records.push({ id, description: rest.join(" "), sequence: normalizeWhitespace ? raw.replace(/\s/g, "") : raw });
    };
    for (const rawLine of text.replace(/\r/g, "").split("\n")) {
        if (rawLine.startsWith(">")) {
            flush();
            header = rawLine.slice(1);
            sequence = [];
        }
        else if (rawLine.trim() && !rawLine.startsWith(";")) {
            if (header === null)
                header = "sequence_1";
            sequence.push(rawLine.trim());
        }
    }
    flush();
    return records;
}
export function formatFasta(records, width = 80) {
    if (!Number.isInteger(width) || width < 1)
        throw new Error("width debe ser un entero positivo.");
    return records.map((record) => {
        const header = `>${record.id}${record.description ? ` ${record.description}` : ""}`;
        const sequence = record.sequence.replace(/\s/g, "");
        const lines = [];
        for (let index = 0; index < sequence.length; index += width)
            lines.push(sequence.slice(index, index + width));
        return [header, ...lines].join("\n");
    }).join("\n");
}
function parseAttributes(raw) {
    if (raw === "." || !raw)
        return {};
    const output = {};
    for (const field of raw.split(";")) {
        if (!field)
            continue;
        const equal = field.indexOf("=");
        const key = decodeURIComponent(equal >= 0 ? field.slice(0, equal) : field);
        const value = equal >= 0 ? field.slice(equal + 1) : "";
        output[key] = value ? value.split(",").map((item) => decodeURIComponent(item)) : [];
    }
    return output;
}
export function parseGff3(text) {
    const directives = [];
    const features = [];
    let version = null;
    for (const [index, raw] of text.replace(/\r/g, "").split("\n").entries()) {
        const lineNumber = index + 1;
        if (!raw.trim())
            continue;
        if (raw.startsWith("##")) {
            directives.push(raw.slice(2));
            if (raw.startsWith("##gff-version"))
                version = raw.split(/\s+/)[1] ?? null;
            continue;
        }
        if (raw.startsWith("#"))
            continue;
        const columns = raw.split("\t");
        if (columns.length !== 9)
            throw new Error(`GFF3 línea ${lineNumber}: se esperaban 9 columnas.`);
        const [sequenceId = "", source = "", type = "", startRaw = "", endRaw = "", scoreRaw = ".", strandRaw = ".", phaseRaw = ".", attributesRaw = "."] = columns;
        const start = Number(startRaw), end = Number(endRaw);
        const strand = strandRaw;
        if (!["+", "-", ".", "?"].includes(strand))
            throw new Error(`GFF3 línea ${lineNumber}: strand inválido.`);
        const phase = phaseRaw === "." ? null : Number(phaseRaw);
        if (phase !== null && ![0, 1, 2].includes(phase))
            throw new Error(`GFF3 línea ${lineNumber}: phase inválida.`);
        const score = scoreRaw === "." ? null : Number(scoreRaw);
        if (!Number.isFinite(start) || !Number.isFinite(end) || (score !== null && !Number.isFinite(score)))
            throw new Error(`GFF3 línea ${lineNumber}: coordenada o score inválido.`);
        features.push({ sequenceId, source, type, start, end, score, strand, phase, attributes: parseAttributes(attributesRaw), interval: oneBasedClosedToZeroBasedHalfOpen(sequenceId, start, end, strand), lineNumber });
    }
    return { version, directives, features };
}
function parseInfo(raw) {
    if (raw === "." || !raw)
        return {};
    const info = {};
    for (const field of raw.split(";")) {
        const equal = field.indexOf("=");
        if (equal < 0)
            info[field] = true;
        else {
            const key = field.slice(0, equal), value = field.slice(equal + 1);
            info[key] = value.includes(",") ? value.split(",") : value;
        }
    }
    return info;
}
export function parseVcf(text) {
    const metadata = {};
    let fileFormat = null;
    let columns = [];
    const records = [];
    for (const [index, raw] of text.replace(/\r/g, "").split("\n").entries()) {
        const lineNumber = index + 1;
        if (!raw.trim())
            continue;
        if (raw.startsWith("##")) {
            const equal = raw.indexOf("=");
            const key = raw.slice(2, equal);
            const value = equal >= 0 ? raw.slice(equal + 1) : "";
            (metadata[key] ??= []).push(value);
            if (key === "fileformat")
                fileFormat = value;
            continue;
        }
        if (raw.startsWith("#CHROM")) {
            columns = raw.slice(1).split("\t");
            continue;
        }
        if (raw.startsWith("#"))
            continue;
        const fields = raw.split("\t");
        if (fields.length < 8)
            throw new Error(`VCF línea ${lineNumber}: se esperaban al menos 8 columnas.`);
        const [chromosome = "", posRaw = "", idRaw = ".", reference = "", altRaw = "", qualRaw = ".", filterRaw = ".", infoRaw = ".", formatRaw = "", ...sampleRaw] = fields;
        const position1 = Number(posRaw);
        if (!Number.isInteger(position1) || position1 < 1)
            throw new Error(`VCF línea ${lineNumber}: POS inválida.`);
        if (!reference || !altRaw)
            throw new Error(`VCF línea ${lineNumber}: REF/ALT obligatorios.`);
        const formatKeys = formatRaw && formatRaw !== "." ? formatRaw.split(":") : [];
        const samples = columns.slice(9);
        const sampleValues = {};
        samples.forEach((sample, indexSample) => {
            const values = (sampleRaw[indexSample] ?? "").split(":");
            const mapped = {};
            formatKeys.forEach((key, i) => { mapped[key] = values[i] ?? "."; });
            sampleValues[sample] = mapped;
        });
        records.push({ chromosome, position1, position0: position1 - 1, id: idRaw === "." ? null : idRaw, reference, alternates: altRaw.split(","), quality: qualRaw === "." ? null : Number(qualRaw), filters: filterRaw === "." || filterRaw === "PASS" ? (filterRaw === "PASS" ? ["PASS"] : []) : filterRaw.split(";"), info: parseInfo(infoRaw), formatKeys, sampleValues, lineNumber });
    }
    return { header: { fileFormat, metadata, columns, samples: columns.slice(9) }, records };
}
//# sourceMappingURL=index.js.map