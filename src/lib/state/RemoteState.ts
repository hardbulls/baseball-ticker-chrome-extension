import { FirebaseOptions } from "@firebase/app";

export type RemoteState = {
    firebaseConfig?: FirebaseOptions;
    username?: string;
    password?: string;
};
