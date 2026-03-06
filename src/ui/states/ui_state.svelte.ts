// ui/states/ui_state.svelte.ts
import type { EntityId } from "../../engine/entities/entity.svelte";
import { none, Opt } from "../../engine/utils/option";

export const ui_state = $state<{ selected_entity_id: Opt<EntityId> }>({
    selected_entity_id: none
});
