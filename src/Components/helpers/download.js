/**
 * @param {Blob} blob
 */
export const downloadBlob = (blob) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${this.selectedSaveSlot}.json`;
    a.click();
}