import fetch from "isomorphic-fetch";
import { HttpAgent } from "@dfinity/agent";
import { createActor as createMainActor} from "../../declarations/ai-neuron-backend/index.js";

import { HOST, CANISTER_ID } from './config';

export class ClientICP {
  constructor() {
    const agent = new HttpAgent({
        //identity: identity,
        host: HOST,
        fetch,
    });
    this.agent = agent;
    this.workers = [];
    this.mainActor = createMainActor(CANISTER_ID, {agent});
  }

  async get_reports_list(start, size) {
    let items = [];

    try {
      const metadata_reports_list = await this.mainActor.get_reports_list(start, size);

      if (metadata_reports_list?.length > 0) {
        items = metadata_reports_list;
      } else {
        return [];
      }
    }
    catch (e) {
      console.log(e);
    }

    return items;
  }

  async get_full_reports(start, size) {
    let items = [];

    try {
      const reports_ids_list = await this.mainActor.get_reports_list(start, size);

      if (reports_ids_list?.length > 0) {
        items = await this.mainActor.get_full_reports(reports_ids_list);
      } else {
        return [];
      }
    }
    catch (e) {
      console.log(e);
    }

    return items;
  }

}