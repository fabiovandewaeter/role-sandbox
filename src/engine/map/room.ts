// engine/map/types.ts
import type { EntityId } from "../entities/entity";
import { type Result, err, ok } from "../utils/result";

export type RoomId = number;

export class Room {
    /** entities in the current Room */
    private _entities: EntityId[] = [];
    /** Rooms connected to this one */
    private _neighbors: RoomId[] = [];

    constructor(
        private readonly _id: RoomId,
        private _name: string
    ) { }

    get id() { return this._id; }
    get name() { return this._name; }
    get entities() { return this._entities; }
    get neighbors() { return this._neighbors; }

    set name(name: string) { this._name = name; }

    contains_entity(entity_id: EntityId): boolean {
        const index = this._entities.indexOf(entity_id);
        return index != -1;
    }

    add_entity(entity_id: EntityId) {
        if (!this._entities.includes(entity_id)) {
            this._entities.push(entity_id);
        }
    }

    remove_entity(entity_id: EntityId): Result<void, string> {
        const index = this._entities.indexOf(entity_id);
        if (index == -1) return err(`Entity ${entity_id} not found in room ${this.id}`);
        this._entities.splice(index, 1);
        return ok(undefined);
    }

    add_neighbor(neighbor_id: RoomId): Result<void, string> {
        if (this._neighbors.includes(neighbor_id)) return err(`${neighbor_id} already is a neighbor of room ${this.id}`);
        this._neighbors.push(neighbor_id);
        return ok(undefined);
    }

    remove_neighbor(neighbor_id: RoomId): Result<void, string> {
        const index = this._neighbors.indexOf(neighbor_id);

        if (index !== -1) {
            this._neighbors.splice(index, 1);
            return err(`${neighbor_id} not found in room ${this._id}`);
        }
        return ok(undefined);
    }
}
