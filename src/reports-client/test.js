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
    let filePath = '~/.config/dfx/identity/ai-neuron/identity.pem';
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

    const status = await actor.autoscale();
    if (status == 0) {
        console.log(`autoscale succesful`);
    } else {
        console.log(`autoscale failed, error code: ${status}`);
    }

    for (let i = 0; i < 20; i++) {
        const proposalID = `proposal${i}`;
        const shouldScale = await actor.saveReport(
            proposalID, //proposalID
            'title1', //proposalTitle
            'base64Report', //report
        );

        if (shouldScale) {
            const status = await se_actor.autoscale();
            if (status == 0) {
                console.log(`autoscale succesful`);
            } else {
                console.log(`autoscale failed, error code: ${status}`);
            }
        }

        console.log(`Added ${proposalID}`);
    }
}

async function test_search() {
    const identity = getSecp256k1Identity();

    const agent = new HttpAgent({
        identity: identity,
        host: config.host,
        fetch,
    });

    const actor = createActor(config.canister_id, { agent });

    const r = await actor.search('nft', 1, 0); 
    console.log(r);
}

(async () => {
    await test_saveReport();
})();
