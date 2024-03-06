import { FirebaseConfig } from "../remote/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, onValue, ref } from "firebase/database";
import { browserLocalPersistence, getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseOptions } from "@firebase/app";
import { FirebaseError } from "@firebase/util";
import { LoginComponent } from "./login-component";
import { ScoreboardState } from "../baseball/model/ScoreboardState";
import { DEFAULT_SCOREBOARD_STATE } from "../state/DefaultState";
import { DATABASE_NAME } from "../remote/firebase";
import { sleep } from "../helper/sleep";
import { ScoreboardController } from "./scoreboard-controller";
import { LocalStorage } from "../storage/LocalStorage";

// const firebaseConfig = JSON.parse(FIREBASE_CONFIG) as FirebaseConfig;

const firebaseConfig: FirebaseConfig = {
    apiKey: "AIzaSyC4-U1Z4irYRnYk6S2wGjOUOCTW-gkTNH4",
    authDomain: "hardbulls-livestream.firebaseapp.com",
    databaseURL: "https://hardbulls-livestream-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hardbulls-livestream",
    storageBucket: "hardbulls-livestream.appspot.com",
    messagingSenderId: "672919965109",
    appId: "1:672919965109:web:6efa9ea69eea842b131dfc",
};

(async () => {
    const config = {
        ...firebaseConfig,
        persistence: browserLocalPersistence,
    } as FirebaseOptions;

    initializeApp(config);

    const auth = getAuth();
    await auth.setPersistence(browserLocalPersistence);
    const user = getAuth().currentUser;

    let scoreboardRef: DatabaseReference | undefined;
    let scoreboardState = {
        ...LocalStorage.getScoreboard(),
        ...DEFAULT_SCOREBOARD_STATE,
    };

    async function handleLogin(username: string, password: string): Promise<undefined | Error> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, username, password);
            const user = userCredential.user;

            LocalStorage.setDefaultCredentials(username, password);

            renderScoreboardController();

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

    function getFirebaseData(user: User) {
        const db = getDatabase();

        scoreboardRef = ref(db, `${DATABASE_NAME}/${user.uid}`);

        onValue(
            scoreboardRef,
            async (snapshot) => {
                const data = snapshot.val() as ScoreboardState;

                scoreboardState = {
                    ...scoreboardState,
                    ...data,
                };
            },
            { onlyOnce: true }
        );
    }

    function renderScoreboardController() {
        const scoreboardController = new ScoreboardController(scoreboardState);

        document.body.append(scoreboardController);
    }

    if (user) {
        getFirebaseData(user);
        renderScoreboardController();
    } else {
        const defaultCredentials = LocalStorage.getDefaultCredentials();

        const loginComponent = new LoginComponent(defaultCredentials, async (username, password) => {
            const [error] = await Promise.all([handleLogin(username, password), sleep(300)]);

            return error;
        });

        document.body.append(loginComponent);
    }
})();
