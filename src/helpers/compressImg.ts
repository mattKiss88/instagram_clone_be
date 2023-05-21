import sharp from "sharp";
import { promises as fs } from "fs";

export const compressImage = async (
  srcPath: string,
  outputPath: string,
  width: number,
  quality: number
): Promise<void> => {
  try {
    await sharp(srcPath)
      .resize(width)
      .jpeg({ quality: quality })
      .toFile(outputPath);
    console.log("Image compression successful");
  } catch (err) {
    console.error("Error compressing image:", err);
  }
};

// Usage
