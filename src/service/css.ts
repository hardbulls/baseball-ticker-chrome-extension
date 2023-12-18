import { Gradient } from "../baseball/model/Gradient"

export const generateGradient = (gradient: Gradient) => {
    return `linear-gradient(${gradient.angle}deg, ${gradient.startColor}ff ${gradient.startPercentage}%, ${gradient.endColor}ff ${gradient.endPercentage}%)`
}
