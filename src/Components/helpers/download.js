/**
 * @param {Blob} blob
 * @param {String} name
 */
export const downloadBlob = (blob, name) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
}