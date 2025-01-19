import { contrastRatio, relativeLuminance } from "./analyze";

import { Vec3 } from "@fimbul-works/vec";
import { classifyColor } from "./analyze";
import { colorToString } from "./format";
import { estimateColorTemperature } from "./kelvin";
import { rgbToHSL } from "./hsl";
import { rgbToLAB } from "./lab";
import { simulateColorBlindness } from "./colorblind";

interface ColorDebugInfo {
  original: {
    vec3: string;
    rgb: string;
    hex: string;
    hsl: string;
  };

  colorSpaces: {
    rgb: { r: number; g: number; b: number };
    hsl: { h: number; s: number; l: number };
    lab: { l: number; a: number; b: number };
  };

  characteristics: {
    luminance: number;
    temperature: number | null;
    classification: ReturnType<typeof classifyColor>;
  };

  accessibility: {
    contrastRatios: {
      onWhite: number;
      onBlack: number;
      onGray: number;
    };
    wcag: {
      AANormal: boolean;
      AAANormal: boolean;
      AALarge: boolean;
      AAALarge: boolean;
    };
  };

  colorBlindness: {
    protanopia: string;
    deuteranopia: string;
    tritanopia: string;
    achromatopsia: string;
  };
}

type ColorChannelValidation = {
  valid: boolean;
  value: number;
  min: number;
  max: number;
};

export interface ColorValidationResult {
  valid: boolean;
  issues: string[];
  warnings: string[];
  colorSpace: {
    inGamut: boolean;
    channelValidation: {
      [channel: string]: ColorChannelValidation;
    };
  };
}

/**
 * Provides comprehensive debug information about a color
 * @param color Color to analyze
 * @returns Detailed color information for debugging
 */
export function debugColor(color: Vec3): ColorDebugInfo {
  const white = new Vec3(1, 1, 1);
  const black = new Vec3(0, 0, 0);
  const gray = new Vec3(0.5, 0.5, 0.5);

  const hsl = rgbToHSL(color);
  const lab = rgbToLAB(color);
  const luminance = relativeLuminance(color);
  const temperature = estimateColorTemperature(color);

  return {
    original: {
      vec3: `Vec3(${color.x.toFixed(3)}, ${color.y.toFixed(3)}, ${color.z.toFixed(3)})`,
      rgb: colorToString(color, { format: "rgb" }),
      hex: colorToString(color, { format: "hex" }),
      hsl: colorToString(color, { format: "hsl" }),
    },

    colorSpaces: {
      rgb: {
        r: Math.round(color.x * 255),
        g: Math.round(color.y * 255),
        b: Math.round(color.z * 255),
      },
      hsl: {
        h: Math.round(hsl.x * 360),
        s: Math.round(hsl.y * 100),
        l: Math.round(hsl.z * 100),
      },
      lab: {
        l: Math.round(lab.x),
        a: Math.round(lab.y),
        b: Math.round(lab.z),
      },
    },

    characteristics: {
      luminance,
      temperature,
      classification: classifyColor(color),
    },

    accessibility: {
      contrastRatios: {
        onWhite: contrastRatio(color, white),
        onBlack: contrastRatio(color, black),
        onGray: contrastRatio(color, gray),
      },
      wcag: {
        AANormal:
          contrastRatio(color, white) >= 4.5 ||
          contrastRatio(color, black) >= 4.5,
        AAANormal:
          contrastRatio(color, white) >= 7 || contrastRatio(color, black) >= 7,
        AALarge:
          contrastRatio(color, white) >= 3 || contrastRatio(color, black) >= 3,
        AAALarge:
          contrastRatio(color, white) >= 4.5 ||
          contrastRatio(color, black) >= 4.5,
      },
    },

    colorBlindness: {
      protanopia: colorToString(simulateColorBlindness(color, "protanopia"), {
        format: "hex",
      }),
      deuteranopia: colorToString(
        simulateColorBlindness(color, "deuteranopia"),
        { format: "hex" },
      ),
      tritanopia: colorToString(simulateColorBlindness(color, "tritanopia"), {
        format: "hex",
      }),
      achromatopsia: colorToString(
        simulateColorBlindness(color, "achromatopsia"),
        { format: "hex" },
      ),
    },
  };
}

