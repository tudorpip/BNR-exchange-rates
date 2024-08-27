import axios from "axios";
import { parseStringPromise } from "xml2js";
import { schema } from "./schema";

export async function fetchRates(): Promise<any[]> {
  const response = await axios.get("https://www.bnr.ro/nbrfxrates.xml");
  const result = await parseStringPromise(response.data);
  const rates = result.DataSet.Body[0].Cube[0].Rate;

  const currentDate = new Date();

  // Add one day to the current date
  const tomorrowDate = new Date(currentDate);
  tomorrowDate.setDate(currentDate.getDate() + 1);

  // Get the ISO string and split it to get the date part
  const tomorrowDateString = tomorrowDate.toISOString().split("T")[0];
  //   const currentDate = new Date().toISOString().split("T")[0];
  return rates.map((rate: any) => ({
    currency: rate.$.currency,
    rate: parseFloat(rate._),
    multiplier: parseInt(rate.$.multiplier || "1", 10),
    date: tomorrowDate,
  }));
}
