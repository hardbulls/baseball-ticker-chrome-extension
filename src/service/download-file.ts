export const downloadFile = (name: string, content: string) => {
    const element = document.createElement("a")

    element.style.display = "none"

    const file = new Blob([content], { type: "application/json" })

    element.href = URL.createObjectURL(file)
    element.download = `${name}.json`
    document.body.appendChild(element)
    element.click()

    document.body.removeChild(element)
}
