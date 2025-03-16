import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  return (
    <div className="w-full border rounded-lg shadow-md overflow-hidden relative">
      <Swiper navigation className="w-full">
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <Image
              src={img}
              alt="Product Image"
              width={500}
              height={500}
              className="w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
