import { ImageLoader } from "next/image";

const loader: ImageLoader = ({ src, width, quality }) => {
  return `https://images.unsplash.com/photo-${src}?w=${width}&q=${
    quality || 80
  }`;
};

export default loader;
