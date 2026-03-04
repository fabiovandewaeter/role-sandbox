// lib/game_controller.ts
import { get } from 'svelte/store';
import { world_store } from '../stores/world';
import { combat_is_active, next_turn_logic, get_current_unit_id, move_unit_in_combat, spawn_combat, compute_ai_turn_step } from '../../engine/combat';
import type { Coord, LevelId, UnitId, UnitStats, World } from '../../engine/types';
import type { Combat, CombatAction, CombatId, Team, UnitCombatState } from '../../engine/combat_types';
import { writable } from 'svelte/store';
import { move_unit_in_level, create_empty_level, add_unit_to_level } from '../../engine/map/level';
import { get_active_level } from '../../engine/world';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export const isAnimating = writable(false);
export const isPlayerTurn = writable(false);

export function try_move_unit(world: World, unit_id: UnitId, to: Coord): boolean {
    if (world.state.mode === "combat") {
        const combat = world.combats[world.state.combat_id];
        return move_unit_in_combat(combat, unit_id, to, world);
    } else {
        const level = get_active_level(world);
        return move_unit_in_level(level, unit_id, to, world);
    }
}

export function enter_combat(world: World, combat_id: CombatId, combat_level_id: LevelId) {
    if (world.state.mode !== "explore") throw new Error("Already in combat");
    world.state = {
        mode: "combat",
        combat_id,
        level_id: combat_level_id,
        origin_level_id: world.state.level_id,
    };
}

export function exit_combat(world: World) {
    if (world.state.mode !== "combat") throw new Error("Not in combat");
    const origin = world.state.origin_level_id;
    world.state = { mode: "explore", level_id: origin };
}

export async function start_turn_loop() {
    let world = get(world_store);

    if (world.state.mode !== "combat") {
        console.log("Pas en combat, rien à faire.");
        return;
    }

    const combat = world.combats[world.state.combat_id];

    if (!combat || !combat_is_active(combat)) {
        console.log("Combat terminé !");
        return;
    }

    const current_unit_id = get_current_unit_id(combat);
    const unit_state = combat.unit_statuses[current_unit_id];
    reset_unit_statues_new_turn(combat, current_unit_id, world.units[current_unit_id].max_stats);

    if (unit_state.team === "A") {
        console.log("C'est au JOUEUR de jouer.");
        isPlayerTurn.set(true);
    } else {
        console.log("C'est à l'IA de jouer.");
        isPlayerTurn.set(false);

        let action;
        do {
            world = get(world_store);
            action = compute_ai_turn_step(combat, world);
            await execute_action(action);
            await sleep(150);
        } while (action.type !== "WAIT");

        finish_turn();
    }
}

function reset_unit_statues_new_turn(combat: Combat, id: UnitId, unit_max_stats: UnitStats) {
    combat.unit_statuses[id].current_stats.mp = unit_max_stats.mp;
}

/**
 * Exécute une action. Pour MOVE, anime case par case le long du chemin.
 */
export async function execute_action(action: CombatAction) {
    isAnimating.set(true);

    if (action.type === "MOVE") {
        // ✅ Anime chaque étape du chemin individuellement
        // path[0] = case de départ, on commence à path[1]
        for (let i = 1; i < action.path.length; i++) {
            const step = action.path[i];
            world_store.update(w => {
                try_move_unit(w, action.unit_id, step);
                return w;
            });
            await sleep(150); // pause entre chaque case
        }
    }

    isAnimating.set(false);
}

export function finish_turn() {
    isPlayerTurn.set(false);
    world_store.update(w => {
        if (w.state.mode !== "combat") throw new Error("finish_turn appelé hors combat");
        const combat = w.combats[w.state.combat_id];
        if (!combat) throw new Error(`Combat ${w.state.combat_id} not found`);
        next_turn_logic(combat);
        return w;
    });
    start_turn_loop();
}

/**
 * Appelé depuis l'UI avec le chemin complet calculé par find_path.
 * - Vérifie que la destination est dans reachable_cells (anti-TP).
 * - Déduit les MP selon path.length - 1.
 * - Garde le tour si des MP restent.
 */
