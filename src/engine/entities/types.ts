// engine/entities/types.ts
import type { RoomId } from "../map/types"
import type { Opt } from "../utils/option"

export type EntityId = number

export type Entity = {
    id: EntityId,
    name: string
    room: Opt<RoomId>,
}
