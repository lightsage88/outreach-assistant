
import fileTypeChecker from "file-type-checker";

import {
  validateAttachment,
  type AttachmentKind,
} from "./validateAttachment";

export async function validateUploadedAttachment(
  file: File,
  kind: AttachmentKind
): Promise<string | null> {
  // Check filename, declared MIME type and file size.
  const metadataError = validateAttachment(file, kind);

  if (metadataError) {
    return metadataError;
  }

  // Read only the beginning of the file.
  const bytes = new Uint8Array(
    await file.slice(0, 64).arrayBuffer()
  );

  // Let the library identify the file signature.
  const detected = fileTypeChecker.detectFile(bytes);

  // Normalize aliases such as .jpg -> jpeg.
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  const expectedExtension =
    extension === "jpg" ? "jpeg" : extension;

  // Confirm actual content matches the filename
  // and any MIME type declared by the browser.
  const matches =
    detected?.extension === expectedExtension &&
    (file.type === "" ||
      detected.mimeType === file.type);

  return matches
    ? null
    : "File contents do not match the expected format.";
}
