import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { FunctionComponent, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface DragNDropProps {
  parentOnDrop: Function;
  imageUrl?: string;
}

const DragNDrop: FunctionComponent<DragNDropProps> = ({
  parentOnDrop,
  imageUrl,
}) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    parentOnDrop(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="flex flex-col gap-5">
      <input {...getInputProps()} />
      {
        <div
          className={` border-2 border-input bg-background/50
                w-full aspect-square rounded-3xl
                bg-cover bg-center
                hover:cursor-pointer relative overflow-hidden
                flex flex-col justify-center items-center
                `}
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {!imageUrl && !isDragActive && (
            <>
              <h1 className="text-center text-2xl">{"Upload Image"}</h1>
              <Upload size={30} />
            </>
          )}

          {isDragActive && (
            <>
              <div
                className={`absolute w-full h-full 
                        blur-3xl bg-gradient-to-r from-cyan-500 to-blue-500`}
                style={{ backgroundImage: `url(${imageUrl})` }}
              >
                {imageUrl ? "" : "Drop To Upload"}
              </div>

              <div className="absolute w-full h-full flex justify-center items-center">
                Drop To Upload
              </div>
            </>
          )}
        </div>
      }

      <Button className="w-full">preview</Button>
    </div>
  );
};

export default DragNDrop;
