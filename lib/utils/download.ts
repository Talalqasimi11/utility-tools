/**
 * Triggers a file download from a Blob.
 * Creates a temporary object URL, clicks a hidden link, then revokes the URL.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // Revoke after a short delay to ensure the download starts
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
