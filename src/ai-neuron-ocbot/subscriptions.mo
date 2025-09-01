import Debug "mo:base/Debug";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Timer "mo:base/Timer";
import Base "mo:openchat-bot-sdk/api/common/base";
import Chat "mo:openchat-bot-sdk/api/common/chat";
import Client "mo:openchat-bot-sdk/client";
import ReportsStorage "canister:ai-neuron-backend";
import Hash "mo:base/Hash";
import Text "mo:base/Text";

module {
    let maxIterations : Nat8 = 100;
    
    public func new<system>(subs : [Sub]) : ChatSubscriptions {
        var subscriptions = ChatSubscriptions();
        for (sub in subs.vals()) {
            ignore subscriptions.set<system>(sub);
        };
        subscriptions;
    };

    public type Sub = {
        chat : Chat.Chat;
        interval : Nat;
        apiGateway : Base.CanisterId;
        iterations : Nat8;
    };

    public class ChatSubscriptions() {
        var map = HashMap.HashMap<Chat.Chat, Record>(10, Chat.equal, Chat.hash);

        // Insert or update an interval for a chat and return true if it already existed
        public func set<system>(sub : Sub) : Bool {
            // If we already have a record, reuse its sentReports set; otherwise create a new one
            let (exists, prevSentReports) = switch (map.get(sub.chat)) {
                case (?record) {
                    Timer.cancelTimer(record.timerId);
                    (true, record.sentReports)
                };
                case null {
                    let fresh = HashMap.HashMap<Text, Bool>(
                        16,
                        Text.equal, 
                        Text.hash
                    );
                    (false, fresh)
                };
            };

            let record : Record = {
                interval = sub.interval;
                timerId = Timer.recurringTimer<system>(#seconds(sub.interval), sendReport(sub.chat, sub.apiGateway));
                apiGateway = sub.apiGateway;
                iterations = sub.iterations;
                sentReports = prevSentReports; // preserve already-sent report IDs
            };

            map.put(sub.chat, record);
            return exists;
        };

        public func remove(chat : Chat.Chat) {
            let ?record = map.get(chat) else {
                return;
            };
            Timer.cancelTimer(record.timerId);
            map.delete(chat);
        };

        public func iter() : Iter.Iter<Sub> {
            Iter.map(map.entries(), func((k : Chat.Chat, v : Record)) : Sub {{
                chat = k;
                interval = v.interval;
                apiGateway = v.apiGateway;
                iterations = v.iterations;
            }});
        };

        public func count() : Nat {
            map.size();
        };

        func sendReport(chat : Chat.Chat, apiGateway : Base.CanisterId) : () -> async () {
            let client = Client.OpenChatClient({
                apiGateway;
                scope = #Chat(chat);
                jwt = null;
                messageId = null;
                thread = null;
            });

            func () : async () {
                switch (map.get(chat)) {
                    case (?record) {
                        if (record.iterations >= maxIterations) {
                            Timer.cancelTimer(record.timerId);
                            map.delete(chat);
                            return;
                        };

                        // Carry forward the same sentReports set; only bump iterations
                        let newRecord : Record = {
                            interval = record.interval;
                            timerId = record.timerId;
                            apiGateway = record.apiGateway;
                            iterations = record.iterations + 1; // TODO implemented
                            sentReports = record.sentReports;    // keep reference to the same set
                        };

                        map.put(chat, newRecord);
                    };
                    case null {
                        Debug.print("Chat not found in subscriptions: " # debug_show(chat));
                        return;
                    };
                };

                // Safe to unwrap since we just put it
                let ?current = map.get(chat) else return;

                // Fetch report IDs 
                let reports_ids_list = await ReportsStorage.get_reports_list(0, 5);

                for (id in reports_ids_list.vals()) {
                    // Skip if we've already sent this report to this chat
                    //
                    if ((switch (current.sentReports.get(id)) { case (?_) true; case null false }) == false) {
                        let report = await ReportsStorage.get_report(id);

                        // Send and, if successful, mark as sent
                        ignore await client
                            .sendTextMessage(
                                "AI Neuron Report : https://kcyll-maaaa-aaaak-quk5q-cai.icp0.io/reports/" # report.proposalID
                            )
                            .execute();

                        // Mark report ID as sent for this chat
                        current.sentReports.put(id, true);
                    };
                };
            };
        };
    };

    type Record = {
        interval : Nat;
        timerId : Timer.TimerId;
        apiGateway : Base.CanisterId;
        iterations : Nat8;
        // map of report_ids already sent (per-chat)
        sentReports : HashMap.HashMap<Text, Bool>;
    };
};
