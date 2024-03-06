import { InningValue } from "./model/Inning";
import { InningHalfEnum } from "./model/InningHalfEnum";

export function numberToInning(value: number): InningValue {
    const isTop = value % 1 === 0;
    const inning = Math.floor(value);

    return {
        half: isTop ? InningHalfEnum.TOP : InningHalfEnum.BOTTOM,
        value: inning,
    };
}
