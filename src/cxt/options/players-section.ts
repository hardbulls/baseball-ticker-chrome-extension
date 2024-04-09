import { PlayersState } from "../../lib/state/PlayersState";
import { Player } from "../../lib/model/Player";
import { setComponent } from "../../lib/framework";

export class PlayersSection extends HTMLElement {
    private homePlayersInput: HTMLTextAreaElement;
    private awayPlayersInput: HTMLTextAreaElement;
    private hideStatisticsCheckbox: HTMLInputElement;
    private hidePlayersCheckbox: HTMLInputElement;

    constructor(private state: PlayersState) {
        super();

        this.innerHTML = this.render();

        this.homePlayersInput = this.querySelector("#home-players") as HTMLTextAreaElement;
        this.awayPlayersInput = this.querySelector("#away-players") as HTMLTextAreaElement;

        this.hideStatisticsCheckbox = this.querySelector("#hide-statistics") as HTMLInputElement;
        this.hidePlayersCheckbox = this.querySelector("#hide-players") as HTMLInputElement;

        this.homePlayersInput.value = this.encodePlayers(state.homePlayers);
        this.awayPlayersInput.value = this.encodePlayers(state.awayPlayers);
        this.hideStatisticsCheckbox.checked = state.hideStatistics;
        this.hidePlayersCheckbox.checked = state.hidePlayers;

        if (this.hidePlayersCheckbox.checked) {
            this.hideStatisticsCheckbox.disabled = true;
        }

        this.hidePlayersCheckbox.addEventListener("click", () => {
            this.hideStatisticsCheckbox.disabled = this.hidePlayersCheckbox.checked;
        });
    }

    private render(): string {
        return `
    <h3>Players</h3>
    
      <div class="checkbox-group">
          <div>
            <label for="hide-players">Hide Players</label>
            <input type="checkbox" id="hide-players" />
          </div>

          <div>
            <label for="hide-statistics">Hide Statistics</label>
            <input type="checkbox" id="hide-statistics" />
          </div>
        </div>
      </div>
    <div class="settings-row">
      <div class="settings-column">
        <label for="home-players">Home Players</label>
      </div>
      <div class="settings-column">
        <label for="away-players">Away Players</label>
      </div>
    </div>
    
    <div class="settings-row">
      <div class="settings-column">
        <textarea id="home-players" rows="15" cols="25"></textarea>
      </div>
      <div class="settings-column">
        <textarea id="away-players" rows="15" cols="25"></textarea>
      </div>
    </div>
    `;
    }

    private encodePlayers(players: Player[]) {
        const playing: string[] = [];
        const reserve: string[] = [];

        for (const player of players) {
            const playerValue = [player.name, player.number].filter(Boolean).join("#");

            if (player.isPlaying) {
                playing.push(playerValue);
            } else {
                reserve.push(playerValue);
            }
        }

        const result: string[] = [...playing];

        if (reserve.length > 0) {
            result.push("---");
            result.push(...reserve);
        }

        return result.filter(Boolean).join("\n");
    }

    private decodePlayers(value: string): Player[] {
        const [playing, reserve] = value.split("---") as [string, string | undefined];

        const playingPlayers: Player[] = playing
            .split("\n")
            .map((v) => v.trim())
            .filter(Boolean)
            .map((v): Player => {
                const [name, number] = v.split("#") as [string, string | undefined];

                return {
                    name: name,
                    number: number !== undefined ? Number.parseInt(number) : undefined,
                    isPlaying: true,
                };
            });

        const reservePlayers: Player[] =
            reserve !== undefined
                ? reserve
                      .split("\n")
                      .map((v) => v.trim())
                      .filter(Boolean)
                      .map((v): Player => {
                          const [name, number] = v.split("#") as [string, string | undefined];

                          return {
                              name: name,
                              number: number !== undefined ? Number.parseInt(number) : undefined,
                              isPlaying: false,
                          };
                      })
                : [];

        return [...playingPlayers, ...reservePlayers];
    }

    public getState(): PlayersState {
        return {
            ...this.state,
            hideStatistics: this.hideStatisticsCheckbox.checked,
            hidePlayers: this.hidePlayersCheckbox.checked,
            homePlayers: this.decodePlayers(this.homePlayersInput.value || ""),
            awayPlayers: this.decodePlayers(this.awayPlayersInput.value || ""),
        };
    }
}

setComponent("players-section", PlayersSection);
