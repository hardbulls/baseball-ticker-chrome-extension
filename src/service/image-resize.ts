export const resizeImage = async (width: number, file: string, quality: number = 1): Promise<string> => {
    quality = Math.max(Math.min(quality, 1), 0) // 0 <= quality <= 1
    return new Promise((resolve, reject) => {
        const img = new Image()

        img.src = file

        img.onload = () => {
            const canvas = document.createElement("canvas")

            const scaleFactor = width / img.width

            canvas.width = width
            canvas.height = img.height * scaleFactor

            //draw in canvas
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                return reject(new Error("Resizing image failed."))
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const dataUrl = canvas.toDataURL(parseBase64Type(file), quality)

            resolve(dataUrl)
        }
    })
}

const parseBase64Type = (data: string) => {
    return data.substring(data.indexOf(":") + 1, data.indexOf(";"))
}
