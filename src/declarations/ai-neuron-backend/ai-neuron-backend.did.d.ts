import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface AuditStorage {
  'addAudit' : ActorMethod<[string, string], [] | [string]>,
  'getAudit' : ActorMethod<[string], [] | [string]>,
  'listAudits' : ActorMethod<[], Array<string>>,
}
export interface _SERVICE extends AuditStorage {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
