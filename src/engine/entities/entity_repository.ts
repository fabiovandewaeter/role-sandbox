// engine/entity_repository.ts
import { none, some, type Opt } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import type { EntityId, Entity } from "./entity";

export class EntityRepository {
    private next_id: any;
    private readonly entities: Record<EntityId, Entity> = {};

    constructor() {
        this.next_id = 0;
    }

    get(id: EntityId): Opt<Entity> {
        const res = this.entities[id];
        return res != null && res != undefined ? some(res) : none;
    }

    /** spawn entity without room */
    spawn(partial: Omit<Entity, "id">): Result<EntityId, string> {
        const id: EntityId = this.next_id++;
        const entity: Entity = { id, ...partial };
        this.entities[id] = entity;
        return ok(id);
    }

    delete(id: EntityId): Result<EntityId, string> {
        if (delete this.entities[id]) {
            return ok(id);
        }
        return err(`Couldn't delete entity: ${id}`);
    }

    all_ids(): EntityId[] {
        return Object.keys(this.entities).map(Number) as EntityId[];
    }
    all(): Entity[] {
        return Object.values(this.entities);
    }
}
