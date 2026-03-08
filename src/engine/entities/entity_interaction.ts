// engine/entities/entity_interaction.ts
import { Combat, combat_from_entity_ids } from "../combats/combat.svelte";
import type { CombatState, DialogueState, TradeState } from "../game_state";
import { ok, type Result } from "../utils/result";
import type { World } from "../world.svelte";
import type { EntityId } from "./entity.svelte";

export type EntityInteractionContext = {
    world: World,
    source_id: EntityId,
    target_id: EntityId,
}

export type EntityInteraction = {
    id: string,
    /** exemple: visible only if player has a certain item ... */
    available?: (ctx: EntityInteractionContext) => boolean,
    execute: (ctx: EntityInteractionContext) => Result<void, string>,
}

export const combat_interaction: EntityInteraction = {
    id: "combat",
    execute: ({ world, source_id, target_id }): Result<void, string> => {
        // spawn other entities if needed in the combat
        const player_team_ids = [source_id];
        const enemy_team_ids = [target_id];
        return world.start_combat(player_team_ids, enemy_team_ids);
    }
}

export const dialogue_interaction: EntityInteraction = {
    id: "dialogue",
    execute: ({ world, source_id, target_id }): Result<void, string> => {
        return world.start_dialogue(source_id, target_id);
    }
}

export const trade_interaction: EntityInteraction = {
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

export function start_combat(world: World, player_team_ids: EntityId[], enemy_team_ids: EntityId[]): void {
    const combat = combat_from_entity_ids(player_team_ids, enemy_team_ids, world.entity_repo);
    const new_state: CombatState = {
        mode: "combat",
        combat,
    };
    world.state = new_state;
}

export function start_dialogue(world: World, source_id: EntityId, target_id: EntityId): void {
    const new_state: DialogueState = {
        mode: "dialogue",
        dialogue: {}
    };
    world.state = new_state;
}

export function start_trade(world: World, source_id: EntityId, target_id: EntityId): void {
    const new_state: TradeState = {
        mode: "trade",
        trade: {}
    };
    world.state = new_state;
}
