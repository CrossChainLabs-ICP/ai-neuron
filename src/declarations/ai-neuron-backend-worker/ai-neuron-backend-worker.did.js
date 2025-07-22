export const idlFactory = ({ IDL }) => {
  const ReportItem = IDL.Record({
    'report' : IDL.Text,
    'proposalTitle' : IDL.Text,
    'proposalID' : IDL.Text,
  });
  const Worker = IDL.Service({
    'balance' : IDL.Func([], [IDL.Nat], ['query']),
    'get' : IDL.Func([IDL.Text], [ReportItem], ['query']),
    'get_items' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(ReportItem)],
        ['query'],
      ),
    'get_list' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'saveReport' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  });
  return Worker;
};
export const init = ({ IDL }) => { return []; };
