// engine/interactions/interactions.ts
import type { EntityId } from "../entities/entity.svelte";
import type { Result } from "../utils/result";
import type { World } from "../world.svelte";

export type InteractionContext = {
    world: World,
    source_id: EntityId,
    target_id: EntityId,
}

export type Interaction = {
    id: string,
    /** exemple: visible only if player has a certain item ... */
    available?: (ctx: InteractionContext) => boolean,
    execute: (ctx: InteractionContext) => Result<void, string>,
}
