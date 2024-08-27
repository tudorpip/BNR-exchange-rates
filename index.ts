import axios from "axios";
import { parseStringPromise } from "xml2js";
import { BigQuery } from "@google-cloud/bigquery";
import fs, { writeFile } from "fs";
import path from "path";
// import { schema } from "./schema";
import { GenezioDeploy, GenezioMethod } from "@genezio/types";
import { fetchRates } from "./src/fetchRates";
import { writeToFile } from "./src/writeToFile";

const bigquery = new BigQuery();
const currentDir = process.cwd();
const tempFilePath = path.join(currentDir, "temp.json");

export const schema = [
  { name: "currency", type: "STRING" },
  { name: "rate", type: "FLOAT" },
  { name: "multiplier", type: "INTEGER" },
  { name: "date", type: "STRING" },
];

export async function loadIntoDb(): Promise<void> {
  try {
    const rows = await fetchRates();

    await writeToFile(rows, tempFilePath);

    const [job] = await bigquery
      .dataset("bnr_currency_keeper")
      .table("Currencies")
      .load(tempFilePath, {
        sourceFormat: "NEWLINE_DELIMITED_JSON",
        schema: { fields: schema },
      });

    fs.unlink(tempFilePath, (err) => {
      if (err) {
        console.error("Error deleting the file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });

    console.log(
      "Added rows to the table : " + job.statistics?.load?.outputRows
    );
    console.log("Data successfully inserted");
  } catch (error) {
    console.error("Error in loadIntoDb:", error);
  }
}
loadIntoDb();
@GenezioDeploy()
export class Scheduler {
  @GenezioMethod({ type: "cron", cronString: "* * * * *" })
  public async everyMinuteTask() {
    loadIntoDb();
  }
}
