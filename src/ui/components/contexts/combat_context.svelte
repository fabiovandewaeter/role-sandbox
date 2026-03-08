<!-- ui/components/contexts/combat_context.svelte -->
<script>
    import { world } from "../../lib/world_controller";
</script>

<h2>Combat mode</h2>
<button
    title="switch-to-explore-mode"
    onclick={() => (world.state = { mode: "explore" })}
>
    switch to explore mode
</button>
