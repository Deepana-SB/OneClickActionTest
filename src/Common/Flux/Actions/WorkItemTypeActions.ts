import { WorkItemTypeActionsHub } from "Common/Flux/Actions/ActionsHub";
import { StoreFactory } from "Common/Flux/Stores/BaseStore";
import { WorkItemTypeStore } from "Common/Flux/Stores/WorkItemTypeStore";
import { localeIgnoreCaseComparer } from "Common/Utilities/String";
import { getClient } from "Common/Utilities/WITRestClient";
import { WorkItemType } from "TFS/WorkItemTracking/Contracts";

export namespace WorkItemTypeActions {
    const workItemTypeStore: WorkItemTypeStore = StoreFactory.getInstance<WorkItemTypeStore>(WorkItemTypeStore);

    export async function initializeWorkItemTypes() {
        if (workItemTypeStore.isLoaded()) {
            WorkItemTypeActionsHub.InitializeWorkItemTypes.invoke(null);
        } else if (!workItemTypeStore.isLoading()) {
            workItemTypeStore.setLoading(true);
            try {
                const workItemTypes = await getClient().getWorkItemTypes(VSS.getWebContext().project.id);
                workItemTypes.sort((a: WorkItemType, b: WorkItemType) => localeIgnoreCaseComparer(a.name, b.name));

                WorkItemTypeActionsHub.InitializeWorkItemTypes.invoke(workItemTypes);
                workItemTypeStore.setLoading(false);
            } catch (e) {
                workItemTypeStore.setLoading(false);
                throw e.message;
            }
        }
    }
}
