import Image from "next/image";

export default function Spinner() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#EFEDEA] to-white flex items-center justify-center z-50">
      <div className="relative">
        {/* Logo Container */}
        <div className="relative w-32 h-32 mb-8">
          <Image
            src="/logo1.jpg"
            alt="Logo"
            fill
            className="object-contain animate-pulse"
          />
        </div>

        {/* Animated Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`absolute inset-0 border-2 border-[#540f6b] rounded-full animate-ripple`}
                style={{
                  animationDelay: `${i * 0.5}s`,
                  width: '100%',
                  height: '100%'
                }}
              />
            ))}
          </div>
        </div>

        {/* Loading Bar */}
        <div className="mt-8">
          <div className="w-48 h-1 bg-[#540f6b]/10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-[#540f6b] to-[#C48765] animate-loading-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}
