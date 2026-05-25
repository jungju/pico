import { contentStages } from "./contentStages";
import { findLearnStage } from "./stage001";

export const findLearnStages = contentStages.length > 0 ? contentStages : [findLearnStage];
export const defaultFindLearnStage = findLearnStages[0];