export async function player_combat_move(path: Coord[], reachable_cells: Set<string>) {
    if (!get(isPlayerTurn) || get(isAnimating)) return;

    const w = get(world_store);
    if (w.state.mode !== "combat") return;

    const combat = w.combats[w.state.combat_id];
    if (!combat) throw new Error(`Combat ${w.state.combat_id} introuvable`);

    const unitId = get_current_unit_id(combat);
    const unit_status = combat.unit_statuses[unitId];

    if (!path || path.length < 2) return;

    const dest = path[path.length - 1];
    const dest_key = `${dest.x},${dest.y}`;

    if (!reachable_cells.has(dest_key)) {
        console.log("Case hors de portée !");
        return;
    }

    const cost = path.length - 1;

    if (unit_status.current_stats.mp < cost) {
        console.log(`Pas assez de MP : besoin de ${cost}, reste ${unit_status.current_stats.mp}`);
        return;
    }

    const action: CombatAction = { type: "MOVE", unit_id: unitId, path };
    await execute_action(action);

    // Déduit les MP après l'animation complète
    world_store.update(w => {
        if (w.state.mode !== "combat") throw new Error("Not in combat");
        const c = w.combats[w.state.combat_id];
        c.unit_statuses[unitId].current_stats.mp -= cost;
        return w;
    });

    const ws = get(world_store);
    if (ws.state.mode !== "combat") throw new Error("Not in combat");
    const remaining_mp = ws.combats[ws.state.combat_id].unit_statuses[unitId].current_stats.mp;

    if (remaining_mp <= 0) {
        console.log("Plus de MP, fin du tour automatique.");
        finish_turn();
    }
}

/** used to know if another click happend and current path changed */
let move_token = 0; // token global
export async function player_explore_move(path: Coord[], unit_id: UnitId) {
    if (get(isAnimating)) {
        // Annule le déplacement en cours en incrémentant le token
        move_token++;
    }

    const my_token = ++move_token;
    isAnimating.set(true);

    for (let i = 1; i < path.length; i++) {
        // Si un nouveau déplacement a été demandé, on arrête
        if (move_token !== my_token) return;

        const step = path[i];
        world_store.update(w => {
            const level = get_active_level(w);
            move_unit_in_level(level, unit_id, step, w);
            return w;
        });
        await sleep(150);
    }

    if (move_token === my_token) {
        isAnimating.set(false);
    }
}

export function start_combat_from_current_level() {
    world_store.update(w => {
        if (w.state.mode === "combat") {
            console.warn("Déjà en combat !");
            return w;
        }

        const explore_level = get_active_level(w);
        const unit_ids = explore_level.units;

        if (unit_ids.length < 2) {
            console.warn("Pas assez d'unités pour un combat.");
            return w;
        }

        const combat_level_id: LevelId = w.next_level_id++;
        const combat_level = create_empty_level(combat_level_id, explore_level.board.width, explore_level.board.height);
        combat_level.board = explore_level.board;
        combat_level.structures = explore_level.structures;
        w.levels[combat_level_id] = combat_level;

        const unit_statuses: Record<UnitId, UnitCombatState> = {};
        const initiative: UnitId[] = [];

        unit_ids.forEach((uid, i) => {
            const unit = w.units[uid];
            const team: Team = i < Math.ceil(unit_ids.length / 2) ? "A" : "B";
            unit_statuses[uid] = {
                id: uid,
                pos: unit.pos,
                team,
                alive: true,
                has_played: false,
                current_stats: { ...unit.max_stats },
            };
            add_unit_to_level(combat_level, uid);
            initiative.push(uid);
        });

        const combat_id = spawn_combat(w, {
            unit_statuses,
            current_turn: 1,
            initiative,
            initiative_index: 0,
        });

        enter_combat(w, combat_id, combat_level_id);
        return w;
    });

    start_turn_loop();
}
