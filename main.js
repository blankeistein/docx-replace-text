const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const xlsx = require("xlsx");

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((res) =>
        rl.question(query, (ans) => {
            rl.close();
            res(ans);
        })
    );
}

async function getData(filepath) {
    try {
        const workbook = xlsx.readFile(filepath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        return jsonData;
    } catch (e) {
        throw e;
    }
}

async function main() {
    try {
        let templatePath = await askQuestion("File master: ");
        templatePath = path.resolve(templatePath).trim();

        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);

        let dataPath = await askQuestion("File data: ");
        dataPath = path.resolve(dataPath).trim();
        const data = await getData(dataPath);

        const outputPath = await askQuestion("Simpan di folder mana: ");
        const prefixName = await askQuestion(
            "Template Nama (contoh File {name} - {index}): "
        );

        let index = 1;
        for (const item of data) {
            console.log(item);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });
            doc.render(item);
            const buf = doc.getZip().generate({
                type: "nodebuffer",
                compression: "DEFLATE",
            });

            let name = { ...item, index };

            let filename =
                prefixName.replace(/\{(\w+)\}/g, (match, key) => {
                    return name[key] !== undefined ? name[key] : match;
                }) + ".docx";

            if (!fs.existsSync(path.resolve(outputPath))) {
                fs.mkdirSync(path.resolve(outputPath));
            }

            fs.writeFileSync(path.resolve(outputPath, filename), buf);
            index += 1;
        }
    } catch (e) {
        console.log(`[ERROR] ${e.message}`);
    }
}

main();
