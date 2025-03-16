export default function FeaturesSection() {
    return (
      <div className="w-full bg-gray-100 py-8 mt-10">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center text-center gap-4 px-4">
          <div className="flex flex-col items-center w-1/3 min-w-[150px]">
            <svg className="h-14 w-14 text-greens" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
            <h2 className="text-lg font-semibold  text-darkgray mt-3">Easy Exchange</h2>
          </div>
          <div className="flex flex-col items-center w-1/3 min-w-[150px]">
            <svg className="h-14 w-14 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16v16H4z" />
            </svg>
            <h2 className="text-lg font-semibold mt-3 text-darkgray">7 Days Return</h2>
          </div>
          <div className="flex flex-col items-center w-1/3 min-w-[150px]">
            <svg className="h-14 w-14 text-warmbrown" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1v22m0-10H4m8 0h8" />
            </svg>
            <h2 className="text-lg font-semibold mt-3 text-darkgray">24/7 Support</h2>
          </div>
        </div>
      </div>
    );
  }
  