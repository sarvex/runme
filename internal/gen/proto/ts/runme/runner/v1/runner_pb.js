/* eslint-disable */
// @generated by protobuf-ts 2.8.2 with parameter output_javascript,optimize_code_size,long_type_string,add_pb_suffix,ts_nocheck,eslint_disable
// @generated from protobuf file "runme/runner/v1/runner.proto" (package "runme.runner.v1", syntax proto3)
// tslint:disable
// @ts-nocheck
/* eslint-disable */
// @generated by protobuf-ts 2.8.2 with parameter output_javascript,optimize_code_size,long_type_string,add_pb_suffix,ts_nocheck,eslint_disable
// @generated from protobuf file "runme/runner/v1/runner.proto" (package "runme.runner.v1", syntax proto3)
// tslint:disable
// @ts-nocheck
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { UInt32Value } from "../../../google/protobuf/wrappers_pb";
/**
 * @generated from protobuf enum runme.runner.v1.ExecuteStop
 */
export var ExecuteStop;
(function (ExecuteStop) {
    /**
     * @generated from protobuf enum value: EXECUTE_STOP_UNSPECIFIED = 0;
     */
    ExecuteStop[ExecuteStop["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    /**
     * @generated from protobuf enum value: EXECUTE_STOP_INTERRUPT = 1;
     */
    ExecuteStop[ExecuteStop["INTERRUPT"] = 1] = "INTERRUPT";
    /**
     * @generated from protobuf enum value: EXECUTE_STOP_KILL = 2;
     */
    ExecuteStop[ExecuteStop["KILL"] = 2] = "KILL";
})(ExecuteStop || (ExecuteStop = {}));
/**
 * strategy for selecting a session in an initial execute request
 *
 * @generated from protobuf enum runme.runner.v1.SessionStrategy
 */
export var SessionStrategy;
(function (SessionStrategy) {
    /**
     * uses session_id field to determine session
     * if none is present, a new session is created
     *
     * @generated from protobuf enum value: SESSION_STRATEGY_UNSPECIFIED = 0;
     */
    SessionStrategy[SessionStrategy["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    /**
     * uses most recently used session on the grpc server
     * if there is none, a new one is created
     *
     * @generated from protobuf enum value: SESSION_STRATEGY_MOST_RECENT = 1;
     */
    SessionStrategy[SessionStrategy["MOST_RECENT"] = 1] = "MOST_RECENT";
})(SessionStrategy || (SessionStrategy = {}));
// @generated message type with reflection information, may provide speed optimized methods
class Session$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.Session", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "envs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "metadata", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.Session
 */
export const Session = new Session$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateSessionRequest$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.CreateSessionRequest", [
            { no: 1, name: "metadata", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } },
            { no: 2, name: "envs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.CreateSessionRequest
 */
export const CreateSessionRequest = new CreateSessionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateSessionResponse$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.CreateSessionResponse", [
            { no: 1, name: "session", kind: "message", T: () => Session }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.CreateSessionResponse
 */
export const CreateSessionResponse = new CreateSessionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSessionRequest$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.GetSessionRequest", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.GetSessionRequest
 */
export const GetSessionRequest = new GetSessionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSessionResponse$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.GetSessionResponse", [
            { no: 1, name: "session", kind: "message", T: () => Session }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.GetSessionResponse
 */
export const GetSessionResponse = new GetSessionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ListSessionsRequest$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.ListSessionsRequest", []);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.ListSessionsRequest
 */
export const ListSessionsRequest = new ListSessionsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ListSessionsResponse$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.ListSessionsResponse", [
            { no: 1, name: "sessions", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => Session }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.ListSessionsResponse
 */
export const ListSessionsResponse = new ListSessionsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteSessionRequest$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.DeleteSessionRequest", [
            { no: 1, name: "id", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.DeleteSessionRequest
 */
export const DeleteSessionRequest = new DeleteSessionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class DeleteSessionResponse$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.DeleteSessionResponse", []);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.DeleteSessionResponse
 */
export const DeleteSessionResponse = new DeleteSessionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class Winsize$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.Winsize", [
            { no: 1, name: "rows", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 2, name: "cols", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 3, name: "x", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 4, name: "y", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.Winsize
 */
export const Winsize = new Winsize$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ExecuteRequest$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.ExecuteRequest", [
            { no: 1, name: "program_name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "arguments", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "directory", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 4, name: "envs", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 5, name: "commands", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "script", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "tty", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 8, name: "input_data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 9, name: "stop", kind: "enum", T: () => ["runme.runner.v1.ExecuteStop", ExecuteStop, "EXECUTE_STOP_"] },
            { no: 10, name: "winsize", kind: "message", T: () => Winsize },
            { no: 11, name: "background", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 20, name: "session_id", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 21, name: "session_strategy", kind: "enum", T: () => ["runme.runner.v1.SessionStrategy", SessionStrategy, "SESSION_STRATEGY_"] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.ExecuteRequest
 */
export const ExecuteRequest = new ExecuteRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ProcessPID$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.ProcessPID", [
            { no: 1, name: "pid", kind: "scalar", T: 3 /*ScalarType.INT64*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.ProcessPID
 */
export const ProcessPID = new ProcessPID$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ExecuteResponse$Type extends MessageType {
    constructor() {
        super("runme.runner.v1.ExecuteResponse", [
            { no: 1, name: "exit_code", kind: "message", T: () => UInt32Value },
            { no: 2, name: "stdout_data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "stderr_data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 4, name: "pid", kind: "message", T: () => ProcessPID }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message runme.runner.v1.ExecuteResponse
 */
export const ExecuteResponse = new ExecuteResponse$Type();
/**
 * @generated ServiceType for protobuf service runme.runner.v1.RunnerService
 */
export const RunnerService = new ServiceType("runme.runner.v1.RunnerService", [
    { name: "CreateSession", options: {}, I: CreateSessionRequest, O: CreateSessionResponse },
    { name: "GetSession", options: {}, I: GetSessionRequest, O: GetSessionResponse },
    { name: "ListSessions", options: {}, I: ListSessionsRequest, O: ListSessionsResponse },
    { name: "DeleteSession", options: {}, I: DeleteSessionRequest, O: DeleteSessionResponse },
    { name: "Execute", serverStreaming: true, clientStreaming: true, options: {}, I: ExecuteRequest, O: ExecuteResponse }
]);
