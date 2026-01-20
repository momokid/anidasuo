export function detectObstacle(frame) {
  //AI logic

  if (!frame) {
    return null;
  }
  const { width, height } = frame;

  // 🔺 NEW: simulate obstacle size ratio
  // Assumption: closer obstacles occupy more of the frame
  const frameArea = width * height;

  const estimatedObstacleArea = frameArea * 0.25;

  const areaRatio = estimatedObstacleArea / frameArea;

  let distance = "far";

  if (areaRatio > 0.4) {
    distance = "near";
  } else if (areaRatio > 0.2) {
    distance = "medium";
  }

  // 🔺 NEW: simple direction heuristic
  // (later replaced by bounding box center)
  const direction = "center";

  return {
    obstacleDetected: areaRatio > 0.15,
    obstacleType: "unknown",
    distance,
    direction,
  };
}
