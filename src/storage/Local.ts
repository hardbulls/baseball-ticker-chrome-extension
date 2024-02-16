import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { TeamState } from "../teams/TeamState";
import { OptionsState } from "../options/OptionsState";
import { PopupState } from "../popup/PopupState";
import { PlayersState } from "../state/PlayersState";
import { SponsorsState } from "../options/SponsorsState";

export abstract class Local {
    public static getScoreboard = async (): Promise<ScoreboardState> => {
        return (await chrome.storage.local.get(["scoreboard"])).scoreboard as ScoreboardState;
    };

    public static getTeams = async (): Promise<TeamState> => {
        return (await chrome.storage.local.get(["teams"])).teams as TeamState;
    };

    public static setTeams = async (teams: TeamState): Promise<void> => {
        await chrome.storage.local.set({
            teams: teams,
        });
    };

    public static getPlayers = async (): Promise<PlayersState> => {
        return (await chrome.storage.local.get(["players"])).players as PlayersState;
    };

    public static setPlayers = async (players: PlayersState): Promise<void> => {
        await chrome.storage.local.set({
            players: players,
        });
    };

    public static getOptions = async (): Promise<OptionsState> => {
        return (await chrome.storage.local.get(["options"])).options as OptionsState;
    };

    public static setOptions = async (options: OptionsState): Promise<void> => {
        await chrome.storage.local.set({
            options: options,
        });
    };

    public static getSponsors = async (): Promise<SponsorsState> => {
        return (await chrome.storage.local.get(["sponsors"])).sponsors as SponsorsState;
    };

    public static setSponsors = async (sponsors: SponsorsState): Promise<void> => {
        await chrome.storage.local.set({
            sponsors: sponsors,
        });
    };

    public static setPopup = async (popup: PopupState) => {
        await chrome.storage.local.set({
            popup: popup,
        });
    };

    public static getPopup = async (): Promise<PopupState> => {
        return (await chrome.storage.local.get(["popup"])).popup as PopupState;
    };

    public static setScoreboard = async (scoreboard: ScoreboardState) => {
        await chrome.storage.local.set({ scoreboard: scoreboard });
    };
}
