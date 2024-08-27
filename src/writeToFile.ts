import fs from "fs";
import { promisify } from "util";

const writeFile = promisify(fs.writeFile);

export async function writeToFile(
  data: any[],
  filePath: string
): Promise<void> {
  const fileStream = fs.createWriteStream(filePath);
  data.forEach((item) => {
    fileStream.write(JSON.stringify(item) + "\n");
  });
  fileStream.end();

  await new Promise((resolve, reject) => {
    fileStream.on("finish", resolve);
    fileStream.on("error", reject);
  });
}
