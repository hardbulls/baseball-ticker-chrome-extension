export const arrayBufferToString = (buffer: ArrayBuffer | string): string => {
    if (typeof buffer === "string") {
        return buffer
    }

    return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)))
}
