import "../reset.css";
import { FirebaseConfig } from "../remote/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, onValue, ref, set } from "firebase/database";
import { browserLocalPersistence, getAuth, signInWithEmailAndPassword, signOut, User } from "firebase/auth";
import { FirebaseOptions } from "@firebase/app";
import { FirebaseError } from "@firebase/util";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../state/DefaultState";
import { DATABASE_NAME } from "../remote/firebase";
import { sleep } from "../helper/sleep";
import { LocalStorage } from "../storage/LocalStorage";
import { ScoreboardContainer } from "./scoreboard-container";
import { LoginContainer } from "./login-container";

const firebaseConfig = FIREBASE_CONFIG as FirebaseConfig;

(async () => {
    const config = {
        ...firebaseConfig,
        persistence: browserLocalPersistence,
    } as FirebaseOptions;

    initializeApp(config);

    const auth = getAuth();
    await auth.setPersistence(browserLocalPersistence);
    let user = getAuth().currentUser;

    let scoreboardRef: DatabaseReference | undefined;
    const scoreboardState = {
        ...LocalStorage.getScoreboard(),
        ...DEFAULT_SCOREBOARD_STATE,
    };

    async function handleLogout() {
        await signOut(auth);

        user = null;
    }

    async function handleLogin(username: string, password: string): Promise<undefined | Error> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            user = userCredential.user;

            LocalStorage.setDefaultCredentials(username, password);

            if (!scoreboardRef) {
                getFirebaseData(user);

                return undefined;
            }

            return undefined;
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === "auth/invalid-email") {
                    return new Error("Invalid E-Mail");
                }

                if (error.code === "auth/missing-password") {
                    return new Error("Missing Password.");
                }

                if (error.code === "auth/user-not-found") {
                    return new Error("User was not found.");
                }

                if (error.code === "auth/wrong-password") {
                    return new Error("Incorrect Password");
                }

                if (error.code === "auth/too-many-requests") {
                    return new Error("Too many login attempts.");
                }
            }

            throw error;
        }
    }

    const scoreboardContainer = new ScoreboardContainer(
        async () => {
            await Promise.all([handleLogout(), sleep(300)]);

            document.body.append(loginContainer);
            document.body.removeChild(scoreboardContainer);
        },
        scoreboardState,
        async (scoreboardState) => {
            const db = getDatabase();

            await set(ref(db, `${DATABASE_NAME}/${user?.uid}`), scoreboardState);
        }
    );

    function getFirebaseData(user: User) {
        const db = getDatabase();

        scoreboardRef = ref(db, `${DATABASE_NAME}/${user.uid}`);

        onValue(
            scoreboardRef,
            async (snapshot) => {
                const data = snapshot.val() as ScoreboardState;

                scoreboardContainer.setScoreboardState({
                    ...scoreboardState,
                    ...data,
                });
            },
            { onlyOnce: true }
        );
    }

    const loginContainer = new LoginContainer(async (username, password) => {
        const [error] = await Promise.all([handleLogin(username, password), sleep(300)]);

        if (!error) {
            document.body.append(scoreboardContainer);
            document.body.removeChild(loginContainer);
        }

        return error;
    }, LocalStorage.getDefaultCredentials());

    if (user) {
        getFirebaseData(user);

        document.body.append(scoreboardContainer);
    } else {
        document.body.append(loginContainer);
    }
})();
