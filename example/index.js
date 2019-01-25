import {Graph} from 'graphfx';

let graph = null;

window.graph = () => graph;

/** @type {HTMLInputElement} */
const graphInput = document.getElementById('graph');
/** @type {HTMLInputElement} */
const imageInput = document.getElementById('input');
/** @type {HTMLImageElement} */
const inputImage = document.getElementById('inputImage')
const outputWrapper = document.getElementById('outputs');
/** @type {HTMLButtonElement} */
const runButton = document.getElementById('runButton');

/**
 * load graph from file
 */
graphInput.onchange = (event) => {
    const fr = new FileReader();
    const file = graphInput.files[0];
    fr.onload = () => {
        graph = Graph.deserialize(JSON.parse(fr.result));
    }
    fr.readAsText(file);
}

/**
 * load image from file
 */
imageInput.onchange = () => {
    inputImage.src = URL.createObjectURL(imageInput.files[0]);
}

/**
 * run ité
 */
runButton.onclick = () => {
    const input = graph.findIOByLabel('camera')[0];
    const outputs = graph.findIOByLabel(/^photo_\d+$/);
    console.log(outputs);
    outputWrapper.innerHTML = '';

    for (let output of outputs) {
        const label = output.label;
        const canvas = document.createElement('canvas');
        outputWrapper.appendChild(canvas);
        canvas.id = output.label;
        const onChange = (value) => {
            console.timeEnd(`processing ${label}`);
            canvas.width = value.width;
            canvas.height = value.height;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(value, 0, 0);
            output.offchange(onChange);
        };
        output.onchange(onChange);
    }
    for (let output of outputs) {
        console.time(`processing ${output.label}`);
    }
    input.value = inputImage;
}

const showResult = (value) => {


}