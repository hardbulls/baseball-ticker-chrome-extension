export function removeOptions(selectElement: HTMLSelectElement) {
    const optionsCount = selectElement.options.length - 1;

    for (let i = optionsCount; i >= 0; i--) {
        selectElement.remove(i);
    }
}
