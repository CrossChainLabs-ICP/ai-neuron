import fetch from "isomorphic-fetch";
import { HttpAgent } from "@dfinity/agent";
import { createActor as createMainActor} from "../../declarations/ai-neuron-backend/index.js";
import { createActor as createWorkerActor} from "../../declarations/ai-neuron-backend-worker/index.js";

import { HOST, CANISTER_ID } from './config';
const MAX_ITEMS = 10000;

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
    console.log(`ClientICP[${CANISTER_ID}]`);
  }

  async init() {
    if (this.workers.length > 0) {
      return;
    }

    try {
      const workers = await this.mainActor.get_workers();
      if (workers?.length > 0) {
        for (const w of workers) {
          this.workers.push(createWorkerActor(w, {agent : this.agent}))
        }
      }

    } catch (e) {
      console.log(e);
    }
  }

    async get_reports_list(start, size) {
      console.log('get_full_reports');
      let items = [];

      try {
        if (this.workers?.length <= 0) {
          await this.init();
        }

        console.log(this.workers);

      //determine the correct worker
      const workerOffset = parseInt(start / MAX_ITEMS)
      let currentWorker = null;

      console.log('workerOffset', workerOffset);

      console.log('this.workers', this.workers);



      if (workerOffset >= 0 && workerOffset <= this.workers.length) {
        currentWorker = this.workers[this.workers.length - workerOffset - 1];
      }

      const metadata_reports_list = await currentWorker.get_reports_list(start, size);
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
    console.log('get_full_reports');

    try {
      if (this.workers?.length <= 0) {
        await this.init();
      }

      //determine the correct worker
      const workerOffset = parseInt(start / MAX_ITEMS)
      let currentWorker = null;

      console.log('workerOffset', workerOffset);

      console.log('this.workers', this.workers);

      if (workerOffset >= 0 && workerOffset <= this.workers.length) {
        currentWorker = this.workers[this.workers.length - workerOffset - 1];
      }

      const metadata_reports_list = await currentWorker.get_reports_list(start, size);
      console.log(metadata_reports_list);
      if (metadata_reports_list?.length > 0) {
        items = await currentWorker.get_full_reports(metadata_reports_list);
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