// engine/combat/combat_action.ts
import type { EntityId } from "../entities/entity.svelte"
import { err, ok, type Result } from "../utils/result"
import type { World } from "../world.svelte"
import type { Combat } from "./combat.svelte"

export type CombatActionContext = {
    world: World,
    combat: Combat,
    source_id: EntityId,
    target_id?: EntityId,
}

export type CombatAction = {
    id: string,
    needs_target: boolean,
    available?: (ctx: CombatActionContext) => boolean,
    execute: (ctx: CombatActionContext) => Result<void, string>,
}

export const attack_action: CombatAction = {
    id: "attack",
    needs_target: true,
    execute: ({ combat, source_id, target_id }): Result<void, string> => {
        const source_res = combat.get_combatant(source_id!).ok_or(`Could not find combatant: ${source_id}`);
        if (source_res.is_err()) return err(source_res.error);
        const source = source_res.unwrap();
        const target_res = combat.get_combatant(target_id!).ok_or(`Could not find combatant: ${target_id}`);
        if (target_res.is_err()) return err(target_res.error);
        const target = target_res.unwrap();

        target.current_stats.hp -= source.current_stats.attack;
        combat.advance_turn();
        return ok(undefined);
    }
}

export const flee_action: CombatAction = {
    id: "flee",
    needs_target: false,
    execute: ({ world }) => {
        world.state = { mode: "explore" };
        return ok(undefined);
    }
}

export const DEFAULT_COMBAT_ACTIONS = [
    attack_action,
    flee_action,
];
