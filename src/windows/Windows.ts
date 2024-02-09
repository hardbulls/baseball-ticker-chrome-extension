export abstract class Windows {
    public static exists = async (windowId?: number) => {
        if (!windowId) {
            return false
        }

        try {
            if (await chrome.windows.get(windowId)) {
                return true
            }
        } catch (err) {
            return false
        }
    }
}
