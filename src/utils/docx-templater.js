import { read, utils } from "xlsx";

export async function getData(buffer) {
    try {
        const workbook = read(buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = utils.sheet_to_json(worksheet);
        const formattedData = jsonData.map((item) => {
            for (const column of Object.keys(item)) {
                if (typeof item[column] === "number") {
                    item[column] = item[column].toLocaleString("id-ID");
                }
            }

            return item;
        });

        return jsonData;
    } catch (e) {
        throw e;
    }
}
