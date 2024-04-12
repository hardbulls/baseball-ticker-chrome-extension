import { League } from "../model/League";
import { RemoteState } from "./RemoteState";
import { StyleState } from "./StyleState";

export type OptionsState = {
    leagueLogoShadow: string;
    league?: League;
    style: StyleState;
    remote: RemoteState;
    tickerInterval: number;
    refreshInterval: number;
};
