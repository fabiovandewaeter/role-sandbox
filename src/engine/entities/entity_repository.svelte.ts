// engine/entity_repository.svelte.ts
import type { Interaction } from "../intractions/interaction";
import type { RoomId } from "../map/room.svelte";
import { none, some, type Opt } from "../utils/option";
import { err, ok, type Result } from "../utils/result";
import { type EntityId, Entity } from "./entity.svelte";
import { DEFAULT_ENTITY_INTERACTIONS } from "./entity_interaction";

export class EntityRepository {
    private next_id: any = $state(0);
    private readonly entities: Record<EntityId, Entity> = $state({});

    constructor() { }

    get(id: EntityId): Opt<Entity> {
        const res = this.entities[id];
        return res != null && res != undefined ? some(res) : none;
    }
    get_or_err(id: EntityId, msg?: string): Result<Entity, string> {
        const entity_opt = this.get(id);
        return entity_opt.is_some() ? ok(entity_opt.value) : err(msg ?? `Entity ${id} does not exist`);
    }

    spawn(name: string, room_id: RoomId, extra_interactions: Interaction[] = []): Result<EntityId, string> {
        const id: EntityId = this.next_id++;
        const entity: Entity = new Entity(id, name, some(room_id));
        entity.interactions = [...DEFAULT_ENTITY_INTERACTIONS, ...extra_interactions];
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
