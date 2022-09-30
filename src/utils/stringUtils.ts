export function cleanIda(title: string): string {
    return title.replace(/\W/g, '_');
}

export function capitalizeFirstLetterOnly(verdi: string): string {
    return verdi.charAt(0) + verdi.slice(1).toLowerCase();
}

const UUID = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g;

export function cleanPathForMetric(value: string | undefined): string | undefined {
    return value?.replace(UUID, '[uuid]');
}

export function addSpaceAfterEverySixthCharacter(value: string): string {
    return value.replace(/(.{6})/g, '$1 ');
}
