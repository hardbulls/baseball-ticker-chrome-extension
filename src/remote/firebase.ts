import { FirebaseConfig } from "./FirebaseConfig";
import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, Unsubscribe, onValue, ref } from "firebase/database";
import { Auth, browserLocalPersistence, getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseOptions } from "@firebase/app";
import { Local } from "../storage/Local";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../state/DefaultState";

const DATABASE_NAME = "scoreboards";

export class FirebaseUpdater {
    private auth?: Auth = undefined;
    private user?: User = undefined;
    private scoreboardRef?: DatabaseReference = undefined;
    private unsubscribe?: Unsubscribe = undefined;

    public async enable(email: string, password: string, config: FirebaseConfig) {
        await this.disable();

        const firebaseConfig = {
            ...config,
            persistence: browserLocalPersistence,
        } as FirebaseOptions;

        initializeApp(firebaseConfig);

        if (!this.auth) {
            this.auth = getAuth();
            await this.auth.setPersistence(browserLocalPersistence);
        }

        await this.login(email, password);
    }

    private async login(email: string, password: string): Promise<void> {
        const user = this.auth?.currentUser;

        if (this.auth && !user) {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

            this.user = userCredential.user;

            if (!this.scoreboardRef) {
                const db = getDatabase();

                this.scoreboardRef = ref(db, `${DATABASE_NAME}/${this.user.uid}`);

                this.unsubscribe = onValue(this.scoreboardRef, async (snapshot) => {
                    const data = snapshot.val() as ScoreboardState;

                    await Local.setScoreboard({
                        ...DEFAULT_SCOREBOARD_STATE,
                        ...data,
                    });
                });
            }
        }
    }

    public async disable(): Promise<void> {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
