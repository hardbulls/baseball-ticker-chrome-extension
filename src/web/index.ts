import { FirebaseConfig } from "../remote/FirebaseConfig";
import { initializeApp } from "firebase/app";
import { DatabaseReference, getDatabase, onValue, ref } from "firebase/database";
import { browserLocalPersistence, getAuth, signInWithEmailAndPassword, User } from "firebase/auth";
import { FirebaseOptions } from "@firebase/app";
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

    async function handleLogin(username: string, password: string) {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);

        const user = userCredential.user;

        localStorage.setItem("__scoreboard_user", JSON.stringify({ username: username, password }));

        if (!scoreboardRef) {
            getFirebaseData(user);

            return true;
        }

        return false;
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

    if (user) {
        getFirebaseData(user);
        const scoreboardController = new ScoreboardController(scoreboardState);

        document.body.append(scoreboardController);
    } else {
        const defaultCredentials = JSON.parse(localStorage.getItem("__scoreboard_user") || "{}") as {
            username?: string;
            password?: string;
        };

        const loginComponent = new LoginComponent(defaultCredentials, async (username, password) => {
            await Promise.all([handleLogin(username, password), sleep(300)]);

            return true;
        });

        document.body.append(loginComponent);
    }
})();
