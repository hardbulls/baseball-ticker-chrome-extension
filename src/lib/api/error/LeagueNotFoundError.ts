export class LeagueNotFoundError extends Error {
    constructor(id: string) {
        super(`League with id ${id} not found.`);
    }
}
