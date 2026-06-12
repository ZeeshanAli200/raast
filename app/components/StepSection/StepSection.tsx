import Image from 'next/image';
import './styles.css';
import { SlideType } from '@/lib/types';

const StepSection = ({
  slides,
}: {
  slides: { description: string; stepImage: string; step: number }[];
}) => {
  return (
    <div
      className={
        'mx-auto mt-6 ' +
        `${slides.length > 3 ? 'w-full tablet:w-full' : slides.length <= 2 ? 'w-full tablet:w-1/2' : 'w-full tablet:w-10/12'}`
      }
    >
      {/* ROW 1: STEPS */}
      <div className="flex relative ">
        {(slides.length ? slides : (Array.from({ length: 3 }) as SlideType[]))?.map(
          (_: SlideType, ind) => {
            const count = `0${ind + 1}`;
            const firstElementClass = 'right-0 top-8 w-1/2';
            const lastElementClass = 'left-0 top-8 w-1/2';
            const full = 'w-full top-8';
            const className =
              slides.length == 1
                ? ''
                : ind == 0
                  ? firstElementClass
                  : slides.length - 1 == ind
                    ? lastElementClass
                    : full;
            return (
              <div className="w-full flex flex-col relative " key={ind}>
                <div className={'absolute h-px bg-gray-300 z-0 ' + className} />
                <div className="flex justify-center ">
                  {/* Circle */}
                  <div className="z-10 w-14 h-14 bg-white flex flex-col items-center justify-center rounded-full border border-gray-300">
                    <span className="text-warm tablet:text-grey font-int uppercase text-[9px] font-semibold tracking-wider">
                      Step
                    </span>
                    <span className="text-xl font-bold leading-none text-blackish">{count}</span>
                  </div>
                </div>
                <h2 className="flex-1  text-base text-center text-blackish font-medium">
                  {_?.description ?? ''}
                </h2>
                <div className="pt-4 screenshot aspect-auto px-4">
                  <div className="bezel p-1 xl:p-1.5 before:w-1/3 before:h-2.5 lg:before:w-1/3 lg:before:h-4 xl:before:w-1/2 xl:before:h-6">
                    <div className="screen">
                      {_?.stepImage && <Image priority fill alt="easy paisa" src={_?.stepImage} />}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default StepSection;
