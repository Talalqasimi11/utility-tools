export enum ErrorCode {
  INVALID_FILE = "INVALID_FILE",
  UNSUPPORTED_FORMAT = "UNSUPPORTED_FORMAT",
  FILE_TOO_LARGE = "FILE_TOO_LARGE",
  PASSWORD_PROTECTED = "PASSWORD_PROTECTED",
  CORRUPTED_FILE = "CORRUPTED_FILE",
  INVALID_PAGE_RANGE = "INVALID_PAGE_RANGE",
  PROCESSING_FAILED = "PROCESSING_FAILED",
  MEMORY_LIMIT = "MEMORY_LIMIT",
  TOO_FEW_FILES = "TOO_FEW_FILES",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export interface ProcessingError {
  code: ErrorCode;
  message: string;
}

export interface ProcessingResult<T = Blob> {
  success: boolean;
  data?: T;
  error?: ProcessingError;
  metadata?: {
    originalSize?: number;
    outputSize?: number;
    pageCount?: number;
    fileCount?: number;
  };
}
