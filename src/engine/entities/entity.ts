// engine/entities/types.ts
import type { RoomId } from "../map/room"
import type { Opt } from "../utils/option"

export type EntityId = number

// export type Entity = {
//     id: EntityId,
//     name: string
//     room: Opt<RoomId>,
// }

export class Entity {

    constructor(
        private readonly id: EntityId,
        private name: string,
        private room: Opt<RoomId>
    ) { }


}
