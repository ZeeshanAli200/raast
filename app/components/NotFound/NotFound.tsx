export default function NotFoundComponent({
  text = 'Something went wrong while starting your request. Please try again.',
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Cannot initiate request</h1>
      {/* Optional description */}
      <p className="text-gray-500 mb-6">{text} </p>
    </div>
  );
}
