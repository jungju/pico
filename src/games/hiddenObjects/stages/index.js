import { generatedHiddenObjectStages } from "./generatedStages.js";
import { hiddenPicnicStage } from "./stage001.js";

export const hiddenObjectStages = [hiddenPicnicStage, ...generatedHiddenObjectStages];
export const defaultHiddenObjectsStage = hiddenObjectStages[0];
