<script lang="ts">
    import type { Stats } from "../../engine/entities/entity.svelte";

    type PropsTypes = {
        stats: Stats;
    };

    let { stats }: PropsTypes = $props();
</script>

<div class="stats-description">
    <ul>
        <li>hp: {stats.hp}</li>
        <li>mana: {stats.mana}</li>
        <li>attack: {stats.attack}</li>
    </ul>
</div>
