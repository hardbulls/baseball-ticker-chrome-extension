export class FontNotFoundError extends Error {
    constructor(id: string) {
        super(`Font with id ${id} not found.`)
    }
}
