import { ErrorCode, type ProcessingError } from "@/types/pdf";

export interface ValidationOptions {
  maxSizeMB?: number;
  maxTotalSizeMB?: number;
  maxFiles?: number;
  minFiles?: number;
  allowedTypes?: string[];
}

async function verifyMagicBytes(file: File, allowedTypes: string[]): Promise<boolean> {
  if (allowedTypes.length === 0) return true;
  
  const buffer = await file.slice(0, 4).arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');

  for (const type of allowedTypes) {
    if (type === "application/pdf" && hex.startsWith("25 50 44 46")) return true;
    if ((type === "image/jpeg" || type === "image/jpg") && hex.startsWith("FF D8 FF")) return true;
    if (type === "image/png" && hex.startsWith("89 50 4E 47")) return true;
  }
  
  return false;
}

/**
 * Validates an array of files against the provided constraints.
 * Returns a ProcessingError if validation fails, or null if all files pass.
 */
export async function validateFiles(
  files: File[],
  options: ValidationOptions = {},
): Promise<ProcessingError | null> {
  const {
    maxSizeMB = 50,
    maxTotalSizeMB = 100,
    maxFiles = 20,
    minFiles = 1,
    allowedTypes = ["application/pdf"],
  } = options;

  if (files.length < minFiles) {
    return {
      code: ErrorCode.TOO_FEW_FILES,
      message:
        minFiles === 1
          ? "Please select a file."
          : `Please select at least ${minFiles} files.`,
    };
  }

  if (files.length > maxFiles) {
    return {
      code: ErrorCode.FILE_TOO_LARGE,
      message: `You can select up to ${maxFiles} files at a time.`,
    };
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  const maxTotalBytes = maxTotalSizeMB * 1024 * 1024;
  let totalBytes = 0;

  for (const file of files) {
    totalBytes += file.size;

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        code: ErrorCode.UNSUPPORTED_FORMAT,
        message: `"${file.name}" is not a supported file type.`,
      };
    }

    if (file.size > maxBytes) {
      return {
        code: ErrorCode.FILE_TOO_LARGE,
        message: `"${file.name}" exceeds the ${maxSizeMB} MB size limit.`,
      };
    }

    const isValidMagic = await verifyMagicBytes(file, allowedTypes);
    if (!isValidMagic) {
      return {
        code: ErrorCode.UNSUPPORTED_FORMAT,
        message: `"${file.name}" appears to be spoofed or corrupted.`,
      };
    }
  }

  if (totalBytes > maxTotalBytes) {
    return {
      code: ErrorCode.FILE_TOO_LARGE,
      message: `The total size of selected files exceeds the ${maxTotalSizeMB} MB limit.`,
    };
  }

  return null;
}
