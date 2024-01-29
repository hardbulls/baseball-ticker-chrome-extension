import { ScoreboardState } from "../baseball/model/ScoreboardState"
import { TeamState } from "../teams/TeamState"
import { OptionsState } from "../options/OptionsState"

export abstract class Local {
    public static getScoreboard = async (): Promise<ScoreboardState> => {
        return (await chrome.storage.local.get(["scoreboard"])).scoreboard as ScoreboardState
    }

    public static getTeams = async (): Promise<TeamState> => {
        return (await chrome.storage.local.get(["teams"])).teams as TeamState
    }

    public static setTeams = async (teams: TeamState): Promise<void> => {
        await chrome.storage.local.set({
            teams: teams,
        })
    }
    public static getOptions = async (): Promise<OptionsState> => {
        return (await chrome.storage.local.get(["options"])).options as OptionsState
    }

    public static setOptions = async (options: OptionsState): Promise<void> => {
        await chrome.storage.local.set({
            options: options,
        })
    }
}
