// engine/game_state.ts
import type { Combat } from "./combats/combat.svelte"
import type { Dialogue } from "./dialogues/dialogue.svelte"
import type { Trade } from "./trades/trade.svelte"

export type GameState = ExploreState | CombatState | DialogueState | TradeState

export type ExploreState = { mode: "explore" }
export type CombatState = { mode: "combat", combat: Combat }
export type DialogueState = { mode: "dialogue", dialogue: Dialogue }
export type TradeState = { mode: "trade", trade: Trade }
