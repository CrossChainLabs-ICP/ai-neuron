import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Header = [string, string];
export interface PingBot {
  'http_request' : ActorMethod<[Request], Response>,
  'http_request_update' : ActorMethod<[UpdateRequest], UpdateResponse>,
}
export interface Request {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<Header>,
  'certificate_version' : [] | [number],
}
export interface Response {
  'body' : Uint8Array | number[],
  'headers' : Array<Header>,
  'upgrade' : [] | [boolean],
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export type StreamingCallback = ActorMethod<
  [StreamingToken],
  [] | [StreamingCallbackResponse]
>;
export interface StreamingCallbackResponse {
  'token' : [] | [StreamingToken],
  'body' : Uint8Array | number[],
}
export type StreamingStrategy = {
    'Callback' : { 'token' : StreamingToken, 'callback' : StreamingCallback }
  };
export type StreamingToken = Uint8Array | number[];
export interface UpdateRequest {
  'url' : string,
  'method' : string,
  'body' : Uint8Array | number[],
  'headers' : Array<Header>,
}
export interface UpdateResponse {
  'body' : Uint8Array | number[],
  'headers' : Array<Header>,
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface _SERVICE extends PingBot {}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
