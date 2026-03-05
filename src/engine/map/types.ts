// engine/map/types.ts
import type { EntityId } from "../entities/types";

export type RoomId = number;

export type Room = {
    id: RoomId,
    name: string,
    /** entities in the current Room */
    entities: EntityId[],
    /** Rooms connected to this one */
    neighbors: RoomId[],
}
