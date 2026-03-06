// engine/entities/types.ts
import type { RoomId } from "../map/room"
import { some, type Opt } from "../utils/option"

export type EntityId = number

export class Entity {
    constructor(
        private readonly _id: EntityId,
        private _name: string,
        private _room_id: Opt<RoomId>
    ) { }

    get id() { return this._id; }
    get name() { return this._name; }
    get room_id() { return this._room_id; }

    set name(name: string) { this._name = name; }
    set room_id(room_id: Opt<RoomId>) { this._room_id = room_id; }
}
