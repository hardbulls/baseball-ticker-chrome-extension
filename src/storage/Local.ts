import { ScoreboardState } from "../baseball/model/ScoreboardState"
import { TeamState } from "../teams/TeamState"
import { OptionsState } from "../options/OptionsState"
import { PopupState } from "../popup/PopupState"

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

    public static getSponsors = async (): Promise<string[]> => {
        return (await chrome.storage.local.get(["sponsors"])).sponsors as string[]
    }

    public static setSponsors = async (sponsors: string[]): Promise<void> => {
        await chrome.storage.local.set({
            sponsors: sponsors,
        })
    }

    public static setPopup = async (popup: PopupState) => {
        await chrome.storage.local.set({
            popup: popup,
        })
    }

    public static getPopup = async (): Promise<PopupState> => {
        return (await chrome.storage.local.get(["popup"])).popup as PopupState
    }

    public static setScoreboard = async (scoreboard: ScoreboardState) => {
        await chrome.storage.local.set({ scoreboard: scoreboard })
    }
}
