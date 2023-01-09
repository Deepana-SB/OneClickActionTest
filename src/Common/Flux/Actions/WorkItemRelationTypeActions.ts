import { WorkItemRelationTypeActionsHub } from "Common/Flux/Actions/ActionsHub";
import { StoreFactory } from "Common/Flux/Stores/BaseStore";
import { WorkItemRelationTypeStore } from "Common/Flux/Stores/WorkItemRelationTypeStore";
import { localeIgnoreCaseComparer } from "Common/Utilities/String";
import { getClient } from "Common/Utilities/WITRestClient";
import { WorkItemRelationType } from "TFS/WorkItemTracking/Contracts";

export namespace WorkItemRelationTypeActions {
    const workItemRelationTypeStore: WorkItemRelationTypeStore = StoreFactory.getInstance<WorkItemRelationTypeStore>(WorkItemRelationTypeStore);

    export async function initializeWorkItemRelationTypes() {
        if (workItemRelationTypeStore.isLoaded()) {
            WorkItemRelationTypeActionsHub.InitializeWorkItemRelationTypes.invoke(null);
        } else if (!workItemRelationTypeStore.isLoading()) {
            workItemRelationTypeStore.setLoading(true);
            try {
                const workItemRelationTypes = await getClient().getRelationTypes();
                workItemRelationTypes.sort((a: WorkItemRelationType, b: WorkItemRelationType) => localeIgnoreCaseComparer(a.name, b.name));

                WorkItemRelationTypeActionsHub.InitializeWorkItemRelationTypes.invoke(workItemRelationTypes);
                workItemRelationTypeStore.setLoading(false);
            } catch (e) {
                workItemRelationTypeStore.setLoading(false);
                throw e.message;
            }
        }
    }
}
