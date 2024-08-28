import { ImageFile } from "../../fake-apis";

interface Props {
  selected?: boolean;
  src: ImageFile;
  onClick: () => void;
}

const ImageItem: React.FC<Props> = ({ src, selected, onClick }) => {
  return (
    <div
      role="button"
      className={`w-full aspect-square cursor-pointer overflow-hidden transform transition-all ${
        selected ? "border-[10px] border-blue-500" : ""
      }`}
      onClick={onClick}
    >
      <img
        src={src.url}
        className="w-full h-full object-cover transform transition-all hover:scale-125"
        loading="lazy"
      />
    </div>
  );
};

export default ImageItem;
