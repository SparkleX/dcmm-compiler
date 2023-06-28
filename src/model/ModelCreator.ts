import handlebars from "handlebars";
import fs from "fs";
import { glob } from "glob";
import jsonfile from "jsonfile";
import path from "path";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resourcePath = path.join(__dirname, '../../resources');



const outputFolder = "src/generated/model";

function convertType(x1) {
	if (x1 == "number") {
		return "number";
	} else if (x1 == "string" || x1 == "text" || x1 == "decimal"|| x1 == "date") {
		return "string";
	} else {
		return "any";
	}
}
export function buildModel() {
	const templateFile = `${resourcePath}/model/Model.handlebars`;
	const source = fs.readFileSync(templateFile, "utf8");
	const template = handlebars.compile(source);
	handlebars.registerHelper("convertType", convertType);

	let files = glob.sync(`resources/table/*.table.json`);
	fs.mkdirSync(outputFolder, { recursive: true });
	for (const file of files) {
		const a = path.basename(file);
		const tableName = a.split('.')[0];
		const json = jsonfile.readFileSync(file);
		json.name = tableName;
		if(json.extends) {
			continue;
		}
		const outputFile = `${outputFolder}/${json.name}Model.ts`;
		//const masterTable = oMasterTemplate.getMasterTable(json.name);
		//if (masterTable) {
		//	continue;
		//}
		console.debug(`${file} ==> ${outputFile}`);
		//json.templates = oMasterTemplate.getTemplateTables(json.name);

		const sourceCode = template(json);
		fs.writeFileSync(outputFile, sourceCode);
	}
}
