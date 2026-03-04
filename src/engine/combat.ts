// engine/combat.ts
import type { Combat, CombatAction, CombatId, UnitCombatState } from "./combat_types";
import { get_occupied_cells } from "./map/level";
import { find_path, get_reachable_cells } from "./pathfinding";
import type { UnitId, Coord, World, Unit, Level } from "./types";
import { get_active_level } from "./world";

export function spawn_combat(world: World, combat_partial: Omit<Combat, "id">): CombatId {
    const id: CombatId = world.next_combat_id++;
    const combat: Combat = { id, ...combat_partial };
    world.combats[id] = combat;
    return id;
}

/** Only checks if destination is accessible (not full path) then moves the unit */
export function move_unit_in_combat(combat: Combat, unit_id: UnitId, to: Coord, world: World): boolean {
    const unit: Unit = world.units[unit_id];
    if (!unit) return false;

    const unit_combat_state: UnitCombatState = combat.unit_statuses[unit_id];
    if (!unit_combat_state) return false;

    const level: Level = get_active_level(world);
    if (!level) return false;

    if (to.x < 0 || to.y < 0 || to.x >= level.board.width || to.y >= level.board.height) return false;

    // Vérifie que la case cible n'est pas bloquée par une structure
    const blocked = Object.values(level.structures).some(
        s => s.pos.x === to.x && s.pos.y === to.y && !s.walkable
    );
    if (blocked) return false;

    unit.pos = { x: to.x, y: to.y };
    unit_combat_state.pos = { x: to.x, y: to.y }; // sync le state combat aussi
    return true;
}

export function compute_ai_turn_step(combat: Combat, world: World): CombatAction {
    const unit_id = get_current_unit_id(combat);
    const unit = world.units[unit_id];
    const unit_status: UnitCombatState = combat.unit_statuses[unit_id];
    const level = get_active_level(world);

    if (unit_status.current_stats.mp <= 0) {
        return { type: "WAIT", unit_id };
    }

    // Trouve une cible ennemie (équipe opposée)
    const enemy = Object.values(combat.unit_statuses).find(
        s => s.team !== unit_status.team && s.alive
    );

    if (!enemy) {
        return { type: "WAIT", unit_id };
    }

    const occupied = get_occupied_cells(level, world, unit_id);
    const reachable = get_reachable_cells(level, world, unit.pos, unit_status.current_stats.mp, occupied);

    // Cherche la case atteignable la plus proche de l'ennemi
    let best_path: Coord[] | null = null;
    let best_dist = Infinity;

    for (const cell_key of reachable) {
        const [cx, cy] = cell_key.split(",").map(Number);
        const dist = Math.abs(cx - enemy.pos.x) + Math.abs(cy - enemy.pos.y);
        if (dist < best_dist) {
            const path = find_path(level, world, unit.pos, { x: cx, y: cy }, occupied);
            if (path) {
                best_dist = dist;
                best_path = path;
            }
        }
    }

    if (!best_path || best_path.length < 2) {
        return { type: "WAIT", unit_id };
    }

    // Consomme les MP selon la longueur du chemin
    unit_status.current_stats.mp -= best_path.length - 1;

    return { type: "MOVE", unit_id, path: best_path };
}

export function combat_is_active(combat: Combat): boolean {
    const teamA_alive = Object.values(combat.unit_statuses).some(u => u.team === "A" && u.alive);
    const teamB_alive = Object.values(combat.unit_statuses).some(u => u.team === "B" && u.alive);
    return teamA_alive && teamB_alive;
}

export function next_turn_logic(combat: Combat): UnitId {
    let loop_guard = 0;
    do {
        combat.initiative_index++;
        if (combat.initiative_index >= combat.initiative.length) {
            combat.initiative_index = 0;
            combat.current_turn++;
        }
        loop_guard++;
        if (loop_guard > combat.initiative.length + 1) return -1;
    } while (!combat.unit_statuses[combat.initiative[combat.initiative_index]].alive);

    return combat.initiative[combat.initiative_index];
}

export function get_current_unit_id(combat: Combat): UnitId {
    return combat.initiative[combat.initiative_index];
}
