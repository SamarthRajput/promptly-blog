export const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isValidUUID = (id: string): boolean =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

export const isValidSlug = (slug: string): boolean =>
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

export function parseIntOrDefault(value: string | null, defaultValue: number, min = 1) {
    const parsed = parseInt(value ?? "", 10);
    return isNaN(parsed) || parsed < min ? defaultValue : parsed;
}