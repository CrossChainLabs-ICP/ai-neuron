import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Cycles "mo:base/ExperimentalCycles";
import Buffer "mo:base/Buffer";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import List "mo:base/List";

import Types "./types";

shared(msg) persistent actor class Worker() {
  stable let owner = msg.caller;
  stable let maxItems : Nat = 10000;
  stable let maxGetItems : Nat = 10;
  
  stable var reportsBufferEntries : [Text] = [];
  stable var dataMapEntries : [(Text, Types.ReportItem)] = [];

  transient var reportsBuffer = Buffer.Buffer<Text>(maxItems);
  transient let dataMap = TrieMap.fromEntries<Text, Types.ReportItem>(dataMapEntries.vals(), Text.equal, Text.hash);

  reportsBufferEntries := [];
  dataMapEntries := [];

  system func preupgrade() {
    reportsBufferEntries := Buffer.toArray(reportsBuffer);
    dataMapEntries := Iter.toArray(dataMap.entries());
  };

  system func postupgrade() {
    reportsBuffer := Buffer.fromArray<Text>(reportsBufferEntries);
  };

  public query func balance(): async Nat {
    return Cycles.balance();
  };

  func updateData(data: Types.ReportItem): async () {
    switch (dataMap.get(data.proposalID)) {
        case (?_d) {
          let _ = dataMap.replace(data.proposalID, data);
        };
        case null {
            if (reportsBuffer.size() < maxItems) {
                dataMap.put(data.proposalID, data);

                reportsBuffer.insert(0, data.proposalID);
            };
        };
      };
  };


  public shared ({ caller }) func save_report(proposalID : Text, proposalTitle : Text, report : Text): async Nat {
    assert (owner == caller);
    
    let item: Types.ReportItem = {
      proposalID;
      proposalTitle;
      report;
    };

    await updateData(item);

    return reportsBuffer.size();
  };

  public query func get_reports_list(start : Nat, size : Nat): async [Text] {
    if ((start >= 0) and (start < reportsBuffer.size()) ) {
      var length = size;

      if (start + size >= reportsBuffer.size()) {
        length := reportsBuffer.size() - start;
      };
      let subBuffer = Buffer.subBuffer(reportsBuffer, start, length);
      return Buffer.toArray(subBuffer);
    };
    
    return [];
  };

  public query func get_report(proposalID : Text): async Types.ReportItem {
    switch (dataMap.get(proposalID)) {
      case (?d) {
        return d;
      };
      case null {
        let emptyItem: Types.ReportItem = {
          proposalID = "";
          proposalTitle = "";
          report = "";
        };

        return emptyItem;
      };
    };
  };

  public query func get_full_reports(proposalIDs : [Text]): async [Types.ReportItem] {
    var result : List.List<Types.ReportItem> = List.nil();

    if (Array.size(proposalIDs) > maxGetItems) {
      return List.toArray(result);
    };
    
    for (proposalID in proposalIDs.vals()) {
      switch (dataMap.get(proposalID)) {
        case (?d) {
          result := List.push(d, result);
        };
        case null {

        };
      };
    };

    let items = List.toArray(result);

    return Array.reverse(items);
  };
};

