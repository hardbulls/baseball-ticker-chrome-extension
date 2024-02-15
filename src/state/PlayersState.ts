import { Player } from "../model/Player"

export type PlayersState = {
    hideStatistics: boolean
    hidePlayers: boolean
    homePlayers: Player[]
    awayPlayers: Player[]
}
