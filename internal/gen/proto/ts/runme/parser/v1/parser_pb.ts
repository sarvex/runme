// @generated by protoc-gen-es v1.1.1 with parameter "target=ts"
// @generated from file runme/parser/v1/parser.proto (package runme.parser.v1, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from enum runme.parser.v1.CellKind
 */
export enum CellKind {
  /**
   * @generated from enum value: CELL_KIND_UNSPECIFIED = 0;
   */
  UNSPECIFIED = 0,

  /**
   * @generated from enum value: CELL_KIND_MARKUP = 1;
   */
  MARKUP = 1,

  /**
   * @generated from enum value: CELL_KIND_CODE = 2;
   */
  CODE = 2,
}
// Retrieve enum metadata with: proto3.getEnumType(CellKind)
proto3.util.setEnumType(CellKind, "runme.parser.v1.CellKind", [
  { no: 0, name: "CELL_KIND_UNSPECIFIED" },
  { no: 1, name: "CELL_KIND_MARKUP" },
  { no: 2, name: "CELL_KIND_CODE" },
]);

/**
 * @generated from message runme.parser.v1.Notebook
 */
export class Notebook extends Message<Notebook> {
  /**
   * @generated from field: repeated runme.parser.v1.Cell cells = 1;
   */
  cells: Cell[] = [];

  /**
   * @generated from field: map<string, string> metadata = 2;
   */
  metadata: { [key: string]: string } = {};

  constructor(data?: PartialMessage<Notebook>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.Notebook";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "cells", kind: "message", T: Cell, repeated: true },
    { no: 2, name: "metadata", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Notebook {
    return new Notebook().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Notebook {
    return new Notebook().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Notebook {
    return new Notebook().fromJsonString(jsonString, options);
  }

  static equals(a: Notebook | PlainMessage<Notebook> | undefined, b: Notebook | PlainMessage<Notebook> | undefined): boolean {
    return proto3.util.equals(Notebook, a, b);
  }
}

/**
 * @generated from message runme.parser.v1.Cell
 */
export class Cell extends Message<Cell> {
  /**
   * @generated from field: runme.parser.v1.CellKind kind = 1;
   */
  kind = CellKind.UNSPECIFIED;

  /**
   * @generated from field: string value = 2;
   */
  value = "";

  /**
   * @generated from field: string language_id = 3;
   */
  languageId = "";

  /**
   * @generated from field: map<string, string> metadata = 4;
   */
  metadata: { [key: string]: string } = {};

  constructor(data?: PartialMessage<Cell>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.Cell";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "kind", kind: "enum", T: proto3.getEnumType(CellKind) },
    { no: 2, name: "value", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "language_id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "metadata", kind: "map", K: 9 /* ScalarType.STRING */, V: {kind: "scalar", T: 9 /* ScalarType.STRING */} },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Cell {
    return new Cell().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Cell {
    return new Cell().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Cell {
    return new Cell().fromJsonString(jsonString, options);
  }

  static equals(a: Cell | PlainMessage<Cell> | undefined, b: Cell | PlainMessage<Cell> | undefined): boolean {
    return proto3.util.equals(Cell, a, b);
  }
}

/**
 * @generated from message runme.parser.v1.DeserializeRequest
 */
export class DeserializeRequest extends Message<DeserializeRequest> {
  /**
   * @generated from field: bytes source = 1;
   */
  source = new Uint8Array(0);

  constructor(data?: PartialMessage<DeserializeRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.DeserializeRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "source", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeserializeRequest {
    return new DeserializeRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeserializeRequest {
    return new DeserializeRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeserializeRequest {
    return new DeserializeRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeserializeRequest | PlainMessage<DeserializeRequest> | undefined, b: DeserializeRequest | PlainMessage<DeserializeRequest> | undefined): boolean {
    return proto3.util.equals(DeserializeRequest, a, b);
  }
}

/**
 * @generated from message runme.parser.v1.DeserializeResponse
 */
export class DeserializeResponse extends Message<DeserializeResponse> {
  /**
   * @generated from field: runme.parser.v1.Notebook notebook = 1;
   */
  notebook?: Notebook;

  constructor(data?: PartialMessage<DeserializeResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.DeserializeResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "notebook", kind: "message", T: Notebook },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeserializeResponse {
    return new DeserializeResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeserializeResponse {
    return new DeserializeResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeserializeResponse {
    return new DeserializeResponse().fromJsonString(jsonString, options);
  }

  static equals(a: DeserializeResponse | PlainMessage<DeserializeResponse> | undefined, b: DeserializeResponse | PlainMessage<DeserializeResponse> | undefined): boolean {
    return proto3.util.equals(DeserializeResponse, a, b);
  }
}

/**
 * @generated from message runme.parser.v1.SerializeRequest
 */
export class SerializeRequest extends Message<SerializeRequest> {
  /**
   * @generated from field: runme.parser.v1.Notebook notebook = 1;
   */
  notebook?: Notebook;

  constructor(data?: PartialMessage<SerializeRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.SerializeRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "notebook", kind: "message", T: Notebook },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SerializeRequest {
    return new SerializeRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SerializeRequest {
    return new SerializeRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SerializeRequest {
    return new SerializeRequest().fromJsonString(jsonString, options);
  }

  static equals(a: SerializeRequest | PlainMessage<SerializeRequest> | undefined, b: SerializeRequest | PlainMessage<SerializeRequest> | undefined): boolean {
    return proto3.util.equals(SerializeRequest, a, b);
  }
}

/**
 * @generated from message runme.parser.v1.SerializeResponse
 */
export class SerializeResponse extends Message<SerializeResponse> {
  /**
   * @generated from field: bytes result = 1;
   */
  result = new Uint8Array(0);

  constructor(data?: PartialMessage<SerializeResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "runme.parser.v1.SerializeResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "result", kind: "scalar", T: 12 /* ScalarType.BYTES */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SerializeResponse {
    return new SerializeResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SerializeResponse {
    return new SerializeResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SerializeResponse {
    return new SerializeResponse().fromJsonString(jsonString, options);
  }

  static equals(a: SerializeResponse | PlainMessage<SerializeResponse> | undefined, b: SerializeResponse | PlainMessage<SerializeResponse> | undefined): boolean {
    return proto3.util.equals(SerializeResponse, a, b);
  }
}

