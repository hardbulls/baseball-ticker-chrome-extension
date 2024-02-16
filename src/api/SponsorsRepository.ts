export abstract class SponsorsRepository {
    private static domParser = new DOMParser();

    public static download = async () => {
        const html = (await Promise.resolve(
            new Promise((resolve) => {
                chrome.runtime.sendMessage({ url: "https://www.hardbulls.com/" }, (response) => {
                    resolve(response);
                });
            })
        )) as string;

        const dom = this.domParser.parseFromString(html, "text/html");
        const sponsors = [];

        const sponsorItems = dom.querySelectorAll(".cd-sponsors-item img") as NodeListOf<HTMLImageElement>;

        for (const item of sponsorItems) {
            sponsors.push(item.src.replace(window.location.origin, "https://www.hardbulls.com"));
        }

        return sponsors;
    };
}
