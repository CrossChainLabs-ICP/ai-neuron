import TrieMap "mo:base/TrieMap";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Iter "mo:base/Iter";

shared(msg) actor class AuditStorage() {
let auditMap = TrieMap.TrieMap<Text, Text>(Text.equal, Text.hash);

  public shared({caller}) func addAudit(proposalID : Text, auditB64 : Text) : async ?Text {
     return auditMap.replace(proposalID, auditB64);
  };

  // Get one audit by proposalID
  public query func getAudit(proposalID : Text) : async ?Text {
    return auditMap.get(proposalID);
  };

  // List all audits
  public query func listAudits() : async [Text] {
    let array = Iter.toArray(auditMap.vals());
    return array;
  };
}
