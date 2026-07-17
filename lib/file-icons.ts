import {
  File,
  FileText,
  ImageIcon,
  FileArchive,
  FileSpreadsheet,
  Presentation,
  Video,
} from "lucide-react";

export function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return ImageIcon;

    case "pdf":
      return FileText;

    case "spreadsheet":
      return FileSpreadsheet;

    case "presentation":
      return Presentation;

    case "archive":
      return FileArchive;

    case "video":
      return Video;

    default:
      return File;
  }
}
