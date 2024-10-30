"use client";

import { Download, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Image from "next/image";
import { getImageTitle } from "@/utils/helpers/text-modifier";

interface IDownloadButtonProps {
  fileUrl: string;
  fileName: string;
}

export default function DownloadButton({
  fileUrl,
  fileName,
}: IDownloadButtonProps) {
  const [image, setImage] = useState<Blob>();

  useEffect(() => {
    fetch(fileUrl).then((response) => {
      response.blob().then((blob) => {
        setImage(blob);
      });
    });
  }, [fileUrl]);

  async function handleDownload() {
    try {
      if (image) {
        const url = window.URL.createObjectURL(image);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to download file", {
        description:
          "An error occurred while trying to download the file, please try again later",
        duration: 5000,
        style: {
          backgroundColor: "#FEEFEE",
          color: "#D8000C",
        },
      });
    }
  }

  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <div className="flex items-center gap-2">
        <ImageIcon size={20} className="text-muted-foreground" />
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <p className="text-sm font-medium">{getImageTitle(fileName)}</p>
              </TooltipTrigger>
              <TooltipContent>
                <Image
                  src={fileUrl}
                  width={200}
                  height={400}
                  alt={fileName}
                  objectFit="contain"
                />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <p className="text-xs text-muted-foreground">
            {image?.type.split("/")[1].toUpperCase()} •{" "}
            {image
              ? `${(image.size / (1024 * 1024)).toPrecision(2)} MB`
              : `0 Bytes`}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={handleDownload}
      >
        <Download className="h-4 w-4" />
        <span className="sr-only">Download {fileName}</span>
      </Button>
    </div>
  );
}
