<!-- ui/components/entity_description.svelte -->
<script lang="ts">
    import { Entity } from "../../engine/entities/entity.svelte";
    import type { Opt } from "../../engine/utils/option";

    interface Props {
        selected_entity: Opt<Entity>;
    }

    let { selected_entity }: Props = $props();
</script>

{#if selected_entity.is_some()}
    {@const entity = selected_entity.value}
    <h3>Entity description:</h3>
    <ul>
        <li>{entity.id}</li>
        <li>{entity.name}</li>
        <li>{entity.room_id}</li>
    </ul>
{:else}
    <p>No entity selected</p>
{/if}

<style>
</style>
