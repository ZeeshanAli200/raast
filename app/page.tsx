import { PaymentHeader } from './components/PaymentHeader/Payment-Header';
import { PaymentFooter } from './components/PaymentFooter/PaymentFooter';
import StepSection from './components/StepSection/StepSection';
import StepsCarousel from './components/StepsCarousel/StepsCarousel';
import { getSecretKey } from '@/lib/server/utils';
import NotFoundComponent from './components/NotFound/NotFound';
import { BankConfig, SlideType } from '@/lib/types';

export default async function Home() {
  // Fething and decoding the data param from the URL

  // decoding the data param from the URL
  const operatorResponse: BankConfig = {
    deepLinkUrl: 'https://jazzcash.page.link/XdUx',
    redirectUrl: 'https://google.com/?transactionId=710511157&userKey=RAAST-test',
    autoRedirectTimerSeconds: 10,
    bankName: 'JazzCash (MFB)',
    deepLinkUrlIos: 'https://apps.apple.com/pk/app/jazzcash-your-mobile-account/id1224617688',
    transactionId: '710511157',
  };

  const data: SlideType[] = [];
  // dataResponse?.response?.steps?.sort((a: SlideType, b: SlideType) => a.step - b.step) ?? [];

  if (!operatorResponse.transactionId) {
    return <NotFoundComponent text="The link you used is invalid or has expired." />;
  }

  return (
    <div className="flex flex-col flex-1 justify-between bg-zinc-50 font-sans">
      <div className="px-6 py-4 tablet:px-12 lg:mx-28">
        <PaymentHeader bankName={operatorResponse.bankName} />
        <div className="text-grey flex gap-0.5 items-center mt-5">
          <svg
            className="shrink-0 w-3 h-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            aria-hidden="true"
          >
            <path d="M8 1.5l5.5 2v4.7c0 3.4-2.3 6.2-5.5 7.3-3.2-1.1-5.5-3.9-5.5-7.3V3.5L8 1.5z" />
            <path d="M5.5 8l1.8 1.8L10.7 6.4" />
          </svg>
          <p className="text-sm">Complete payment inside your bank app.</p>
        </div>

        {/* web view */}
        <div className="hidden tablet:block">
          <StepSection slides={data ?? []} />
        </div>

        {/* mob view */}
        <div className="mt-5 block tablet:hidden">
          <StepsCarousel slides={data ?? []} />
        </div>
      </div>
      <div className="sticky bottom-0 w-full shadow-2xl">
        <PaymentFooter operatorResponse={operatorResponse} />
      </div>
    </div>
  );
}
