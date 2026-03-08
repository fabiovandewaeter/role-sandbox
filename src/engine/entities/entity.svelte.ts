// engine/entities/types.svelte.ts
import type { EntityInteraction, EntityInteractionContext } from "../intractions/interaction";
import type { RoomId } from "../map/room.svelte"
import { type Opt } from "../utils/option"

export type EntityId = number

export class Entity {
    readonly id: EntityId;
    name: string = $state()!;
    room_id: Opt<RoomId> = $state()!;
    interactions: EntityInteraction[] = $state([]);
    max_stats: Stats;

    constructor(id: EntityId, name: string, room_id: Opt<RoomId>, max_stats: Stats) {
        this.id = id;
        this.name = name;
        this.room_id = room_id;
        this.max_stats = max_stats;
    }
}

export type Stats = {
    hp: number,
    mana: number,
    attack: number
}
