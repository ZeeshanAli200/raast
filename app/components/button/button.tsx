import './styles.css';

const Button = ({
  disabled = false,
  text = '',
  showArrowIcon = false,
  loading = false,
  type = 'button',
  variant = 'normal',
  className = '',
  onClick = () => {},
}: {
  disabled?: boolean;
  text: string;
  showArrowIcon?: boolean;
  loading?: boolean;
  type?: 'submit' | 'reset' | 'button' | undefined;
  variant?: 'normal' | 'success';
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={
        'custom-btn-arrow inline-flex gap-x-2 items-center  text-white font-bold py-3.5 px-5 rounded-lg ' +
        `${variant == 'success' ? 'bg-button-strong-green hover:bg-button-strong-green-dark' : 'bg-button-primary hover:bg-button-primary-dark'} ` +
        className
      }
    >
      {text}
      {showArrowIcon && (
        <svg
          className="svg-arrow"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      )}
      {loading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 fill-white inline animate-spin"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 22c5.421 0 10-4.579 10-10h-2c0 4.337-3.663 8-8 8s-8-3.663-8-8c0-4.336 3.663-8 8-8V2C6.579 2 2 6.58 2 12c0 5.421 4.579 10 10 10z"
            data-original="#000000"
          />
        </svg>
      )}
    </button>
  );
};
export default Button;
