'use client';
import React, { useEffect, useCallback, useState, Dispatch, SetStateAction } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Image from 'next/image';
import { SlideType } from '@/lib/types';

type Props = {
  slides: SlideType[];
  setSelectedSnap: Dispatch<SetStateAction<number>>;
};

const TWEEN_FACTOR = 0.6;

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const EmblaCarousel: React.FC<Props> = ({ slides, setSelectedSnap }: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    loop: false,
  });
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateScale = useCallback(() => {
    if (!emblaApi) return;

    const scrollProgress = emblaApi.scrollProgress();
    const snapList = emblaApi.scrollSnapList();
    const slideNodes = emblaApi.slideNodes();

    snapList.forEach((snap, index) => {
      const diff = snap - scrollProgress;

      const scale = clamp(1 - Math.abs(diff * slides.length * TWEEN_FACTOR), 0.95, 1.2);

      const slide = slideNodes[index];
      if (!slide) return;

      slide.style.transform = `scale(${scale})`;
      slide.style.zIndex = `${Math.round(scale * 100)}`;
    });
  }, [emblaApi, slides.length]);

  useEffect(() => {
    if (!emblaApi) return;

    updateScale();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') emblaApi.scrollPrev();
      if (event.code === 'ArrowRight') emblaApi.scrollNext();
    };
    const handleScroll = () => {
      setSelectedSnap(emblaApi.selectedScrollSnap());
      setCurrentSlide(emblaApi.selectedScrollSnap());
      updateScale();
    };

    emblaApi.on('reInit', updateScale);
    emblaApi.on('select', updateScale);
    emblaApi.on('scroll', handleScroll); // 🔥 smooth scaling while dragging

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      emblaApi.off('scroll', handleScroll);
      emblaApi.off('select', updateScale);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [emblaApi, updateScale]);
  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {(slides.length ? slides : (Array.from({ length: 3 }) as SlideType[])).map((_, index) => {
            const count = `0${index + 1}`;

            return (
              <div
                onClick={() => emblaApi?.scrollTo(index + 1)}
                key={index}
                className=" flex-[0_0_105%] xsmall:flex-[0_0_75%] sm:flex-[0_0_85%] md:flex-[0_0_60%] tablet:flex-1 px-4"
              >
                <div className="p-4 rounded-3xl bg-white border border-gray-300">
                  <div className="p-3 flex gap-x-1">
                    <span className="text-blackish bg-light-blue font-semibold w-6 h-6 justify-center flex items-center text-xs p-2 rounded-full te">
                      {count}
                    </span>
                    <h2 className="font-int flex-1 text-base text-blackish font-medium">
                      {_?.description ?? ''}
                    </h2>
                  </div>
                  <div className="p-2 rounded-[40px] bg-black">
                    <div className="relative aspect-9/16 rounded-4xl overflow-hidden">
                      <div className="w-1/3 h-10 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black z-1 rounded-b-2xl top-0 absolute"></div>
                      {_?.stepImage && (
                        <Image
                          priority
                          src={_.stepImage}
                          alt="easy paisa"
                          fill
                          className="object-center"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex mt-2 items-center justify-between">
        <div
          className="bg-white border rounded-full flex justify-center items-center w-10 h-10 border-gray-200"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <svg
            className={
              'w-6 h-6 rotate-180 text-blackish ' + `${currentSlide == 0 ? 'opacity-25' : ''}`
            }
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </div>

        <p className="text-grey font-int text-xs">
          Step {currentSlide + 1} of {slides.length} · Swipe or tap
        </p>
        <div
          className="bg-white border rounded-full flex justify-center items-center w-10 h-10 border-gray-200"
          onClick={() => emblaApi?.scrollNext()}
        >
          <svg
            className={
              'w-6 h-6 text-blackish ' + `${currentSlide == slides.length - 1 ? 'opacity-25' : ''}`
            }
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M9 6l6 6-6 6"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;
