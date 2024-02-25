import { FirebaseConfig } from "../remote/FirebaseConfig";

export type RemoteState = {
    firebaseConfig?: FirebaseConfig;
    username?: string;
    password?: string;
};
