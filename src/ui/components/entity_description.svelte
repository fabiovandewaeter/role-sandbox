<!-- ui/components/entity_description.svelte -->
<script lang="ts">
    import { Entity, type EntityId } from "../../engine/entities/entity.svelte";
    import { none, type Opt } from "../../engine/utils/option";
    import { world } from "../lib/world_controller";

    interface Props {
        selected_entity_id: Opt<EntityId>;
    }

    let { selected_entity_id }: Props = $props();

    let entity_opt: Opt<Entity> = $derived(
        selected_entity_id.is_some()
            ? world.get_entity(selected_entity_id.value)
            : none,
    );
</script>

<div class="entity-description">
    {#if entity_opt.is_some()}
        {@const entity = entity_opt.value}
        <h3>Entity description:</h3>
        <ul>
            <li>{entity.id}</li>
            <li>{entity.name}</li>
            <li>{entity.room_id}</li>
        </ul>
    {:else}
        <p>No entity selected</p>
    {/if}
</div>

<style>
</style>
