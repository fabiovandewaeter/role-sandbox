// engine/map/types.svelte.ts
import type { EntityId } from "../entities/entity.svelte";
import { type Result, err, ok } from "../utils/result";

export type RoomId = number;

export class Room {
    readonly id: RoomId;
    name: string = $state()!;
    entities: EntityId[] = $state([]);
    neighbors: RoomId[] = $state([]);

    constructor(id: RoomId, name: string) {
        this.id = id;
        this.name = name;
    }

    contains_entity(entity_id: EntityId): boolean {
        const index = this.entities.indexOf(entity_id);
        return index != -1;
    }

    add_entity(entity_id: EntityId) {
        if (!this.entities.includes(entity_id)) {
            this.entities.push(entity_id);
        }
    }

    remove_entity(entity_id: EntityId): Result<void, string> {
        const index = this.entities.indexOf(entity_id);
        if (index == -1) return err(`Entity ${entity_id} not found in room ${this.id}`);
        this.entities.splice(index, 1);
        return ok(undefined);
    }

    add_neighbor(neighbor_id: RoomId): Result<void, string> {
        if (this.neighbors.includes(neighbor_id)) return err(`${neighbor_id} already is a neighbor of room ${this.id}`);
        this.neighbors.push(neighbor_id);
        return ok(undefined);
    }

    remove_neighbor(neighbor_id: RoomId): Result<void, string> {
        const index = this.neighbors.indexOf(neighbor_id);

        if (index !== -1) {
            this.neighbors.splice(index, 1);
            return err(`${neighbor_id} not found in room ${this.id}`);
        }
        return ok(undefined);
    }
}