/**
 * Validates if a color is within valid ranges for its color space
 * and provides detailed validation information
 * @param color Color to validate
 * @param space Color space to validate against
 * @returns Validation results with detailed information
 */
export function validateColorSpace(
  color: Vec3,
  space: "RGB" | "HSL" | "LAB" = "RGB",
): ColorValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  let inGamut = true;
  const channelValidation: {
    [key: string]: ColorChannelValidation;
  } = {};

  switch (space) {
    case "RGB": {
      ["R", "G", "B"].forEach((channel, i) => {
        const value = color.xyz[i];
        channelValidation[channel] = {
          valid: value >= 0 && value <= 1,
          value: value,
          min: 0,
          max: 1,
        };

        if (value < 0 || value > 1) {
          issues.push(
            `${channel} channel value ${value} is outside valid range [0,1]`,
          );
        }
        if (value < 0.001 && value > 0) {
          warnings.push(
            `${channel} channel has very small positive value: ${value}`,
          );
        }
      });

      if (color.xyz.some((v) => !Number.isFinite(v))) {
        issues.push("Color contains NaN or Infinity values");
      }

      break;
    }

    case "HSL": {
      const hsl = rgbToHSL(color);

      channelValidation.H = {
        valid: Number.isFinite(hsl.x),
        value: hsl.x * 360,
        min: 0,
        max: 360,
      };

      if (!Number.isFinite(hsl.x)) {
        issues.push("Hue value is invalid (NaN or Infinity)");
      }

      channelValidation.S = {
        valid: hsl.y >= 0 && hsl.y <= 1,
        value: hsl.y,
        min: 0,
        max: 1,
      };

      if (hsl.y < 0 || hsl.y > 1) {
        issues.push(`Saturation value ${hsl.y} is outside valid range [0,1]`);
      }

      channelValidation.L = {
        valid: hsl.z >= 0 && hsl.z <= 1,
        value: hsl.z,
        min: 0,
        max: 1,
      };

      if (hsl.z < 0 || hsl.z > 1) {
        issues.push(`Lightness value ${hsl.z} is outside valid range [0,1]`);
      }

      // Special cases
      if (hsl.y === 0 && hsl.x !== 0) {
        warnings.push("Hue value is meaningless when saturation is 0");
      }

      if (hsl.z === 0 || hsl.z === 1) {
        warnings.push("Saturation has no effect at lightness 0 or 1");
      }

      break;
    }

    case "LAB": {
      const lab = rgbToLAB(color);

      channelValidation.L = {
        valid: lab.x >= 0 && lab.x <= 100,
        value: lab.x,
        min: 0,
        max: 100,
      };

      if (lab.x < 0 || lab.x > 100) {
        issues.push(`L* value ${lab.x} is outside valid range [0,100]`);
      }

      channelValidation.a = {
        valid: lab.y >= -128 && lab.y <= 127,
        value: lab.y,
        min: -128,
        max: 127,
      };

      if (lab.y < -128 || lab.y > 127) {
        warnings.push(`a* value ${lab.y} is outside typical range [-128,127]`);
      }

      channelValidation.b = {
        valid: lab.z >= -128 && lab.z <= 127,
        value: lab.z,
        min: -128,
        max: 127,
      };

      if (lab.z < -128 || lab.z > 127) {
        warnings.push(`b* value ${lab.z} is outside typical range [-128,127]`);
      }

      const [r, g, b] = color.xyz;
      inGamut =
        r >= -0.0001 &&
        r <= 1.0001 &&
        g >= -0.0001 &&
        g <= 1.0001 &&
        b >= -0.0001 &&
        b <= 1.0001;

      if (!inGamut) {
        issues.push("Color is outside sRGB gamut");
      }

      break;
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
    colorSpace: {
      inGamut,
      channelValidation,
    },
  };
}
