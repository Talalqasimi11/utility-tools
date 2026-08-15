export type UploadStatus = "idle" | "dragging" | "validating" | "ready" | "error";

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}
