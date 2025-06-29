export const idlFactory = ({ IDL }) => {
  const AuditStorage = IDL.Service({
    'addAudit' : IDL.Func([IDL.Text, IDL.Text], [IDL.Opt(IDL.Text)], []),
    'getAudit' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'listAudits' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
  });
  return AuditStorage;
};
export const init = ({ IDL }) => { return []; };
