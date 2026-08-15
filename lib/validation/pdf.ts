import { ErrorCode, type ProcessingError } from "@/types/pdf";

export interface ValidationOptions {
  maxSizeMB?: number;
  maxFiles?: number;
  minFiles?: number;
  allowedTypes?: string[];
}

/**
 * Validates an array of files against the provided constraints.
 * Returns a ProcessingError if validation fails, or null if all files pass.
 */
export function validateFiles(
  files: File[],
  options: ValidationOptions = {},
): ProcessingError | null {
  const {
    maxSizeMB = 50,
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

  for (const file of files) {
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
  }

  return null;
}
