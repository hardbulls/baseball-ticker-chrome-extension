import { FirebaseConfig } from "./FirebaseConfig";
import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, Unsubscribe, onValue, ref } from "firebase/database";
import { Auth, indexedDBLocalPersistence, getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseOptions } from "@firebase/app";
import { Local } from "../storage/Local";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../state/DefaultState";

export const DATABASE_NAME = "scoreboards";

export class FirebaseUpdater {
    private auth?: Auth = undefined;
    private user?: User = undefined;
    private scoreboardRef?: DatabaseReference = undefined;
    private unsubscribe?: Unsubscribe = undefined;

    public async enable(email: string, password: string, config: FirebaseConfig) {
        await this.disable();

        const firebaseConfig = {
            ...config,
            persistence: indexedDBLocalPersistence,
        } as FirebaseOptions;

        initializeApp(firebaseConfig);

        this.auth = getAuth();
        await this.auth.setPersistence(indexedDBLocalPersistence);

        await this.login(email, password);
    }

    private async login(email: string, password: string): Promise<void> {
        if (this.auth) {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

            this.user = userCredential.user;

            this.listen(this.user);
        }
    }

    private listen(user: User) {
        if (!this.scoreboardRef) {
            const db = getDatabase();

            this.scoreboardRef = ref(db, `${DATABASE_NAME}/${user.uid}`);
        }

        this.disable();

        this.unsubscribe = onValue(this.scoreboardRef, async (snapshot) => {
            const data = snapshot.val() as ScoreboardState;

            await Local.setScoreboard({
                ...DEFAULT_SCOREBOARD_STATE,
                ...data,
            });
        });
    }

    public async disable(): Promise<void> {
        if (this.unsubscribe) {
            this.unsubscribe();
        }
    }
}
