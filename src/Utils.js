export const hexToRgb = function (args) {
  const match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
  if (!match) {
    return [0, 0, 0];
  }

  let colorString = match[0];

  if (match[0].length === 3) {
    colorString = colorString
      .split("")
      .map((char) => {
        return char + char;
      })
      .join("");
  }

  const integer = parseInt(colorString, 16);
  const r = (integer >> 16) & 0xff;
  const g = (integer >> 8) & 0xff;
  const b = integer & 0xff;

  return [r, g, b];
};

export const hexToHsl = function (args) {
  const rgb = hexToRgb(args);
  return rgbToHsl(rgb);
};

export const rgbToHsl = function (rgb) {
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h;
  let s;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  const l = (min + max) / 2;

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [Math.ceil(h), Math.ceil(s * 100), Math.ceil(l * 100)];
};

const hslToRgb = (hsl) => {
  const h = hsl[0] / 360;
  const s = hsl[1] / 100;
  const l = hsl[2] / 100;
  let t2;
  let t3;
  let val;

  if (s === 0) {
    val = l * 255;
    return [val, val, val];
  }

  if (l < 0.5) {
    t2 = l * (1 + s);
  } else {
    t2 = l + s - l * s;
  }

  const t1 = 2 * l - t2;

  const rgb = [0, 0, 0];
  for (let i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1);
    if (t3 < 0) {
      t3++;
    }

    if (t3 > 1) {
      t3--;
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3;
    } else if (2 * t3 < 1) {
      val = t2;
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
    } else {
      val = t1;
    }

    rgb[i] = val * 255;
  }

  return rgb;
};

export const rgbToHex = (args) => {
  const integer =
    ((Math.round(args[0]) & 0xff) << 16) +
    ((Math.round(args[1]) & 0xff) << 8) +
    (Math.round(args[2]) & 0xff);

  const string = integer.toString(16).toUpperCase();
  return "000000".substring(string.length) + string;
};

export const hslToHex = (args) => {
  const rgb = hslToRgb(args);
  return rgbToHex(rgb);
};

export const colorDistance = (color1, color2) => {
  const x =
    Math.pow(color1[0] - color2[0], 2) +
    Math.pow(color1[1] - color2[1], 2) +
    Math.pow(color1[2] - color2[2], 2);
  return Math.sqrt(x);
};

const clusters = [
  { id: 1, name: "red", leadColor: [255, 0, 0], colors: [] },
  { id: 2, name: "orange", leadColor: [255, 128, 0], colors: [] },
  { id: 3, name: "yellow", leadColor: [255, 255, 0], colors: [] },
  { id: 4, name: "chartreuse", leadColor: [128, 255, 0], colors: [] },
  { id: 5, name: "green", leadColor: [0, 255, 0], colors: [] },
  { id: 6, name: "spring green", leadColor: [0, 255, 128], colors: [] },
  { id: 7, name: "cyan", leadColor: [0, 255, 255], colors: [] },
  { id: 8, name: "azure", leadColor: [0, 127, 255], colors: [] },
  { id: 9, name: "blue", leadColor: [0, 0, 255], colors: [] },
  { id: 10, name: "violet", leadColor: [127, 0, 255], colors: [] },
  { id: 11, name: "magenta", leadColor: [255, 0, 255], colors: [] },
  { id: 12, name: "rose", leadColor: [255, 0, 128], colors: [] },
  { id: 13, name: "black", leadColor: [0, 0, 0], colors: [] },
  { id: 14, name: "grey", leadColor: [235, 235, 235], colors: [] },
  { id: 15, name: "white", leadColor: [255, 255, 255], colors: [] },
];

const compareHex = (a, b) => {
  if (a.hex < b.hex) {
    return -1;
  }
  if (a.hex > b.hex) {
    return 1;
  }
  return 0;
};

export const sortWithClusters = (colorsToSort) => {
  colorsToSort.forEach((color, index) => {
    let minDistance = Number.POSITIVE_INFINITY;
    let minDistanceClusterIndex = -1;

    clusters.forEach((cluster, clusterIndex) => {
      const distance = colorDistance(color.RGB, cluster.leadColor);
      if (minDistance > distance) {
        minDistance = distance;
        minDistanceClusterIndex = clusterIndex;
      }
    });

    clusters[minDistanceClusterIndex].colors.push(color);
  });
  clusters.forEach((cluster) => {
    cluster.colors = cluster.colors.sort(compareHex);
  });

  return clusters;
};

const compareDistance = (a, b) => {
  if (a.distance < b.distance) {
    return -1;
  }
  if (a.distance > b.distance) {
    return 1;
  }
  return 0;
};

const rankBySimilarity = (color, cluster) => {
  let searchResults = [];
  cluster.forEach((colorInCluster) => {
    const distance = colorDistance(color, colorInCluster.RGB);
    const res = { ...colorInCluster, distance };
    searchResults.push(res);
  });

  return searchResults.sort(compareDistance);
};

export const searchColorsInClusters = (colorsInCluster, searchValue) => {
  let minDistance = Number.POSITIVE_INFINITY;
  let minDistanceClusterIndex = -1;

  const color = hexToRgb(searchValue);

  colorsInCluster.forEach((cluster, clusterIndex) => {
    const distance = colorDistance(color, cluster.leadColor);
    if (minDistance > distance) {
      minDistance = distance;
      minDistanceClusterIndex = clusterIndex;
    }
  });

  const resultClusterColours = colorsInCluster[minDistanceClusterIndex].colors;

  return rankBySimilarity(color, resultClusterColours);
};

const isValidRgbRange = (rgb) => {
  if (rgb[0] >= 0 && rgb[0] <= 255) {
    if (rgb[1] >= 0 && rgb[1] <= 255) {
      if (rgb[2] >= 0 && rgb[2] <= 255) {
        return true;
      }
    }
  }
  return false;
};

const isValidHslRange = (hsl) => {
  if (hsl[0] >= 0 && hsl[0] <= 360) {
    if (hsl[1] >= 0 && hsl[1] <= 100) {
      if (hsl[2] >= 0 && hsl[2] <= 100) {
        return true;
      }
    }
  }
  return false;
};

export const isValidColour = (searchString) => {
  const isHex = /^#[0-9A-Fa-f]{6}$/i.test(searchString);
  const isRgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.test(searchString);
  const isHsl = /^hsl\((\d+),\s*(\d+),\s*(\d+)\)$/i.test(searchString);
  if (isHex || isRgb || isHsl) {
    return true;
  } else {
    return false;
  }
};

export const convertToHex = (searchString) => {
  if (searchString[0] === "r") {
    const regex = /rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/;
    const match = regex.exec(searchString);
    let rgb = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    if (isValidRgbRange(rgb)) {
      return "#" + rgbToHex(rgb);
    }
    return "";
  }
  if (searchString[0] === "h") {
    const regex = /hsl\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)/;
    const match = regex.exec(searchString);
    let hsl = [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
    if (isValidHslRange(hsl)) {
      return "#" + rgbToHsl(hsl);
    }
    return "";
  }
  return searchString;
};
