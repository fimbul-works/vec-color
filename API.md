# API Documentation for @fimbul-works/vec-color

## Table of Contents

1. [Color Fundamentals](#color-fundamentals)
   - [Color Vector Representation](#color-vector-representation)
   - [Types and Interfaces](#types-and-interfaces)
   - [String Parsing & Formatting](#string-parsing--formatting)
   - [Color Space Conversions](#color-space-conversions)

2. [Color Manipulation](#color-manipulation)
   - [Basic Transformations](#basic-transformations)
   - [Advanced Adjustments](#advanced-adjustments)
   - [Effects & Filters](#effects--filters)
   - [Alpha Channel Operations](#alpha-channel-operations)
   - [Blend Modes](#blend-modes)

3. [Color Analysis](#color-analysis)
   - [Color Distance & Similarity](#color-distance--similarity)
   - [Color Classification](#color-classification)
   - [Dominant Color Detection](#dominant-color-detection)
   - [Debug & Validation Tools](#debug--validation-tools)
   - [Accessibility Analysis](#accessibility-analysis)

4. [Palette Generation](#palette-generation)
   - [Basic Color Schemes](#basic-color-schemes)
   - [Accessible Palettes](#accessible-palettes)
   - [Color Variations](#color-variations)
   - [Color Harmonization](#color-harmonization)

5. [Color Spaces](#color-spaces)
   - [RGB/HSL (Display)](#rgbhsl-display)
   - [LAB/XYZ (Perceptual)](#labxyz-perceptual)
   - [CMYK (Print)](#cmyk-print)
   - [Color Temperature](#color-temperature)

6. [Special Features](#special-features)
   - [Color Blindness Simulation & Testing](#color-blindness-simulation--testing)
   - [Cosine Gradient Generation](#cosine-gradient-generation)

7. [Usage Examples](#usage-examples)
   - [Color String Examples](#color-string-examples)
   - [Color Manipulation Examples](#color-manipulation-examples)
     - [Color Adjustment Examples](#color-adjustment-examples)
     - [Alpha Channel Examples](#alpha-channel-examples)
     - [Blend Mode Examples](#blend-mode-examples)
     - [Color Space Conversion Examples](#color-space-conversion-examples)
     - [Temperature Manipulation Examples](#temperature-manipulation-examples)
   - [Color Analysis Examples](#color-analysis-examples)
     - [Color Comparison Examples](#color-analysis-examples)
     - [Color Classification Examples](#color-classification-examples)
     - [Accessibility Examples](#accessibility-examples)
     - [Gamut Examples](#gamut-examples)
     - [Dominant Color Detection Examples](#dominant-color-detection-examples)
     - [Debug Tools Examples](#debug-tools-examples)
   - [Palette Generation Examples](#palette-generation-examples)
     - [Color Scheme Examples](#color-scheme-examples)
     - [Color Harmonization Examples](#color-harmonization-examples)
     - [Gradient Examples](#gradient-examples)
   - [Color Blindness Examples](#color-blindness-examples)

8. [Optimization & Best Practices](#optimization--best-practices)
   - [Performance Tips](#performance-tips)
   - [Error Handling](#error-handling)
   - [Edge Cases](#edge-cases)

## Color Fundamentals

### Color Vector Representation

Colors are represented using vector types from the [@fimbul-works/vec](https://github.com/fimbul-works/vec) library: [Vec3](https://github.com/fimbul-works/vec/blob/main/VEC3.md) for RGB colors and [Vec4](https://github.com/fimbul-works/vec/blob/main/VEC4.md) for RGBA/CMYK, with all values normalized between 0 and 1. This vector-based approach enables powerful mathematical operations and transformations.

#### Basic Color Creation

```typescript
// RGB color representations using constructor
const red = new Vec3(1, 0, 0);        // Pure red
const green = new Vec3(0, 1, 0);      // Pure green
const blue = new Vec3(0, 0, 1);       // Pure blue
const white = new Vec3(1, 1, 1);      // White
const black = new Vec3(0, 0, 0);      // Black
const gray = new Vec3(0.5, 0.5, 0.5); // 50% gray

// RGBA color representation (Vec4)
const translucentRed = new Vec4(1, 0, 0, 0.5); // 50% transparent red
```

#### Color Component Accessors

The library provides intuitive color-specific accessors that make color manipulation more readable:

```typescript
// RGB component access - individual channels
const color = new Vec3(0.8, 0.4, 0.2);
console.log(color.r); // 0.8 (red component)
console.log(color.g); // 0.4 (green component)
console.log(color.b); // 0.2 (blue component)

// Modify individual color channels
color.r = 1.0;  // Make it more red
color.g *= 0.5; // Reduce green by half
color.b += 0.1; // Add a bit more blue

// RGB array access - all channels at once
const [r, g, b] = color.rgb; // Get as array
color.rgb = [0.9, 0.7, 0.3]; // Set all at once

// RGBA color manipulation
const colorWithAlpha = new Vec4(0.6, 0.8, 0.2, 0.9);
console.log(colorWithAlpha.r); // 0.6 (red)
console.log(colorWithAlpha.g); // 0.8 (green)
console.log(colorWithAlpha.b); // 0.2 (blue)
console.log(colorWithAlpha.a); // 0.9 (alpha/transparency)

// RGBA array access
const [r, g, b, a] = colorWithAlpha.rgba; // Get all components
colorWithAlpha.rgba = [1, 0.5, 0, 0.8];   // Set all components

// Create colors using color accessors
const customColor = new Vec3();
customColor.r = 0.7; // 70% red
customColor.g = 0.3; // 30% green
customColor.b = 0.9; // 90% blue

// Transparency manipulation
const opaqueColor = new Vec4();
opaqueColor.rgb = [0.4, 0.8, 0.6]; // Set RGB
opaqueColor.a = 0.75;              // Set alpha separately
```

#### Vector Operations with Color Context

Since colors are vectors, you can use all vector operations while thinking in color terms:

```typescript
// Color blending using vector addition
const warmColor = new Vec3();
warmColor.rgb = [1, 0.6, 0.2]; // Orange

const coolColor = new Vec3();
coolColor.rgb = [0.2, 0.6, 1]; // Blue

// Mix colors (vector addition + scaling)
const mixed = warmColor.add(coolColor).scale(0.5);

// Calculate color distance (vector magnitude)
const colorDistance = warmColor.subtract(coolColor).magnitude;

// Normalize color intensity while preserving hue relationships
const normalizedColor = warmColor.normalize();
```

See the [Vec3](https://github.com/fimbul-works/vec/blob/main/VEC3.md) and [Vec4](https://github.com/fimbul-works/vec/blob/main/VEC4.md) API documentation for a full list of available vector methods and functionality that can be applied to colors.

### Types and Interfaces

```typescript
type ColorBlindnessType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface ColorStringOptions {
    format: 'hex' | 'rgb' | 'hsl';
    alpha?: number;
    includeHash?: boolean;
}

interface ColorClassification {
    temperature: 'warm' | 'cool' | 'neutral';
    intensity: 'vivid' | 'pastel' | 'dark' | 'light' | 'medium';
    category: string;
}
```

### String Parsing & Formatting

Functions for converting between color strings and Vec3/Vec4 representations.

#### Parsing Functions
- `parseColor(color: string): Vec3`: Main entry point for parsing any supported color format
- `parseHex(hex: string): Vec3`: Parses hex color strings (#RGB or #RRGGBB)
- `parseRGB(rgb: string): Vec3`: Parses RGB/RGBA strings (rgb(r,g,b) format)
- `parseHSL(hsl: string): Vec3`: Parses HSL/HSLA strings (hsl(h,s%,l%) format)

#### Formatting Functions
- `colorToString(color: Vec3, options: ColorStringOptions): string`: Main formatting function with configurable output
- `toHex(color: Vec3, includeHash?: boolean): string`: Converts to hex format
- `toRGB(color: Vec3, alpha?: number): string`: Converts to RGB/RGBA format
- `toHSL(color: Vec3, alpha?: number): string`: Converts to HSL/HSLA format

See [Color String Examples](#color-string-examples) for usage patterns.

### Color Space Conversions

```typescript
// Main conversion functions
rgbToHSL(rgb: Vec3): Vec3   // For intuitive color manipulation
hslToRGB(hsl: Vec3): Vec3
rgbToLAB(rgb: Vec3): Vec3   // For precise color comparisons
labToRGB(lab: Vec3): Vec3
rgbToXYZ(rgb: Vec3): Vec3   // For device-independent color
xyzToRGB(xyz: Vec3): Vec3
rgbToCMYK(rgb: Vec3): Vec4  // For print applications
cmykToRGB(cmyk: Vec4): Vec3
```

⚠️ **Considerations:**
- HSL hue undefined at saturation = 0
- LAB conversions may produce out-of-gamut colors
- CMYK conversion is device-dependent
- Temperature estimation may return null for non-blackbody colors

See [Color Spaces](#color-spaces) for detailed information about each color space.

## Color Manipulation

### Basic Transformations

Core color manipulation functions for adjusting basic properties.

#### Functions
- `adjustBrightness(color: Vec3, amount: number): Vec3`: Adjusts overall color brightness
- `adjustSaturation(color: Vec3, amount: number): Vec3`: Modifies color intensity
- `adjustGamma(color: Vec3, gamma: number): Vec3`: Applies gamma correction
- `adjustContrast(color: Vec3, amount: number): Vec3`: Enhances/reduces contrast
- `adjustVibrance(color: Vec3, amount: number): Vec3`: Smart saturation preserving skin tones
- `colorBalance(color: Vec3, adjustments: Vec3): Vec3`: Fine-tune individual RGB channels
- `adjustNeutrality(color: Vec3, amount: number): Vec3`: Shift colors toward/away from gray

#### Usage Notes
- All adjustment amounts are normalized between -1 and 1 unless specified
- Negative values reduce the effect, positive values enhance
- See [Color Adjustment Examples](#color-adjustment-examples)

### Advanced Adjustments

Functions for sophisticated color modifications.

#### Core Functions
- `adjustTemperature(color: Vec3, adjustment: number): Vec3`: Adjusts color temperature
- `adjustTimeOfDay(color: Vec3, timeOfDay: number): Vec3`: Adjusts color based on natural lighting at different times
- `adjustTonalRange(color: Vec3, shadows: number, highlights: number): Vec3`: Selectively adjusts shadows and highlights
- `adjustComplementary(color: Vec3, amount: number): Vec3`: Adjusts color based on its complementary color
- `rotateHue(color: Vec3, degrees: number): Vec3`: Rotates the hue by degrees

#### Usage Notes
- All adjustment amounts are normalized between -1 and 1 unless specified
- Temperature adjustments in Kelvin (-10000K to +10000K)
- Time of day uses 24-hour format (0-23)

### Effects & Filters

Functions for applying common color effects and transformations.

#### Core Functions
- `tint(color: Vec3, amount: number): Vec3`: Adds white (0 to 1)
- `shade(color: Vec3, amount: number): Vec3`: Adds black (0 to 1)
- `tone(color: Vec3, amount: number): Vec3`: Adds gray (0 to 1)
- `sepia(color: Vec3, amount: number): Vec3`: Applies sepia effect (0 to 1)
- `grayscale(color: Vec3): Vec3`: Converts to grayscale
- `invert(color: Vec3): Vec3`: Inverts colors

See [Effects Examples](#effects-examples) for usage patterns.

### Alpha Channel Operations

Functions for handling transparency and alpha channel calculations.

#### Core Functions
- `withAlpha(color: Vec3, alpha?: number): Vec4`: Creates RGBA color from RGB
- `toPremultipliedAlpha(color: Vec3, alpha?: number): Vec4`: Converts to premultiplied format
- `fromPremultipliedAlpha(premultiplied: Vec4): [Vec3, number]`: Extracts color and alpha

#### Usage Notes
- Alpha values range from 0 (transparent) to 1 (opaque)
- Premultiplied alpha is useful for certain blend operations
- Alpha conversion preserves color information

See [Alpha Channel Examples](#alpha-channel-examples) for usage patterns.

### Blend Modes

Functions for combining colors using standard digital imaging blend modes.

#### Basic Blending
- `mix<T extends Vec3 | Vec4>(color1: T, color2: T, ratio: number): T`: Linear interpolation
- `blendMultiply<T extends Vec3 | Vec4>(base: T, blend: T): T`: Multiplication blend
- `blendScreen<T extends Vec3 | Vec4>(base: T, blend: T): T`: Screen blend
- `blendOverlay<T extends Vec3 | Vec4>(base: T, blend: T): T`: Overlay blend

#### Advanced Blending
- `blendSoftLight<T extends Vec3 | Vec4>(base: T, blend: T): T`: Soft light effect
- `blendHardLight<T extends Vec3 | Vec4>(base: T, blend: T): T`: Hard light effect
- `blendColorDodge<T extends Vec3 | Vec4>(base: T, blend: T): T`: Color dodge effect
- `blendColorBurn<T extends Vec3 | Vec4>(base: T, blend: T): T`: Color burn effect

#### Special Blends
- `blendDifference<T extends Vec3 | Vec4>(base: T, blend: T): T`: Absolute color difference
- `blendExclusion<T extends Vec3 | Vec4>(base: T, blend: T): T`: Similar to difference but lower contrast

#### Features
- All blend functions support both RGB (Vec3) and RGBA (Vec4)
- Alpha channel information is preserved when present
- Output format matches input format

See [Blend Mode Examples](#blend-mode-examples) for visual examples and common use cases.

## Color Analysis

### Color Distance & Similarity

Functions for measuring and comparing color differences using different algorithms.

#### Core Functions
- `calculateColorSimilarityFast(colorA: Vec3, colorB: Vec3): number`: Fast RGB-weighted comparison for real-time operations
- `calculateColorSimilarityLab(colorA: Vec3, colorB: Vec3): number`: Precise perceptual comparison using CIEDE2000
- `colorDistanceMatrix(colors: Vec3[]): number[][]`: Generates pairwise comparison matrix for color sets
- `deltaE2000(lab1: Vec3, lab2: Vec3): number`: Low-level CIEDE2000 calculation in LAB space

#### Output Scale
All similarity functions return values between 0 (maximum difference) and 1 (identical).

#### Usage Notes
- Use `calculateColorSimilarityFast` for real-time operations and large datasets
- Use `calculateColorSimilarityLab` for color-critical applications
- LAB-based functions require color conversion ([see Color Spaces](#color-spaces))

See [Color Comparison Examples](#color-comparison-examples) for detailed usage patterns.

### Color Classification

Functions for analyzing and categorizing colors based on their properties.

#### Analysis Functions
- `classifyColor(color: Vec3): ColorClassification`: Categorizes color by temperature, intensity, and basic color name
- `sortColors(colors: Vec3[], by?: "hue" | "saturation" | "lightness" | "temperature"): Vec3[]`: Orders colors by specified attribute
- `perceivedBrightness(color: Vec3): number`: Calculates brightness using human perception weights

See [Color Analysis Examples](#color-analysis-examples) for usage patterns, and [Types and Interfaces](#types-and-interfaces) for `ColorClassification` definition..

### Dominant Color Detection
- `findDominantColors(colors: Vec3[], count?: number): Vec3[]`: Finds dominant colors using k-means clustering

See [Dominant Color Detection Examples](#dominant-color-detection-examples) for detailed usage.

### Accessibility Analysis

Functions for ensuring color combinations meet WCAG accessibility standards.

#### Core Functions
- `contrastRatio(color1: Vec3, color2: Vec3): number`: Calculates WCAG contrast ratio (1-21)
- `meetsWCAGRequirements(foreground: Vec3, background: Vec3, level: "AA" | "AAA", isLargeText?: boolean): boolean`: Checks WCAG compliance
- `relativeLuminance(color: Vec3): number`: Calculates relative luminance (0-1)
- `getTextColor(backgroundColor: Vec3): Vec3`: Determines optimal text color for background

#### Usage Notes
- WCAG AA requires contrast ratio ≥ 4.5 (3.0 for large text)
- WCAG AAA requires contrast ratio ≥ 7.0 (4.5 for large text)

See [Accessibility Examples](#accessibility-examples) for implementation patterns.

### Debug & Validation Tools

Tools for inspecting color properties and validating color values.

#### Debug Functions
- `debugColor(color: Vec3): ColorDebugInfo`: Provides comprehensive color information
- `validateColorSpace(color: Vec3, space: "RGB" | "HSL" | "LAB"): ColorValidationResult`: Validates color values

#### Debug Information
- Original color representations (Vec3, RGB, Hex, HSL)
- Color space values (RGB, HSL, LAB)
- Color characteristics (luminance, temperature, classification)
- Accessibility metrics
- Color blindness simulations

See [Debug Tools Examples](#debug-tools-examples) for implementation details.

## Palette Generation

### Color Schemes

Functions for generating harmonious color combinations.

#### Basic Schemes
- `complement(color: Vec3): Vec3`: Returns complementary color
- `analogous(color: Vec3): Vec3[]`: Generates analogous color scheme
- `triadic(color: Vec3): Vec3[]`: Creates triadic color scheme
- `splitComplementary(color: Vec3): Vec3[]`: Generates split-complementary scheme
- `tetradic(color: Vec3): Vec3[]`: Creates double-complementary scheme
- `compound(color: Vec3): Vec3[]`: Generates compound color scheme

#### Color Variations
- `monochromatic(color: Vec3): Vec3[]`: Creates variations of the same hue
- `shades(color: Vec3, steps?: number): Vec3[]`: Generates darker variations
- `tints(color: Vec3, steps?: number): Vec3[]`: Generates lighter variations
- `tones(color: Vec3, steps?: number): Vec3[]`: Generates reduced saturation variations

See [Color Scheme Examples](#color-scheme-examples) for visual results.

### Accessible Palettes
- `getTextColor(backgroundColor: Vec3): Vec3`: Determines optimal text color for background
- `generateAccessiblePalette(baseColor: Vec3, count?: number, minContrast?: number): Vec3[]`: Generates accessible color palette

### Color Harmonization
- `harmonizeColor(color: Vec3, referenceColor: Vec3): Vec3`: Harmonizes a color with a reference color
  - Adjusts to nearest harmonic relationship
  - Preserves color character while improving harmony
  - Uses common harmonic intervals (30°, 60°, 90°, etc.)
- `harmonizePalette(colors: Vec3[], wcagLevel?: "AA" | "AAA"): Vec3[]`: Harmonizes a set of colors
  - Maintains WCAG contrast requirements
  - Preserves color relationships
  - Optimizes for visual harmony

See [Color Harmonization Examples](#color-harmonization-examples)

## Color Spaces

The library supports multiple color spaces for different use cases.

### RGB (Display)
Standard color space for digital displays.

```typescript
rgbToHSL(rgb: Vec3): Vec3   // Convert to HSL
parseRGB(str: string): Vec3 // Parse RGB string
toRGB(color: Vec3): string  // Format as RGB string
```

### HSL (Human-Readable)
Intuitive color space for manipulation.

```typescript
hslToRGB(hsl: Vec3): Vec3   // Convert to RGB
parseHSL(str: string): Vec3 // Parse HSL string
toHSL(color: Vec3): string  // Format as HSL string
```

### LAB/XYZ (Color Matching)
Device-independent spaces for precise color calculations.

```typescript
rgbToLAB(rgb: Vec3): Vec3 // Convert RGB to LAB
labToRGB(lab: Vec3): Vec3 // Convert LAB to RGB
rgbToXYZ(rgb: Vec3): Vec3 // Convert RGB to XYZ
xyzToRGB(xyz: Vec3): Vec3 // Convert XYZ to RGB
```

### CMYK (Print)
Color space for print applications.

```typescript
rgbToCMYK(rgb: Vec3): Vec4  // Convert RGB to CMYK
cmykToRGB(cmyk: Vec4): Vec3 // Convert CMYK to RGB
```

See [Color Space Conversion Examples](#color-space-conversion-examples) for detailed usage.

### Color Temperature
Color temperature calculations in Kelvin.

```typescript
kelvinToRGB(kelvin: number): Vec3                  // Convert temperature to RGB
estimateColorTemperature(rgb: Vec3): number | null // Estimate temperature
```

See [Temperature Manipulation Examples](#temperature-manipulation-examples) for detailed usage.

### Gamut Mapping

Functions for handling colors that cannot be displayed in the RGB color space.

#### Core Functions
- `isInGamut(color: Vec3): boolean`: Tests if color is within displayable range
- `clipToGamut(color: Vec3): Vec3`: Fast clipping to nearest valid color
- `compressToGamut(color: Vec3, preserveHue?: boolean): Vec3`: Smart compression maintaining relationships
- `projectToGamut(color: Vec3): Vec3`: Lightness-preserving projection

#### Usage Notes
- Choose based on requirements:
  - `clipToGamut` for performance-critical operations
  - `compressToGamut` for maintaining color relationships
  - `projectToGamut` for preserving perceived brightness
- Always test with `isInGamut` before expensive operations

See [Gamut Examples](#gamut-examples) for implementation patterns.

## Special Features

### Color Blindness Simulation

Tools for testing and optimizing colors for color vision deficiencies.

#### Simulation Functions
- `simulateColorBlindness(color: Vec3, type: ColorBlindnessType): Vec3`: Simulates how a color appears
- `isDistinguishableForColorBlindness(color1: Vec3, color2: Vec3, type: ColorBlindnessType): boolean`: Tests color distinction
- `optimizeForColorBlindness(colors: Vec3[]): Vec3[]`: Adjusts colors for better distinction
- `validateColorBlindnessSafety(colors: Vec3[]): ValidationResult`: Comprehensive palette validation

#### Supported Types
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (complete color blindness)

See [Color Blindness Examples](#color-blindness-examples) for optimization strategies.

### Cosine Gradient Generation

Functions for creating smooth, mathematically-generated color gradients using [cosine interpolation](https://iquilezles.org/articles/palettes/).

#### Core Functions
- `cosineGradient(t: number, a: Vec3, b: Vec3, c: Vec3, d: Vec3): Vec3`: Generates color using cosine interpolation
- `generateCosinePalette(steps: number, preset: CosineGradientPreset): Vec3[]`: Creates full gradient palette

#### Built-in Presets
- `COSINE_PRESET_RAINBOW`: Full spectrum gradient
- `COSINE_PRESET_FIRE`: Warm color gradient
- `COSINE_PRESET_ICE`: Cool color gradient

#### Parameters Explained

The cosine gradient function uses four Vec3 parameters to control the gradient:

```typescript
cosineGradient(
  t: number, // Position in gradient (0 to 1)
  a: Vec3,   // Center of oscillation
  b: Vec3,   // Amplitude
  c: Vec3,   // Frequency
  d: Vec3    // Phase
): Vec3
```

- `a`: Centers the oscillation (like an offset)
- `b`: Controls how far the colors swing from the center
- `c`: Controls how many times the pattern repeats
- `d`: Shifts the pattern along the gradient

See [Gradient Examples](#gradient-examples) for preset results and custom gradient creation.

## Usage Examples

### Color String Examples

#### Parsing Colors

```typescript
import { parseColor, parseHex, parseRGB, parseHSL } from '@fimbul-works/vec-color';

// Auto-detect format
const color1 = parseColor('#ff0000');
const color2 = parseColor('rgb(255, 0, 0)');
const color3 = parseColor('hsl(0, 100%, 50%)');

// Format-specific parsing
try {
  const hex = parseHex('#ff0000');         // From CSS
  const rgb = parseRGB('rgb(255,0,0)');    // From Canvas
  const hsl = parseHSL('hsl(0,100%,50%)'); // From color picker
} catch (error) {
  console.error('Invalid color format');
}
```

#### Formatting Colors

```typescript
import { Vec3 } from '@fimbul-works/vec';
import { colorToString } from '@fimbul-works/vec-color';

const color = new Vec3(1, 0, 0); // Red

// Different format outputs
const hex = colorToString(color, { format: 'hex' }); // "#ff0000"
const rgb = colorToString(color, { format: 'rgb' }); // "rgb(255, 0, 0)"
const hsl = colorToString(color, { format: 'hsl' }); // "hsl(0, 100%, 50%)"

// With alpha
const rgba = colorToString(color, { format: 'rgb', alpha: 0.5 }); // "rgba(255, 0, 0, 0.5)"
```

### Color Manipulation Examples

#### Color Adjustment Examples

##### Basic Adjustments

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  adjustBrightness,
  adjustSaturation,
  adjustContrast
} from '@fimbul-works/vec-color';

const color = new Vec3(0.8, 0.2, 0.2); // Bright red

// Single adjustments
const brighter = adjustBrightness(color, 0.2);   // 20% brighter
const moreVivid = adjustSaturation(color, 0.3);  // 30% more saturated
const highContrast = adjustContrast(color, 0.5); // 50% more contrast

// Chained adjustments
const adjusted = adjustContrast(
  adjustSaturation(
    adjustBrightness(color, 0.1),
    0.2
  ),
  0.15
);
```

#### Effects Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  tint,
  shade,
  tone,
  sepia,
  grayscale,
  invert
} from '@fimbul-works/vec-color';

// Base color
const blue = new Vec3(0.2, 0.4, 0.8);

// Basic effects
const tinted = tint(blue, 0.3);  // 30% lighter
const shaded = shade(blue, 0.3); // 30% darker
const toned = tone(blue, 0.3);   // 30% more muted

// Photo effects
const sepiaTone = sepia(blue, 0.8); // Strong sepia effect
const bw = grayscale(blue);         // Black and white
const negative = invert(blue);      // Color negative

// Creating a vintage effect
function vintageEffect(color: Vec3): Vec3 {
  // Apply multiple effects in sequence
  return sepia(
    tone(
      tint(color, 0.1), // Slightly lighter
      0.2               // Slightly muted
    ),
    0.5                 // Medium sepia
  );
}

// Creating an effect palette
function generateEffectPalette(color: Vec3) {
  return {
    original: color,
    light: tint(color, 0.3),
    dark: shade(color, 0.3),
    muted: tone(color, 0.5),
    vintage: vintageEffect(color),
    bw: grayscale(color)
  };
}
```

#### Alpha Channel Examples

```typescript
import { Vec3, Vec4 } from '@fimbul-works/vec';
import {
  withAlpha,
  toPremultipliedAlpha,
  fromPremultipliedAlpha,
  blendWithAlpha
} from '@fimbul-works/vec-color';

// Basic alpha handling
const red = new Vec3(1, 0, 0);
const transparentRed = withAlpha(red, 0.5); // 50% transparent
const opaqueRed = withAlpha(red);           // Fully opaque

// Premultiplied alpha operations
const premultiplied = toPremultipliedAlpha(red, 0.5);
const [color, alpha] = fromPremultipliedAlpha(premultiplied);

// Complex alpha blending
const background = withAlpha(new Vec3(1, 1, 1), 1);    // White
const foreground = withAlpha(new Vec3(0, 0, 1), 0.5);  // Semi-transparent blue
const result = blendWithAlpha(background, foreground);
```

#### Blend Mode Examples

##### Basic Blending

```typescript
import { Vec3, Vec4 } from '@fimbul-works/vec';
import {
  mix,
  blendMultiply,
  blendScreen,
  blendOverlay
} from '@fimbul-works/vec-color';

// RGB blending
const base = new Vec3(0.8, 0.2, 0.2);  // Red
const blend = new Vec3(0.2, 0.2, 0.8); // Blue

const mixed = mix(base, blend, 0.5);   // 50% mix
const multiplied = blendMultiply(base, blend);
const screened = blendScreen(base, blend);

// With alpha support
const baseA = new Vec4(0.8, 0.2, 0.2, 0.5);  // Semi-transparent red
const blendA = new Vec4(0.2, 0.2, 0.8, 0.8); // More opaque blue
const result = blendOverlay(baseA, blendA);  // Preserves alpha
```

#### Color Space Examples

#### Color Space Conversion Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  rgbToHSL,
  hslToRGB,
  rgbToLAB,
  rgbToXYZ,
  rgbToCMYK,
  kelvinToRGB
} from '@fimbul-works/vec-color';

// RGB to HSL conversion
const rgb = new Vec3(1, 0, 0); // Red
const hsl = rgbToHSL(rgb);     // { h: 0, s: 1, l: 0.5 }
const backToRGB = hslToRGB(hsl);

// Color matching with LAB
const lab = rgbToLAB(rgb);
const xyz = rgbToXYZ(rgb);

// Print preparation
const cmyk = rgbToCMYK(rgb); // { c: 0, m: 1, y: 1, k: 0 }

// Color temperature
const warmLight = kelvinToRGB(2700); // Warm incandescent
const daylight = kelvinToRGB(6500);  // Natural daylight
```

#### Temperature Manipulation Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
    kelvinToRGB,
    estimateColorTemperature,
    adjustTemperature
} from '@fimbul-works/vec-color';

// Create colors from temperature
const candlelight = kelvinToRGB(1900); // Warm/orange (~1900K)
const sunlight = kelvinToRGB(5500);    // Neutral daylight (~5500K)
const bluesky = kelvinToRGB(9000);     // Cool/blue (~9000K)

// Estimate color temperature
const color = new Vec3(1, 0.8, 0.6); // Warm color
const temp = estimateColorTemperature(color);
if (temp !== null) {
    console.log(`Color temperature: ${Math.round(temp)}K`);
}

// Adjust color temperature
const original = new Vec3(0.8, 0.8, 0.8); // Neutral gray

// Make warmer or cooler
const warmer = adjustTemperature(original, -2000); // Shift towards warm
const cooler = adjustTemperature(original, 2000);  // Shift towards cool

// Create a time-of-day sequence
const timeSequence = [
    adjustTemperature(original, -3000), // Dawn (warm)
    adjustTemperature(original, 2000),  // Midday (cool)
    adjustTemperature(original, -2500)  // Sunset (warm)
];
```

### Color Analysis Examples

#### Color Comparison Examples

##### Basic Color Similarity

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  calculateColorSimilarityFast,
  calculateColorSimilarityLab,
  colorDistanceMatrix
} from '@fimbul-works/vec-color';

// Fast comparison for real-time applications
function findSimilarColors(target: Vec3, colors: Vec3[]): Vec3[] {
  return colors
    .sort((a, b) =>
      calculateColorSimilarityFast(b, target) -
      calculateColorSimilarityFast(a, target)
    )
    .slice(0, 5); // Get top 5 similar colors
}

// Precise comparison for color matching
function isColorMatch(color1: Vec3, color2: Vec3, threshold = 0.95): boolean {
  return calculateColorSimilarityLab(color1, color2) > threshold;
}
```

##### Color Distance Matrix

```typescript
import { parseColor, colorDistanceMatrix } from '@fimbul-works/vec-color';

// Analyze a color palette
const palette = [
  parseColor('#ff0000'), // Red
  parseColor('#00ff00'), // Green
  parseColor('#0000ff'), // Blue
  parseColor('#ff0088'), // Pink
  parseColor('#ff8800')  // Orange
];

const distances = colorDistanceMatrix(palette);

// Find most similar pairs
const similarPairs = [];
for (let i = 0; i < distances.length; i++) {
  for (let j = i + 1; j < distances[i].length; j++) {
    if (distances[i][j] > 0.85) { // Similar colors
      similarPairs.push([i, j]);
    }
  }
}
```

#### Color Classification Examples

```typescript
import {
  classifyColor,
  sortColors,
  perceivedBrightness
} from '@fimbul-works/vec-color';

// Classify a color
const color = new Vec3(1, 0.5, 0);
const classification = classifyColor(color);
// Returns: { temperature: 'warm', intensity: 'vivid', category: 'orange' }

// Sort a palette by different attributes
const palette = [/* array of colors */];
const byHue = sortColors(palette, 'hue');
const byBrightness = sortColors(palette, 'lightness');
```

#### Accessibility Examples

##### WCAG Compliance Testing

```typescript
import {
  contrastRatio,
  meetsWCAGRequirements,
  getTextColor
} from '@fimbul-works/vec-color';

// Check color combination
const background = new Vec3(0.9, 0.9, 0.9);
const text = new Vec3(0.1, 0.1, 0.1);

const ratio = contrastRatio(text, background);
const isAACompliant = meetsWCAGRequirements(text, background, "AA");
const isAAACompliant = meetsWCAGRequirements(text, background, "AAA");

// Get accessible text color
const autoText = getTextColor(background);
```

#### Gamut Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  isInGamut,
  clipToGamut,
  compressToGamut,
  projectToGamut,
  rgbToLAB,
  labToRGB
} from '@fimbul-works/vec-color';

// Check if color is displayable
const labColor = rgbToLAB(new Vec3(1, 0, 0));
const outOfGamut = labToRGB(labColor);
if (!isInGamut(outOfGamut)) {
  // Choose appropriate mapping strategy
  const clipped = clipToGamut(outOfGamut);        // Fast
  const compressed = compressToGamut(outOfGamut); // Preserves relationships
  const projected = projectToGamut(outOfGamut);   // Preserves brightness
}

// Batch processing with gamut mapping
function processColors(colors: Vec3[]): Vec3[] {
  return colors.map(color =>
    isInGamut(color) ? color : clipToGamut(color)
  );
}
```

#### Dominant Color Detection Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
    findDominantColors,
    colorToString,
    getTextColor
} from '@fimbul-works/vec-color';

// Sample image colors
const imageColors = [
    new Vec3(0.8, 0.2, 0.2), // Red
    new Vec3(0.8, 0.3, 0.2), // Similar red
    new Vec3(0.2, 0.7, 0.3), // Green
    new Vec3(0.2, 0.2, 0.8), // Blue
    new Vec3(0.9, 0.9, 0.9), // White
    new Vec3(0.1, 0.1, 0.1), // Black
    // ... more colors from image
];

// Find dominant colors
const dominantColors = findDominantColors(imageColors, 5);

// Create color palette information
const palette = dominantColors.map(color => ({
    color: color,
    hex: colorToString(color, { format: 'hex' }),
    textColor: getTextColor(color),
    frequency: imageColors.filter(c =>
        // Simple similarity check for frequency
        Math.abs(c.x - color.x) < 0.1 &&
        Math.abs(c.y - color.y) < 0.1 &&
        Math.abs(c.z - color.z) < 0.1
    ).length / imageColors.length
}));

// Sort by frequency
palette.sort((a, b) => b.frequency - a.frequency);

// Generate theme colors
const theme = {
    primary: palette[0].color,
    secondary: palette[1].color,
    accent: palette[2].color,
    background: palette.find(p => p.frequency > 0.1 &&
        relativeLuminance(p.color) > 0.8)?.color ?? new Vec3(1, 1, 1),
    text: palette.find(p => p.frequency > 0.1 &&
        relativeLuminance(p.color) < 0.2)?.color ?? new Vec3(0, 0, 0)
};
```

#### Debug Tools Examples

##### Color Inspection

```typescript
import { debugColor, validateColorSpace } from '@fimbul-works/vec-color';

// Get comprehensive color information
const debug = debugColor(new Vec3(1, 0, 0));
console.log(debug.original.hex);    // "#ff0000"
console.log(debug.characteristics); // Temperature, classification, etc.
console.log(debug.accessibility);   // Contrast ratios, WCAG compliance

// Validate color values
const validation = validateColorSpace(color, "RGB");
if (!validation.valid) {
  console.warn(validation.issues);
}
```

### Palette Generation Examples

#### Color Scheme Examples

```typescript
import {
  complement,
  analogous,
  triadic,
  splitComplementary
} from '@fimbul-works/vec-color';

const baseColor = new Vec3(0.2, 0.5, 0.8);

// Generate different schemes
const complementary = complement(baseColor);
const analogousColors = analogous(baseColor);      // [base, +30°, -30°]
const triadicColors = triadic(baseColor);          // [base, +120°, +240°]
const splitColors = splitComplementary(baseColor); // [base, +150°, -150°]
```

#### Color Harmonization Examples

```typescript
import { Vec3 } from '@fimbul-works/vec';
import {
  harmonizeColor,
  harmonizePalette,
  parseColor
} from '@fimbul-works/vec-color';

// Harmonize single color with reference
const reference = parseColor('#0066cc'); // Base blue
const color = parseColor('#ff9900');     // Orange

const harmonized = harmonizeColor(color, reference);

// Harmonize entire palette
const palette = [
  parseColor('#0066cc'), // Base blue
  parseColor('#ff9900'), // Orange
  parseColor('#66cc33'), // Green
  parseColor('#cc3366')  // Pink
];

// Create accessible, harmonious palette
const harmonizedPalette = harmonizePalette(palette, 'AA');

// Check results meet accessibility requirements
const results = harmonizedPalette.map(color => ({
  original: colorToString(color, { format: 'hex' }),
  wcagAA: meetsWCAGRequirements(color, reference, 'AA'),
  harmonic: true  // All colors are now harmonized
}));
```

#### Gradient Examples

```typescript
import {
  cosineGradient,
  generateCosinePalette,
  COSINE_PRESET_RAINBOW
} from '@fimbul-works/vec-color';

// Generate single color
const t = 0.5; // Position in gradient (0-1)
const color = cosineGradient(t,
  COSINE_PRESET_RAINBOW.a,
  COSINE_PRESET_RAINBOW.b,
  COSINE_PRESET_RAINBOW.c,
  COSINE_PRESET_RAINBOW.d
);

// Generate full palette
const palette = generateCosinePalette(10, COSINE_PRESET_RAINBOW);
```

## Optimization & Best Practices

### Performance Tips

1. Batch conversions when possible:

```typescript
// Good
const hsl = rgbToHSL(color);
const adjusted1 = adjustHue(hsl, 30);
const adjusted2 = adjustSaturation(hsl, 0.2);

// Bad
const adjusted1 = adjustHue(rgbToHSL(color), 30);
const adjusted2 = adjustSaturation(rgbToHSL(color), 0.2);
```

2. Use FastSimilarity for arrays/realtime:

```typescript
// For large arrays or realtime
colors.sort((a, b) =>
  calculateColorSimilarityFast(a, reference) -
  calculateColorSimilarityFast(b, reference)
);
```

### Color Blindness Examples

```typescript
import {
  simulateColorBlindness,
  optimizeForColorBlindness
} from '@fimbul-works/vec-color';

// Simulate appearance
const protanopiaView = simulateColorBlindness(color, 'protanopia');
const deuteranopiaView = simulateColorBlindness(color, 'deuteranopia');

// Optimize a palette
const palette = [/* array of colors */];
const optimizedPalette = optimizeForColorBlindness(palette);

// Validate optimization
const validation = validateColorBlindnessSafety(optimizedPalette);
if (!validation.safe) {
  console.log('Problem areas:', validation.issues);
}
```

### Error Handling

Common error scenarios and how to handle them:

```typescript
try {
  // Invalid hex color
  const color = parseHex('#XYZ');
} catch (error) {
  console.error('Invalid color format');
}

// Handling out-of-gamut colors
function ensureValidRGB(color: Vec3): Vec3 {
  return new Vec3(
    Math.min(1, Math.max(0, color.x)),
    Math.min(1, Math.max(0, color.y)),
    Math.min(1, Math.max(0, color.z))
  );
}

// Handling undefined color transformations
function safeHueRotation(color: Vec3, degrees: number): Vec3 {
  const hsl = rgbToHSL(color);
  // Only rotate hue if the color has saturation
  if (hsl.y === 0) return color;
  return rotateHue(color, degrees);
}
```

### Edge Cases

Important edge cases to consider:

1. Grayscale Colors
```typescript
// Special handling for grayscale colors where hue is undefined
function adjustGrayscale(color: Vec3): void {
  const hsl = rgbToHSL(color);
  if (hsl.y === 0) {
    // Handle grayscale case
    return adjustBrightness(color, amount);
  }
}
```

2. Extreme Values
```typescript
// Handle extreme color values
function safeColorAdjustment(color: Vec3, amount: number): Vec3 {
  // Prevent division by zero in color math
  const epsilon = 0.000001;
  const safeColor = new Vec3(
    Math.max(epsilon, color.x),
    Math.max(epsilon, color.y),
    Math.max(epsilon, color.z)
  );
  return adjustColor(safeColor, amount);
}
```

3. Alpha Channel Edge Cases
```typescript
// Handle alpha channel edge cases
function safeAlphaBlend(color: Vec4, background: Vec4): Vec4 {
  if (color.w === 0) return background;
  if (color.w === 1) return color;
  if (background.w === 0) return color;
  return blendWithAlpha(color, background);
}
```

4. Color Temperature Edge Cases
```typescript
// Handle color temperature edge cases
function safeTemperatureAdjustment(color: Vec3, tempChange: number): Vec3 {
  const currentTemp = estimateColorTemperature(color);
  if (currentTemp === null) {
    // Handle colors that don't map to a temperature
    return color;
  }
  return adjustTemperature(color, tempChange);
}
```
