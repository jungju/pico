export function getRelativePoint(event, pictureElement) {
  const rect = pictureElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;

  return {
    x: clampPercent(x),
    y: clampPercent(y),
  };
}

export function isPointInArea(point, area) {
  if (!point || !area) return false;

  if (area.type === "circle") {
    const dx = point.x - area.x;
    const dy = point.y - area.y;
    return Math.hypot(dx, dy) <= area.r;
  }

  if (area.type === "rect") {
    return (
      point.x >= area.x &&
      point.x <= area.x + area.w &&
      point.y >= area.y &&
      point.y <= area.y + area.h
    );
  }

  if (area.type === "polygon") {
    return isPointInPolygon(point, area.points || []);
  }

  return false;
}

export function findDifferenceAt(point, stage, foundDifferenceIds = new Set()) {
  return (
    stage.differences.find((difference) => {
      return !foundDifferenceIds.has(difference.id) && isPointInArea(point, difference.area);
    }) || null
  );
}

export function findObjectAt(point, stage) {
  return stage.objects.find((object) => isPointInArea(point, object.area)) || null;
}

function isPointInPolygon(point, points) {
  if (points.length < 3) return false;

  let inside = false;

  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const crossesY = yi > point.y !== yj > point.y;
    const xAtY = ((xj - xi) * (point.y - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (crossesY && point.x < xAtY) inside = !inside;
  }

  return inside;
}

function clampPercent(value) {
  return Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
}
