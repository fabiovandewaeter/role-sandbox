// engine/entities/entity_interaction.ts
import type { CombatState, DialogueState, TradeState } from "../game_state";
import type { Interaction } from "../intractions/interaction";
import { ok, type Result } from "../utils/result";
import type { World } from "../world.svelte";
import type { EntityId } from "./entity.svelte";

export const combat_interaction: Interaction = {
    id: "combat",
    execute: ({ world, source_id, target_id }): Result<void, string> => {
        // spawn other entities if needed in the combat
        const player_team_ids = [source_id];
        const enemy_team_ids = [target_id];
        return world.start_combat(player_team_ids, enemy_team_ids);
    }
}

export const dialogue_interaction: Interaction = {
    id: "dialogue",
    execute: ({ world, source_id, target_id }): Result<void, string> => {
        return world.start_dialogue(source_id, target_id);
    }
}

export const trade_interaction: Interaction = {
    id: "trade",
    execute: ({ world, source_id, target_id }): Result<void, string> => {
        return world.start_trade(source_id, target_id);
    }
}

export const DEFAULT_ENTITY_INTERACTIONS = [
    combat_interaction,
    dialogue_interaction,
    trade_interaction
];

export function start_combat(world: World, player_team_ids: EntityId[], enemy_team_ids: EntityId[]): Result<void, string> {
    const new_state: CombatState = {
        mode: "combat",
        player_team_ids,
        enemy_team_ids,
    };
    world.state = new_state;
    return ok(undefined);
}

export function start_dialogue(world: World, source_id: EntityId, target_id: EntityId): Result<void, string> {
    const new_state: DialogueState = {
        mode: "dialogue",
        target_id,
    };
    world.state = new_state;
    return ok(undefined);
}

export function start_trade(world: World, source_id: EntityId, target_id: EntityId): Result<void, string> {
    const new_state: TradeState = {
        mode: "trade",
        target_id,
    };
    world.state = new_state;
    return ok(undefined);
}
