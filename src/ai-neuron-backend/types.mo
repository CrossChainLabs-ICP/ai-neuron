import Nat32 "mo:base/Nat32";
import Nat16 "mo:base/Nat16";
import Nat "mo:base/Nat";
module Types {
    public type ReportItem = {
        proposalID : Text;
        proposalTitle : Text;
        report : Text;
    };
};