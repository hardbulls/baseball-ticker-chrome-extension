import { FirebaseUpdater } from "./remote/firebase";
import { DEFAULT_OPTIONS_STATE, DEFAULT_POPUP_STATE } from "./state/DefaultState";
import { Local } from "./storage/Local";
import { MessageType } from "./chrome/MessageType";

(async () => {
    let firebaseUpdater: FirebaseUpdater | undefined = undefined;
    const popupState = { ...DEFAULT_POPUP_STATE, ...(await Local.getPopup()) };
    const options = { ...DEFAULT_OPTIONS_STATE, ...(await Local.getOptions()) };
    let remoteState = options.remote;
    let enableRemote = popupState.enableRemote;
    let isRemoteEnabled = false;

    chrome.runtime.onMessage.addListener(function (message, _, sendResponse) {
        if (message.type === MessageType.FETCH) {
            fetch(message.url)
                .then((res) => {
                    return res.text();
                })
                .then((res) => {
                    sendResponse(res);
                });

            return;
        }

        if (message.type === MessageType.PING) {
            sendResponse(true);

            return;
        }
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.options) {
            if (changes.options.newValue !== undefined) {
                if (changes.options?.newValue.remote !== undefined) {
                    remoteState = changes.options.newValue.remote;

                    toggleFirebaseUpdated();
                }
            }
        }

        if (changes.popup) {
            if (changes.popup.newValue !== undefined) {
                enableRemote = changes.popup.newValue.enableRemote;

                toggleFirebaseUpdated();
            }
        }
    });

    async function toggleFirebaseUpdated() {
        if (enableRemote) {
            if (!firebaseUpdater) {
                firebaseUpdater = new FirebaseUpdater();
            }

            if (isRemoteEnabled) {
                return;
            }

            if (remoteState.username && remoteState.password && remoteState.firebaseConfig) {
                await firebaseUpdater.enable(remoteState.username, remoteState.password, remoteState.firebaseConfig);
                isRemoteEnabled = true;
            }
        } else {
            await firebaseUpdater?.disable();
            isRemoteEnabled = false;
        }
    }

    await toggleFirebaseUpdated();
})();
