export class TeamNotFoundError extends Error {
    constructor(id: string) {
        super(`Team with id ${id} not found.`)
    }
}
