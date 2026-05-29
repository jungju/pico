import { generatedMemoryCardStages } from "./generatedStages.js";
import { memoryAnimalsStage } from "./stage001.js";

export const memoryCardStages = [memoryAnimalsStage, ...generatedMemoryCardStages];
export const defaultMemoryCardsStage = memoryCardStages[0];
