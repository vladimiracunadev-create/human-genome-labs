export function createScientificResult(options) {
    return {
        contractVersion: "1.0.0",
        analysis: options.analysis,
        moduleId: options.moduleId,
        moduleVersion: options.moduleVersion,
        maturity: options.maturity,
        status: options.status,
        evidenceLevel: options.evidenceLevel,
        input: options.input,
        parameters: options.parameters,
        result: options.result,
        warnings: [...options.warnings],
        limitations: [...options.limitations],
        generatedAt: options.generatedAt ?? new Date().toISOString(),
    };
}
export function oneBasedClosedToZeroBasedHalfOpen(sequenceId, start, end, strand) {
    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start)
        throw new Error("Las coordenadas 1-based closed deben cumplir 1 <= start <= end.");
    const interval = { sequenceId, start: start - 1, end, coordinateConvention: "zero_based_half_open" };
    if (strand !== undefined)
        interval.strand = strand;
    return interval;
}
export function zeroBasedHalfOpenToOneBasedClosed(interval) {
    if (!Number.isInteger(interval.start) || !Number.isInteger(interval.end) || interval.start < 0 || interval.end < interval.start)
        throw new Error("Intervalo 0-based half-open inválido.");
    const result = {
        sequenceId: interval.sequenceId, start: interval.start + 1, end: interval.end, coordinateConvention: "one_based_closed",
    };
    if (interval.strand !== undefined)
        result.strand = interval.strand;
    return result;
}
//# sourceMappingURL=index.js.map