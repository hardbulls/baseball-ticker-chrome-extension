export abstract class Session {
    public static getControlPanelId = async () => {
        return ((await chrome.storage.session.get(["controlPanelId"])).controlPanelId as number) || undefined
    }

    public static getTeamsPanelId = async () => {
        return ((await chrome.storage.session.get(["teamsPanelId"])).teamsPanelId as number) || undefined
    }

    public static getOverlayPanelId = async () => {
        return ((await chrome.storage.session.get(["overlayPanelId"])).overlayPanelId as number) || undefined
    }

    public static resetOverlayPanelId = async () => {
        return await chrome.storage.session.remove(["overlayPanelId"])
    }

    public static resetControlPanelId = async () => {
        return await chrome.storage.session.remove(["controlPanelId"])
    }

    public static resetTeamsPanelId = async () => {
        return await chrome.storage.session.remove(["teamsPanelId"])
    }
}
