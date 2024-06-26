import { Gradient } from "../../lib/model/Gradient";
import { setComponent } from "../../lib/framework";

export class SponsorsComponent extends HTMLElement {
    private container: HTMLDivElement = document.createElement("div");
    private titleElement: HTMLDivElement = document.createElement("div");
    private imageContainerElement: HTMLDivElement = document.createElement("div");
    private imageElement: HTMLImageElement = document.createElement("img");
    private clearIntervalId?: number;
    private componentHeight: number = 208;

    constructor() {
        super();

        this.container.style.borderStyle = "solid";
        this.container.style.display = "flex";
        this.container.style.flexDirection = "column";
        this.container.style.height = `${this.componentHeight}px`;
        this.container.style.width = "340px";

        this.titleElement.style.textAlign = "center";
        this.titleElement.style.fontSize = "24px";

        this.imageContainerElement.style.display = "flex";
        this.imageContainerElement.style.justifyContent = "center";
        this.imageContainerElement.style.height = `calc(${this.componentHeight}px - ${this.titleElementHeightOffset()})`;
        this.imageContainerElement.style.padding = "0";

        this.imageElement.style.objectFit = "contain";
        this.imageElement.style.backgroundColor = "#ffffff";
        this.imageElement.style.height = "100%";
        this.imageElement.style.width = "100%";
        this.imageElement.style.maxHeight = `calc(${this.componentHeight}px - ${this.titleElementHeightOffset()})`;

        this.imageContainerElement.append(this.imageElement);

        this.container.append(this.titleElement, this.imageContainerElement);

        this.append(this.container);
    }

    public updateSponsors(sponsors: string[], interval: number) {
        if (this.clearIntervalId) {
            clearInterval(this.clearIntervalId);
        }

        this.clearIntervalId = setInterval(() => {
            this.imageElement.src = sponsors[Math.floor(Math.random() * sponsors.length)];
        }, Math.max(1000, Math.abs(interval)));

        this.imageElement.src = sponsors[Math.floor(Math.random() * sponsors.length)];
    }

    set fontLineHeight(fontLineHeight: number) {
        this.titleElement.style.lineHeight = fontLineHeight.toString();
    }

    set borderColor(color: string) {
        this.container.style.borderColor = color;
    }

    set borderSize(size: string) {
        this.container.style.borderWidth = size;
        this.container.style.height = `calc(${this.container}px - ${size} - ${size})`;

        this.imageContainerElement.style.paddingTop = size;
    }

    set fontColor(color: string) {
        this.titleElement.style.color = color;
    }

    set fontName(name: string) {
        this.container.style.fontFamily = name;
    }

    set backgroundGradient(gradient: Gradient) {
        this.container.style.background = `linear-gradient(${gradient.angle}deg, ${gradient.startColor}ff ${gradient.startPercentage}%, ${gradient.endColor}ff ${gradient.endPercentage}%)`;
    }

    set layoutGradient(gradient: Gradient) {
        this.titleElement.style.background = `linear-gradient(${gradient.angle}deg, ${gradient.startColor}ff ${gradient.startPercentage}%, ${gradient.endColor}ff ${gradient.endPercentage}%)`;
    }

    set sponsorsTitle(title: string) {
        this.titleElement.textContent = title;
        this.imageContainerElement.style.height = `calc(${this.componentHeight}px - ${this.titleElementHeightOffset()})`;
        this.imageElement.style.maxHeight = `calc(${this.componentHeight}px - ${this.titleElementHeightOffset()})`;
    }

    private titleElementHeightOffset(): string {
        return `(${this.titleElement.offsetHeight}px`;
    }
}

setComponent("sponsors-component", SponsorsComponent);
