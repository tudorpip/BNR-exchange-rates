import { GenezioDeploy, GenezioMethod } from "@genezio/types";
import { loadIntoDb } from "./index";
/**
 * This class can be deployed on genezio infrastructure
 * using the "genezio deploy" command or tested locally using "genezio local".
 */
@GenezioDeploy()
export class Scheduler {
  @GenezioMethod({ type: "cron", cronString: "* * * * *" })
  public async everyMinuteTask() {
    loadIntoDb();
  }
}
