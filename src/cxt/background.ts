import { FirebaseUpdater } from "./remote/firebase";
import { DEFAULT_OPTIONS_STATE, DEFAULT_POPUP_STATE } from "../lib/state/DefaultState";
import { Local } from "./storage/Local";
import { MessageType } from "../lib/model/MessageType";

(async () => {
    let firebaseUpdater: FirebaseUpdater | undefined = undefined;
    const popupState = { ...DEFAULT_POPUP_STATE, ...(await Local.getPopup()) };
    const options = { ...DEFAULT_OPTIONS_STATE, ...(await Local.getOptions()) };
    let remoteState = options.remote;
    let enableRemote = popupState.enableRemote;
    let shouldReconnect = true;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === MessageType.KEEP_AWAKE || message.type === MessageType.ALLOW_SLEEP) {
            const tab = sender.tab;

            if (tab?.id) {
                chrome.tabs.update(
                    tab.id,
                    {
                        autoDiscardable: MessageType.KEEP_AWAKE !== message.type,
                    },
                    () => {
                        sendResponse(true);
                    }
                );
            }

            return true;
        }

        if (message.type === MessageType.FETCH) {
            fetch(message.url)
                .then((res) => {
                    return res.text();
                })
                .then((res) => {
                    sendResponse(res);
                });

            return true;
        }

        if (message.type === MessageType.PING) {
            sendResponse(true);

            return true;
        }

        sendResponse(false);

        return false;
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.options) {
            if (changes.options.newValue !== undefined) {
                if (changes.options?.newValue.remote !== undefined) {
                    const newRemoteState = changes.options.newValue.remote;
                    if (newRemoteState.username !== remoteState.username || newRemoteState.password !== remoteState.password) {
                        shouldReconnect = true;
                    }

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

            if (!shouldReconnect) {
                return;
            }

            if (remoteState.username && remoteState.password && remoteState.firebaseConfig) {
                await firebaseUpdater.enable(remoteState.username, remoteState.password, remoteState.firebaseConfig);
                shouldReconnect = false;
            }
        } else {
            await firebaseUpdater?.disable();
            shouldReconnect = true;
        }
    }

    await toggleFirebaseUpdated();
})();
