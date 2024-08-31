import { useState } from "react";
import { ImageFile } from "../../fake-apis";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  images: ImageFile[];
}

async function urlToFile(url: string, filename: string, mimeType: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], filename, { type: mimeType });
}

async function urlToPngBlob(url: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to create blob"));
        }
      }, "image/png");
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = url;
  });
}

const ShareButton: React.FC<Props> = ({ children, images, ...rest }) => {
  const [isSharing, setIsSharing] = useState(false);
  const handleShare = async () => {
    if (navigator.share && !(/Firefox/.test(navigator.userAgent))) {
      try {
        setIsSharing(true);
        const files = await Promise.all(
          images.map(({ url }, index) =>
            urlToFile(url, `image${index + 1}.jpg`, "image/jpeg")
          )
        );
        await navigator.share({
          files: files,
          title: "Shared Images",
          text: "Check out these images!",
        });
      } catch (error) {
        console.error("Failed to share images:", error);
        alert(error);
      } finally {
        setIsSharing(false);
      }
    } else {
      try {
        setIsSharing(true);
        if (images.length === 1) {
          const pngBlob = await urlToPngBlob(images[0].url);
          await navigator.clipboard.write([
            new ClipboardItem({
              "image/png": pngBlob,
            }),
          ]);
          alert("Image converted to PNG and copied to clipboard");
        } else {
          const imageLinks = images.map(({ url }) => url).join('\n');
          await navigator.clipboard.writeText(imageLinks);
          alert("Image links copied to clipboard");
        }
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        alert("Failed to copy to clipboard");
      } finally {
        setIsSharing(false);
      }
    }
  };

  return (
    <button className="text-blue-500" {...rest} onClick={handleShare}>
      {isSharing ? "Sharing..." : children}
    </button>
  );
};

export default ShareButton;
