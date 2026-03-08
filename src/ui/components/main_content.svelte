<!-- ui/components/main_content.svelte -->
<script lang="ts">
    import { world } from "../lib/world_controller";
    import CombatContext from "./contexts/combat_context.svelte";
    import DialogueContext from "./contexts/dialogue_context.svelte";
    import ExploreContext from "./contexts/explore_context.svelte";
    import TradeContext from "./contexts/trade_context.svelte";

    let current_game_state = $derived(world.state.mode);
</script>

<div class="main-content">
    {#if current_game_state === "explore"}
        <ExploreContext />
    {:else if current_game_state == "combat"}
        <CombatContext />
    {:else if current_game_state == "dialogue"}
        <DialogueContext />
    {:else if current_game_state == "trade"}
        <TradeContext />
    {/if}

    <h3>TODO</h3>
    <ul>
        <li>ajouter fichier avec text fr / en</li>
        <li>
            voir UI du main_content avec: description room + entites présentes
            dans une liste déroulante + options MAIS pas juste texte, faire avec
            boutons - utiliser "player.room != null ?" au lieu de juste
            "player.room ?" car quand c'est index 0 ça retourne faux
        </li>
    </ul>
</div>

<style>
    .main-content {
        background-color: #888;
        padding: 20px;
    }
</style>
