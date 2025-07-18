import { saveAs } from "file-saver";

/**
 *
 * @param {string} filename
 * @param {Blob | string} data
 * @returns
 */
export default function download(filename, data) {
    return saveAs(data, filename);
}

/**
 *
 * @param {Blob} blob
 * @returns
 */
export async function readAsArrayBuffer(blob) {
    return new Promise((res) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            res(event.target.result);
        };

        reader.readAsArrayBuffer(blob);
    });
}
