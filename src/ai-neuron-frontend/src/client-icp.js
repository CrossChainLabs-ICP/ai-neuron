import fetch from "isomorphic-fetch";
import { HttpAgent } from "@dfinity/agent";
import { createActor as createMainActor} from "/declarations/ai-neuron-backend";
import { createActor as createWorkerActor} from "/declarations/ai-neuron-backend-worker";

const { HOST } = require ('./config');
const MAX_ITEMS = 10000;

export class ClientICP {
  constructor(canisterID) {
    const agent = new HttpAgent({
        //identity: identity,
        host: HOST,
        fetch,
    });
    this.agent = agent;
    this.workers = [];
    this.mainActor = createMainActor(canisterID, {agent});
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

  async refresh_latest_reports_list() {
    if (this.workers.length <= 0)
      return;

    try {
      const currentWorker = this.workers[this.workers.length - 1];
      this.latest_reports_list = await currentWorker.get_list();
    } catch (error) {
      console.log(error);
    }
  }

  async get_full_reports(start, size) {
    let items = [];

    try {
      if (this.workers?.length < 0) {
        await this.init();
        return;
      }

      //determine the correct worker
      const workerOffset = parseInt(start / MAX_ITEMS)
      let currentWorker = null;

      if (workerOffset >= 0 && workerOffset <= this.workers.length) {
        currentWorker = this.workers[this.workers.length - workerOffset];
      }

      const metadata_reports_list = await currentWorker.get_list(start, size);
      if (metadata_reports_list?.length) {
        return [];
      }

      let end = start + size;

      if (start >= metadata_reports_list.length) {
        return [];
      }

      if (end > metadata_reports_list.length) {
        end = metadata_reports_list.length;
      }

      items = await currentWorker.get_full_reports(metadata_reports_list.slice(start, end));
    }
    catch (e) {
      console.log(e);
    }

    return items;
  }



}