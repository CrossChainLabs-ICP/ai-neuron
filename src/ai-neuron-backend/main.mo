import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import List "mo:base/List";

import IC "./ic.types";
import Workers "./worker";
import Whitelist "./whitelist";

shared(msg) persistent actor class ReportsStorage() {
  type Worker = Workers.Worker;

  let owner = msg.caller;
  let maxWorkers : Nat = 8;
  stable var nextId : Nat = 0;
  let maxItems : Nat = 20000;
  let cycleShare = 5_000_000_000_000; //5T cycles;
  private let ic : IC.Self = actor "aaaaa-aa";

  stable var nextWorkerId : Nat = 0; 
  stable var workersItemsEntries: [var Nat] = [var];
  stable var workersEntries : [var ?Worker] = [var];

  var workersItems : [var Nat] = Array.init<Nat>(maxWorkers, 0);
  var workers : [var ?Worker] = Array.init(maxWorkers, null);

  transient let admins = TrieMap.fromEntries<Text, Nat32>(Whitelist.Admins.vals(), Text.equal, Text.hash);

  system func preupgrade() {
    workersEntries := workers;
    workersItemsEntries := workersItems;
  };

  system func postupgrade() {
    if (workersEntries.size() > 0) {
        workers := workersEntries;
    };
    if (workersItemsEntries.size() > 0) {
        workersItems := workersItemsEntries;
    };
  };

  private func isAdmin(principal: Text): Bool {
    switch (admins.get(principal)) {
      case (?p) {
        return true;
      };
      case null {
        return false;
      };
    };
  };

  public query func balance(): async Nat {
    return Cycles.balance();
  };

  public shared ({ caller }) func upgrade(wasmModule: Blob) : async() {
    assert (owner == caller);

    var idx = 0;

    while (idx < nextWorkerId) {
      switch (workers[idx]) {
        case (?worker) {
            let workerPrincipal = Principal.fromActor(worker);
            await ic.install_code({
              arg = "";
              wasm_module = wasmModule;
              mode = #upgrade;
              canister_id = workerPrincipal;
            });
          };
          case null {

          };
      };
      idx += 1;
    };
  };

  public shared ({ caller }) func delete_workers() : async() {
    assert (owner == caller);

    var idx = 0;

    while (idx < nextWorkerId) {
      switch (workers[idx]) {
        case (?worker) {
            let workerPrincipal = Principal.fromActor(worker);
            await ic.stop_canister({
              canister_id = workerPrincipal;
            });
            await ic.delete_canister({
              canister_id = workerPrincipal;
            });
          };
          case null {

          };
      };
      idx += 1;
    };

    var tmpWorkersItems : [var Nat] = Array.init<Nat>(maxWorkers, 0);
    var tmpWorkers : [var ?Worker] = Array.init(maxWorkers, null);

    nextWorkerId := 0;
    workersItems := tmpWorkersItems;
    workers := tmpWorkers;
  };

  public shared ({ caller }) func autoscale() : async Nat {
    let principal: Text = Principal.toText(caller);

    if (isAdmin(principal) != true) {
      return 1;
    };

    if (Cycles.balance() / 2 < cycleShare) {
      return 2;
    };

    if (nextWorkerId == 0) {
        Cycles.add(cycleShare);
        let w = await Workers.Worker();
        workers[nextWorkerId] := ?w;
        nextWorkerId += 1;
    } else if (nextWorkerId + 1 < maxWorkers ) {
      if (workersItems[nextWorkerId - 1] > (maxItems / 2)) {
        Cycles.add(cycleShare);
        let w = await Workers.Worker();
        workers[nextWorkerId] := ?w;
        nextWorkerId += 1;
      }
    };

    return 0;
  };

  public query func get_workers() : async [Text] {
    var workersList : List.List<Text> = List.nil();
    var idx = 0;

    while (idx < nextWorkerId) {
      switch (workers[idx]) {
        case (?worker) {
            let workerPrincipal = Principal.toText(Principal.fromActor(worker));
            workersList := List.push<Text>(workerPrincipal, workersList);
          };
          case null {

          };
      };
      idx += 1;
    };

    return List.toArray(workersList);
  };

  public shared ({ caller }) func saveReport(proposalID : Text, proposalTitle : Text, report : Text) : async Bool {
    let principal: Text = Principal.toText(caller);

    if (isAdmin(principal) != true) {
      return false;
    };

    var idx = 0;
    var added = false;
    var shouldScale = false;

    //publish reports to ocbot

    while ((idx < nextWorkerId) and (not added)) {
        if (( workers[idx] != null) and (workersItems[idx] < maxItems)) {
          switch (workers[idx]) {
            case (?worker) {
              let items = await worker.save_report(proposalID, proposalTitle, report);
              workersItems[idx] := items;
              if ((items >= maxItems) and (idx + 1 == nextWorkerId)) {
                shouldScale := true;
              };
              added := true;
            };
            case null {

            };
          };
        };
        if (not added) {
          idx += 1;
        };
    };

    return shouldScale;
  };
};
