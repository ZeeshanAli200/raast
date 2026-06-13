'use client';
import { useCountdown } from '@/app/hooks/useCountdown';
import { useEffect, useMemo, useRef } from 'react';
import Button from '../button/button';
import { BankConfig, Inquire, InquireStatusEnum } from '@/lib/types';
import { getOS } from '@/lib/client/utils';
import { serverFetch } from '@/app/hooks/serverFetch';
import './styles.css';

const handleDeepLink = (opr: string, deepLinkUrl?: string) => {
  const os = getOS();

  const iosStoreUrl = `https://apps.apple.com/search?term=${encodeURIComponent(opr)}`;
  const androidStoreUrl = `intent://search?q=${opr}#Intent;scheme=market;package=com.android.vending;end;`;

  const storeUrl = os === 'ios' ? iosStoreUrl : androidStoreUrl;

  if (deepLinkUrl) {
    window.location.href = deepLinkUrl;

    const fallbackTimer = setTimeout(() => {
      window.location.href = storeUrl;
    }, 1500);

    // If user comes back to the page, the app opened — cancel the fallback
    const onVisibilityChange = () => {
      if (document.hidden) {
        // App opened, user left the browser — cancel store redirect
        clearTimeout(fallbackTimer);
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    // Clean up listener after 3s regardless
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    }, 3000);
  } else {
    window.location.href = storeUrl;
  }
};

export const PaymentFooter = ({ operatorResponse }: { operatorResponse: BankConfig }) => {
  // detecting the operating system of the user
  const oprSystem = getOS();

  // Open App Button Ref
  const openAppRef = useRef<HTMLAnchorElement>(null);
  const hasOpenedAppRef = useRef(false);

  // Auto redirect logic handled through ref
  const canAutoRedirectRef = useRef(false);

  // initial time for countdown by the bank response
  const initialTime = operatorResponse.autoRedirectTimerSeconds;

  // countdown hook
  const { minutes, seconds, start, time } = useCountdown({
    initialTime,
    // when 2 seconds are left, we will check the status of the transaction and if it's still pending, we can allow auto redirect
    async onTwoSecondsLeft() {
      if (operatorResponse.deepLinkUrl || operatorResponse.deepLinkUrlIos) {
        if (oprSystem !== 'ios' && oprSystem !== 'android') return;
        // && ALLOWED_OPERATORS?.includes(operatorResponse.bankName)
        const { data: inquireData } = operatorResponse.transactionId
          ? await serverFetch<Inquire>(
              process.env.NEXT_PUBLIC_INQUIRE_BASE_URL + '/userguide/inquire',
              {
                body: JSON.stringify({
                  transactionId: operatorResponse.transactionId.toString() ?? '',
                }),
                method: 'POST',
              }
            )
          : { data: null };

        if (inquireData?.status === InquireStatusEnum.PENDING) canAutoRedirectRef.current = true;
      }
    },
    // if the timer finishes and auto redirect is allowed, we will trigger the deep link
    onFinish() {
      if (
        (operatorResponse.deepLinkUrl || operatorResponse.deepLinkUrlIos) &&
        canAutoRedirectRef.current &&
        !hasOpenedAppRef.current
      ) {
        if (oprSystem !== 'ios' && oprSystem !== 'android') return;
        openAppRef?.current?.click();
      }
    },
  });

  // starting the countdown on component mount
  useEffect(() => {
    start();
  }, [initialTime]);

  const progress = useMemo(() => (time / initialTime) * 100, [initialTime, time]);

  // calculating is warning occured
  const lastThird = initialTime / 3;
  const isWarning = time <= lastThird;

  const deeplink = operatorResponse.deepLinkUrl || operatorResponse.deepLinkUrlIos;

  const timerText = isWarning ? 'Redirecting to bank app' : 'Auto-redirect to bank app in';
  const isMobileAndHasDeepLink = deeplink && oprSystem !== 'web';
  const IsTimerInSecondsGreaterThanZero = operatorResponse.autoRedirectTimerSeconds > 0;
  // console.log({ oprSystem });

  // console.log({ operatorResponse });

  return (
    <div
      className={
        'flex items-center gap-2 px-6 py-4 tablet:px-12 ' +
        `${isWarning && isMobileAndHasDeepLink && IsTimerInSecondsGreaterThanZero ? ' bg-warm-light border-t border-border-warm tablet:border-t-0 tablet:bg-white' : 'bg-white'}`
      }
    >
      {isMobileAndHasDeepLink && IsTimerInSecondsGreaterThanZero && (
        <div className="flex-1 tablet:hidden">
          <p
            className={
              `${deeplink ? '' : 'hidden'} tablet:hidden ` +
              'ta font-int uppercase text-xs font-semibold tracking-wider ' +
              `${isWarning ? 'text-warm' : 'text-grey'} `
            }
          >
            {timerText}
          </p>
          <div className={`${deeplink ? '' : 'hidden'} tablet:hidden ` + 'grid grid-cols-2'}>
            {/* progress bar */}
            <div className="col-span-2 sm:col-span-1 flex items-center">
              <span
                className={
                  'pr-2 text-[26px] font-jet-mono font-bold ' +
                  `${isWarning ? 'text-warm' : 'text-blackish'}`
                }
              >
                {minutes}:{seconds}
              </span>
              <div className=" w-full overflow-hidden h-1 text-xs flex rounded bg-gray-200">
                <div
                  style={{ width: `${progress}%` }}
                  className={
                    'shadow-none transition-all duration-700 flex flex-col text-center whitespace-nowrap text-white justify-center ' +
                    `${isWarning ? 'bg-warm-medium' : 'bg-button-primary'}`
                  }
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="tablet:flex-1">
        <p
          className={
            'hidden tablet:block text-black font-int uppercase text-xs font-semibold tracking-wider'
          }
        >
          After completing payment
        </p>
        <p className={'hidden tablet:block text-base font-int text-blackish font-medium '}>
          Once your payment is done, click the button to get redirected back to the merchant.
        </p>
      </div>
      <a
        ref={openAppRef}
        href="#"
        onClick={(e) => {
          e.preventDefault();
          hasOpenedAppRef.current = true;
          const deepLink =
            oprSystem === 'ios' ? operatorResponse.deepLinkUrlIos : operatorResponse.deepLinkUrl;
          handleDeepLink(operatorResponse.bankName, deepLink);
        }}
      >
        <Button
          className={
            `${isMobileAndHasDeepLink && IsTimerInSecondsGreaterThanZero ? '' : '!hidden'}` +
            ' tablet:hidden'
          }
          text="Open Now"
          variant="success"
          showArrowIcon
        />
      </a>
      <a
        href={operatorResponse.redirectUrl}
        className={
          isMobileAndHasDeepLink && IsTimerInSecondsGreaterThanZero
            ? 'hidden tablet:inline-block'
            : 'w-full tablet:w-fit'
        }
      >
        <Button
          className={'w-full text-center justify-center tablet:!inline-flex'}
          text="I have paid"
          showArrowIcon
        />
      </a>
    </div>
  );
};
