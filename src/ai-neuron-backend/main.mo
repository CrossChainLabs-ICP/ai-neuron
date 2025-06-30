import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

shared(msg) actor class ReportStorage() {
let reportsMap = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  public shared({caller}) func saveReport(proposalID : Text, auditB64 : Text) : async ?Text {
     return reportsMap.replace(proposalID, auditB64);
  };

  // Get one report by proposalID
  public query func getReport(proposalID : Text) : async ?Text {
    return reportsMap.get(proposalID);
  };

  // List all reports
  public query func listReports() : async [Text] {
    let array = Iter.toArray(reportsMap.vals());
    return array;
  };
}
