
export type AttachmentKind = "resume" | "headshot";

type FileMetadata = Pick<File, "name" | "size" | "type">;

const MB = 1024 * 1024;

const rules = {
  resume: {
    extensions: [".pdf"],
    mimeTypes: ["application/pdf"],
    maxBytes: 5 * MB,
    label: "Résumé",
  },
  headshot: {
    extensions: [".jpg", ".jpeg", ".png"],
    mimeTypes: ["image/jpeg", "image/png"],
    maxBytes: 5 * MB,
    label: "Headshot",
  },
};

export function validateAttachment(
  file: FileMetadata,
  kind: AttachmentKind
): string | null {
  const rule = rules[kind];

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  const validExtension = rule.extensions.includes(extension);
  const validMimeType =
    file.type === "" || rule.mimeTypes.includes(file.type);

  if (!validExtension || !validMimeType) {
    return `${rule.label} has an unsupported file format.`;
  }

  if (file.size === 0) {
    return `${rule.label} cannot be empty.`;
  }

  if (file.size > rule.maxBytes) {
    return `${rule.label} must be 5 MB or smaller.`;
  }

  return null;
}
