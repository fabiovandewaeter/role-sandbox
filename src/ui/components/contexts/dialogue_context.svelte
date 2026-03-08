<!-- ui/components/contexts/dialogue_context.svelte -->
<script>
    import { world } from "../../lib/world_controller";
</script>

<h2>Dialogue mode</h2>
<button
    title="switch-to-explore-mode"
    onclick={() => (world.state = { mode: "explore" })}
>
    switch to explore mode
</button>
