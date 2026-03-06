// engine/map/types.ts
import type { EntityId } from "../entities/entity";
import { type Result, err, ok } from "../utils/result";

export type RoomId = number;

export class Room {
    /** entities in the current Room */
    private entities: EntityId[] = [];
    /** Rooms connected to this one */
    private neighbors: RoomId[] = [];

    constructor(
        private readonly id: RoomId,
        private name: string
    ) { }

    add_neighbor(neighbor_id: RoomId): Result<void, string> {
        if (this.neighbors.includes(neighbor_id)) return err(`${neighbor_id} already is a neighbor of room ${this.id}`);
        this.neighbors.push(neighbor_id);
        return ok(undefined);
    }

    remove_neighbor(neighbor_id: RoomId): boolean {
        const index = this.neighbors.indexOf(neighbor_id);

        if (index !== -1) {
            this.neighbors.splice(index, 1);
            return true;
        }
        return false;
    }
}
