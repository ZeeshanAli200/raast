const getInitials = (str?: string | null): string =>
  (str ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] ?? '')
    .join('')
    .toUpperCase();
export const PaymentHeader = ({ bankName = '' }: { bankName?: string }) => {
  const initialName = getInitials(bankName);

  return (
    <div className="flex gap-x-2">
      <div className="bg-light-green text-dark-green font-bold min-w-12 min-h-12 flex items-center justify-center rounded-2xl shadow-[inset_0_0_0_1px_#00440026]">
        {initialName ?? ''}
      </div>
      <div className="flex-1">
        <p className="text-warm tablet:text-grey font-int uppercase text-xs font-semibold tracking-wider">
          Payment Instructions
        </p>
        <h2 className="text-xl lg:text-2xl xl:text-4xl font-int text-blackish font-semibold">
          Pay with {bankName?.toUpperCase()}
        </h2>
      </div>
    </div>
  );
};
