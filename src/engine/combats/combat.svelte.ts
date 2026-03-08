// engine/combat/combat.svelte.ts
import { Entity, type EntityId, type Stats } from "../entities/entity.svelte";
import type { EntityRepository } from "../entities/entity_repository.svelte";
import { none, some, type Opt } from "../utils/option";
import { DEFAULT_COMBAT_ACTIONS, type CombatAction } from "./combat_action";

export type Combatant = {
    entity_id: EntityId,
    /** current hp, mana... ; doesn't affect entity's max stats */
    current_stats: Stats,
    is_dead: boolean,
    actions: CombatAction[],
}

export enum CombatState {
    PlayerWon = "player won",
    EnemyWon = "enemy won",
    NotFinished = "not finished",
}

export class Combat {
    player_team: Combatant[] = $state([]);
    enemy_team: Combatant[] = $state([]);
    turn_order: EntityId[] = $state([]);
    current_combatant_id: EntityId = $state(0);

    constructor(
        player_team: Combatant[],
        enemy_team: Combatant[]
    ) {
        this.player_team = player_team;
        this.enemy_team = enemy_team;
        this.turn_order = [...player_team.map(c => c.entity_id), ...enemy_team.map(c => c.entity_id)];
        this.current_combatant_id = this.turn_order[0];
    }

    get current_turn_index(): number {
        return this.turn_order.indexOf(this.current_combatant_id);
    }
    get combat_state(): CombatState {
        if (this.player_team.every(c => c.is_dead)) return CombatState.EnemyWon;
        if (this.enemy_team.every(c => c.is_dead)) return CombatState.PlayerWon;
        return CombatState.NotFinished;
    }

    get_combatant(entity_id: EntityId): Opt<Combatant> {
        const ally_combatant = this.player_team.find(p => p.entity_id == entity_id);
        if (ally_combatant !== undefined) return some(ally_combatant);
        const enemy_combatant = this.enemy_team.find(p => p.entity_id == entity_id);
        if (enemy_combatant !== undefined) return some(enemy_combatant);
        return none;
    }

    advance_turn(): CombatState {
        this.kill_dead_entities();

        const result = this.combat_state;
        if (result !== CombatState.NotFinished) return result;

        // sync current_combatant_id
        const current_index = this.turn_order.indexOf(this.current_combatant_id);
        const next_index = (current_index + 1) % this.turn_order.length;
        this.current_combatant_id = this.turn_order[next_index];

        return CombatState.NotFinished;
    }

    /** set the Combatant.is_dead = true if not enough hp and removes them from this.turn_order */
    kill_dead_entities() {
        // kill dead entities
        this.player_team.forEach(c => { if (c.current_stats.hp <= 0) c.is_dead = true; });
        this.enemy_team.forEach(c => { if (c.current_stats.hp <= 0) c.is_dead = true; });
        // find dead entities in turn_order and removes them
        this.turn_order = this.turn_order.filter(id => !this.get_combatant(id).unwrap().is_dead);
    }
}

export function combatant_from_entity(entity: Entity): Combatant {
    return {
        entity_id: entity.id,
        current_stats: entity.max_stats,
        is_dead: false,
        actions: [...DEFAULT_COMBAT_ACTIONS]
    }
}

export function entity_ids_to_combatants(entity_ids: EntityId[], entity_repo: EntityRepository): Combatant[] {
    let combatants: Combatant[] = [];
    for (const id of entity_ids) {
        const entity = entity_repo.get_or_err(id).unwrap();
        combatants.push(combatant_from_entity(entity));
    }
    return combatants;
}

export function combat_from_entity_ids(player_team_ids: EntityId[], enemy_team_ids: EntityId[], entity_repo: EntityRepository): Combat {
    const player_team = entity_ids_to_combatants(player_team_ids, entity_repo);
    const enemy_team = entity_ids_to_combatants(enemy_team_ids, entity_repo);
    return new Combat(player_team, enemy_team);
}
