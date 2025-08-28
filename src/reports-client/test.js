import fetch from "isomorphic-fetch";
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../declarations/ai-neuron-backend/index.js";
import { Secp256k1KeyIdentity } from "@dfinity/identity-secp256k1";

import { config } from './config.js';

import pemfile from 'pem-file';
import fs from 'fs';
import path from 'path';
//import { uploader } from './config';

const getSecp256k1Identity = () => {
    let filePath = config.identityFile;
    const rawKey = fs.readFileSync(path.resolve(filePath.replace(/^~(?=$|\/|\\)/, process.env.HOME || process.env.USERPROFILE))).toString();
    
    return Secp256k1KeyIdentity.fromSecretKey(
        pemfile.decode(rawKey.replace(/(\n)\s+/g, '$1'),).slice(7, 39),);
};

/*
function createIdentity() {
    const privateKey = config.identityPrivateKey;
    console.log( config.identityPrivateKey);
    const privateKeyPem = privateKey.replace(/\\n/g, "\n");
    console.log(privateKeyPem);
    try {
        return Secp256k1KeyIdentity.fromPem(privateKeyPem);
    } catch (err) {
        console.error("Unable to create identity from private key", err);
        throw err;
    }
}
*/


async function test_saveReport() {
    const identity = getSecp256k1Identity();

    const agent = new HttpAgent({
        identity: identity,
        host: config.host,
        fetch,
    });

    const actor = createActor(config.canister_id, { agent });

    for (let i = 0; i < 20; i++) {
        const proposalID = `proposal${i}`;
        const result = await actor.saveReport(
            proposalID, //proposalID
            'title1', //proposalTitle
            'base64Report', //report
        );

        console.log(`Added ${proposalID}, result: ${result}`);
    }
}

async function test_getReports() {
    const identity = getSecp256k1Identity();

    const agent = new HttpAgent({
        identity: identity,
        host: config.host,
        fetch,
    });

    const actor = createActor(config.canister_id, { agent });

    const reportIDsList = await actor.get_reports_list(0, 10);
    console.log('reportIDsList:');
    console.log(reportIDsList);
    for (const id of reportIDsList) {
        const fullReport = await actor.get_report(id);
        console.log(fullReport);
    }

    console.log('allReports:');
    const allReports = await actor.get_full_reports(reportIDsList);
    console.log(allReports);
    console.log(allReports?.length);

}

(async () => {
    //await test_saveReport();
    await test_getReports();
})();
