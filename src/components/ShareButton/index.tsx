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

async function urlToClipboardItem(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new ClipboardItem({ [blob.type]: blob });
}

const ShareButton: React.FC<Props> = ({ children, images, ...rest }) => {
  const handleShare = async () => {
    if (navigator.share) {
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
    } else {
      const urls = images.map(({ url }) => url).join("\n");
      navigator.clipboard.writeText(urls);
      // const clipboardItems = await Promise.all(
      //   images.map(({ url }) => urlToClipboardItem(url))
      // );
      // await navigator.clipboard.write(clipboardItems);
      alert("Images copied to clipboard");
    }
  };

  return (
    <button className="text-blue-500" {...rest} onClick={handleShare}>
      {children}
    </button>
  );
};

export default ShareButton;
