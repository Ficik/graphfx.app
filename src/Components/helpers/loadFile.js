/** @typedef {'readAsDataURL'|'readAsText'|'readAsBinaryString'|'readAsArrayBuffer'} FileReaderTypes */

/**
 *
 * @param {File} file
 * @param {FileReaderTypes} type
 */
const readFile = (file, type) => new Promise((resolve) => {
    const fr = new FileReader()
    fr.onload = () => resolve(fr.result);
    fr[type](file);
});

/**
 * @param {FileReaderTypes} type
 * @param {String} mimetype
 */
export const loadFile = (type, mimetype) => new Promise((resolve) => {
    const input = document.createElement('input');
    window.$$graphfxFileInput = input;
    input.type = 'file';
    input.accept = mimetype;
    input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            resolve(await readFile(file, type));
        }
    }
    input.click();
});