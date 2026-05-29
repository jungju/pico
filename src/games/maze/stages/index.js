import { generatedMazeStages } from "./generatedStages.js";
import { gardenMazeStage } from "./stage001.js";

export const mazeStages = [gardenMazeStage, ...generatedMazeStages];
export const defaultMazeStage = mazeStages[0];
