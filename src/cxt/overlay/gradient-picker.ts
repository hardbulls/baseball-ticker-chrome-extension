import { Gradient } from "../../lib/model/Gradient";
import { setComponent } from "../../lib/framework";

export class GradientPicker extends HTMLElement {
    private startColorInput = document.createElement("input");
    private endColorInput = document.createElement("input");
    private startPercentageInput = document.createElement("input");
    private endPercentageInput = document.createElement("input");
    private angleInput = document.createElement("input");

    constructor() {
        super();

        this.startColorInput.type = "color";
        this.endColorInput.type = "color";
        this.startPercentageInput.type = "range";
        this.startPercentageInput.min = "0";
        this.startPercentageInput.max = "100";
        this.startPercentageInput.step = "5";
        this.endPercentageInput.type = "range";
        this.endPercentageInput.min = "0";
        this.endPercentageInput.max = "100";
        this.endPercentageInput.step = "5";

        this.startPercentageInput.style.width = "70px";
        this.endPercentageInput.style.width = "70px";
        this.angleInput.style.width = "3em";

        this.angleInput.type = "number";
        this.angleInput.min = "0";
        this.angleInput.max = "360";
        this.angleInput.step = "5";

        this.append(this.startColorInput, this.endColorInput, this.startPercentageInput, this.endPercentageInput, this.angleInput);
    }

    get gradient(): Gradient {
        return {
            startPercentage: Number.parseInt(this.startPercentageInput.value),
            endPercentage: Number.parseInt(this.endPercentageInput.value),
            startColor: this.startColorInput.value,
            endColor: this.endColorInput.value,
            angle: Number.parseInt(this.angleInput.value),
        };
    }

    set gradient(gradient: Gradient) {
        this.startColorInput.value = gradient.startColor;
        this.endColorInput.value = gradient.endColor;
        this.startPercentageInput.value = gradient.startPercentage.toString();
        this.endPercentageInput.value = gradient.endPercentage.toString();
        this.angleInput.value = gradient.angle.toString();
    }
}

setComponent("gradient-picker", GradientPicker);
