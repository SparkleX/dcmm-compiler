import handlebars from "handlebars";
import fs from "fs";
import { glob }  from "glob";
import jsonfile from "jsonfile";
import path from "path";
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resourcePath = path.join(__dirname, '../../resources');


const jsonTableFolder = "resources/sql";
const outputFolder = "src/generated/sql";

function formatSql(config:any):string {
	let sql: string;
	if(config instanceof Object) {
		sql = config.sql;
	} else {
		sql = config;
	}
	sql = "`" + sql.replace(/[\[\]]/g, '"') + "`";
	return sql;

}
export function buildSql() {
	const source = fs.readFileSync(`${resourcePath}/sql/Sql.handlebars`, "utf8");
	const template = handlebars.compile(source);
	handlebars.registerHelper("formatSql", formatSql);

	const files = glob.sync(`${jsonTableFolder}/*.sql.json`);
	fs.mkdirSync(outputFolder, { recursive: true });
	for (const file of files) {
		const oFilePath = path.parse(file);
		const name = oFilePath.name.split(".")[0]
		const json = jsonfile.readFileSync(file);
		const outputFile = `${outputFolder}/${name}Sql.ts`;
		console.debug(`${file} ==> ${outputFile}`);

		const sourceCode = template({body:json, name:name});
		fs.writeFileSync(outputFile, sourceCode);
	}
}