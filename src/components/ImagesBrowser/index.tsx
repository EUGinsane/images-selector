import { useState } from "react";
import {
  fakeDeleteImageAsyncWithRandomError,
  fakeFetchImages,
  fakeUploadImageAsync,
} from "../../fake-apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import ImageItem from "./ImageItem";
import ShareButton from "../ShareButton";

const ImagesBrowser = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["fetch-images"],
    queryFn: fakeFetchImages,
  });

  const { mutateAsync: deleteImages, isPending } = useMutation({
    mutationFn: () =>
      Promise.allSettled(
        selectedImages.map(fakeDeleteImageAsyncWithRandomError)
      ),
    onSuccess(result) {
      refetch();
      setSelectedImages((prev) =>
        prev.filter((_, index) => result[index].status === "rejected")
      );

      if (result.some(({ status }) => status === "rejected")) {
        alert(
          `Some images failed to delete: ${result
            .map(({ status }, index) =>
              status === "rejected" ? `\n${selectedImages[index]}` : ""
            )
            .join("")}`
        );
      } else {
        alert("Images deleted successfully");
      }
    },
  });

  const { mutateAsync: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (count: number) =>
      Promise.all(Array(count).fill(null).map(fakeUploadImageAsync)),
    onSuccess() {
      refetch();
      alert("Images uploaded");
    },
  });

  return (
    <section className="max-w-[700px] h-screen bg-white flex flex-col">
      <div className="flex-1 bg-yellow-100 overflow-auto">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ul className="grid grid-cols-3 gap-1">
            {data?.map((image) => {
              const isSelected = selectedImages.includes(image.id);
              return (
                <li key={image.id}>
                  <ImageItem
                    selected={isSelected}
                    src={image}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedImages((ids) =>
                          ids.filter((id) => id !== image.id)
                        );
                      } else {
                        setSelectedImages((ids) => [...ids, image.id]);
                      }
                    }}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <footer className="p-4 flex justify-between border-t">
        {selectedImages.length > 0 ? (
          <>
            <p>{selectedImages.length} images selected</p>
            <div className="flex gap-4">
              <button
                disabled={isPending}
                className="text-red-500"
                onClick={() => {
                  const canDelete = window.confirm(
                    "Are you sure to delete these images?"
                  );

                  if (canDelete) deleteImages();
                }}
              >
                {isPending ? "Deleting..." : "Delete"}
              </button>

              <ShareButton
                images={
                  data?.filter(({ id }) => selectedImages.includes(id)) ?? []
                }
                disabled={isPending}
              >
                Share
              </ShareButton>
            </div>
          </>
        ) : (
          <>
            <button disabled={isUploading} onClick={() => uploadImage(10)}>
              {isUploading ? "uploading..." : "Upload"}
            </button>
            <p>Total {data?.length ?? 0} images</p>
          </>
        )}
      </footer>
    </section>
  );
};

export default ImagesBrowser;
