// engine/game_state.ts
import type { EntityId } from "./entities/entity.svelte"

export type GameState = ExploreState | CombatState | DialogueState | TradeState

export type ExploreState = { mode: "explore" }
export type CombatState = { mode: "combat", player_team_ids: EntityId[], enemy_team_ids: EntityId[] }
export type DialogueState = { mode: "dialogue", target_id: EntityId }
export type TradeState = { mode: "trade", target_id: EntityId }
