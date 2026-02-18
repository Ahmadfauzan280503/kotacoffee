import { ChangeEvent, useEffect, useId, useRef } from "react";
import Image from "next/image";
import { BsUpload } from "react-icons/bs";
import { Button, Spinner } from "@heroui/react";
import { FiTrash } from "react-icons/fi";

import cn from "@/utils/cn";

interface PropTypes {
  className?: string;
  name: string;
  isDroppable?: boolean;
  onUpload?: (files: FileList) => void;
  onDelete?: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
  preview?: string;
}

const InputFile = (props: PropTypes) => {
  const {
    className,
    name,
    isDroppable = false,
    onUpload,
    onDelete,
    preview,
    isUploading,
    isDeleting,
  } = props;

  const drop = useRef<HTMLLabelElement>(null);
  const dropzoneId = useId();

  const handleDragOver = (e: DragEvent) => {
    if (isDroppable) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;

    if (files && onUpload) {
      onUpload(files);
    }
  };

  useEffect(() => {
    const dropCurrent = drop.current;

    if (dropCurrent) {
      dropCurrent.addEventListener("dragover", handleDragOver);
      dropCurrent.addEventListener("drop", handleDrop);

      return () => {
        dropCurrent.removeEventListener("dragover", handleDragOver);
        dropCurrent.removeEventListener("drop", handleDrop);
      };
    }
  }, []);

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;

    if (files && onUpload) {
      onUpload(files);
    }
  };

  return (
    <label
      ref={drop}
      className={cn(
        "flex min-h-32 w-full cursor-pointer flex-col rounded-md border-2 border-dashed border-gray-400 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700",
        className,
      )}
      htmlFor={`file-dropzone-${dropzoneId}`}
    >
      {preview ? (
        <div className="flex flex-col items-center justify-center p-4 relative">
          <div className="mb-2 w-1/2 relative">
            {/* Delete Button */}
            <Button
              isIconOnly
              className="absolute top-2 right-2 z-50"
              color="danger"
              disabled={isDeleting}
              isLoading={isDeleting}
              onPress={onDelete}
            >
              <FiTrash />
            </Button>
            {preview ? (
              <Image
                fill
                alt="image"
                className="!relative rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={preview}
              />
            ) : null}
          </div>
          <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-200">
            {preview.split("/").pop()}
          </p>
        </div>
      ) : (
        !preview && (
          <div className="m-auto flex w-1/2 flex-col items-center justify-center gap-2">
            {isUploading ? (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-200">
                  Uploading...
                </p>
              </div>
            ) : (
              <>
                <BsUpload
                  className="text-gray-500 dark:text-gray-200"
                  size={32}
                />
                <p className="text-center text-sm font-semibold text-gray-500 dark:text-gray-200">
                  {isDroppable
                    ? "Drag and drop or click here to upload image"
                    : "Click here to upload image"}
                </p>
              </>
            )}
          </div>
        )
      )}

      <input
        accept="image/*"
        className="hidden"
        disabled={preview !== "" || isUploading}
        id={`file-dropzone-${dropzoneId}`}
        name={name}
        type="file"
        onChange={handleOnUpload}
        onClick={(e) => {
          e.currentTarget.value = "";
          e.target.dispatchEvent(new Event("change", { bubbles: true }));
        }}
      />
    </label>
  );
};

export default InputFile;
