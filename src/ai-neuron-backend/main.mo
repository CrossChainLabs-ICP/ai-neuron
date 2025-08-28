import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";
import Cycles "mo:base/ExperimentalCycles";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Map "mo:base/OrderedMap";
import Buffer "mo:base/Buffer";



import Types "./types";

shared(msg) persistent actor class ReportsStorage() {
  let _owner = msg.caller;
  let maxItems : Nat = 10000;
  let maxGetItems : Nat = 10;

  transient var reportsBuffer = Buffer.Buffer<Text>(maxItems);
  transient let dataMap = TrieMap.TrieMap<Text, Types.ReportItem>(Text.equal, Text.hash);

  private func isAdmin(principal: Text): Bool {
    if (principal == "rvrmz-wweu3-42mnz-5mqqx-p7rsp-sampf-mvltv-doc47-i37eh-ilyde-2qe") {
      return true;
    } else {
      return false;
    };
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

  public shared ({ caller }) func saveReport(proposalID : Text, proposalTitle : Text, report : Text) : async Nat {
    let principal: Text = Principal.toText(caller);

    assert (isAdmin(principal) == true);

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
