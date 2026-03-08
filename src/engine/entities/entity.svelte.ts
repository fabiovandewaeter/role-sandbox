// engine/entities/types.svelte.ts
import type { Interaction, InteractionContext } from "../intractions/interaction";
import type { RoomId } from "../map/room.svelte"
import { type Opt } from "../utils/option"

export type EntityId = number

export class Entity {
    readonly id: EntityId;
    name: string = $state()!;
    room_id: Opt<RoomId> = $state()!;
    interactions: Interaction[] = $state([]);

    constructor(id: EntityId, name: string, room_id: Opt<RoomId>) {
        this.id = id;
        this.name = name;
        this.room_id = room_id;
    }
}

