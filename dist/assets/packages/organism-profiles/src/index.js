export function profileById(database, id) { return database.profiles.find((profile) => profile.id === id); }
export function validateOrganismProfile(profile) {
    const errors = [];
    if (!profile.id.trim())
        errors.push("id obligatorio");
    if (!profile.version.trim())
        errors.push("version obligatoria");
    if (!profile.scientificName.trim())
        errors.push("scientificName obligatorio");
    if (!profile.limitations.length)
        errors.push("debe declarar al menos una limitación");
    return errors;
}
//# sourceMappingURL=index.js.map