'use client';
import { useState } from 'react';
import EmblaCarousel from '../EmblaCarousel/EmblaCarousel';

const StepsCarousel = ({
  slides = [],
}: {
  slides: { description: string; stepImage: string; step: number }[];
}) => {
  const [selectedSnap, setSelectedSnap] = useState<number>(0);
  const progress = ((selectedSnap + 1) / slides.length) * 100;
  return (
    <div className="grid grid-cols-2">
      {/* progress bar */}
      <div className="col-span-2 flex items-center gap-10">
        <p className="pr-2 text-xs font-int text-grey uppercase min-w-fit">
          <span className="font-bold text-blackish">{selectedSnap + 1}</span> of {slides.length}
        </p>
        <div className=" w-full overflow-hidden h-1 text-xs flex rounded bg-gray-200">
          <div
            style={{ width: `${progress}%` }}
            className="shadow-none transition-all duration-200 flex flex-col text-center whitespace-nowrap text-white justify-center  bg-button-primary"
          ></div>
        </div>
      </div>
      <div className="col-span-2 mt-8">
        <EmblaCarousel setSelectedSnap={setSelectedSnap} slides={slides} />
      </div>
    </div>
  );
};
export default StepsCarousel;
