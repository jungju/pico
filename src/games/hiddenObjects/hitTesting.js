import { getRelativePoint, isPointInArea } from "../findLearn/hitTesting";

export { getRelativePoint, isPointInArea };

export function findHiddenTargetAt(point, stage, foundTargetIds = new Set()) {
  return (
    (stage.targets || []).find((target) => {
      return !foundTargetIds.has(target.id) && isPointInArea(point, getHiddenTargetArea(target));
    }) || null
  );
}

export function getHiddenTargetArea(target) {
  return target.area || null;
}

export function getHiddenTargetMarker(target) {
  return target.marker || null;
}
