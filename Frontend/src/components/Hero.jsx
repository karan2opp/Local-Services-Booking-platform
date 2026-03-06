import { Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto mt-6 px-6">
      <div
        className="relative rounded-xl overflow-hidden bg-cover bg-center h-[360px] flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1600&auto=format&fit=crop')",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative text-center text-white max-w-3xl px-4">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Your home, handled by professionals.
          </h1>

          <p className="mt-3 text-sm md:text-base text-gray-200">
            Book trusted local services in seconds
          </p>

          {/* Search bar */}
          <div className="mt-6 flex items-center bg-white rounded-lg overflow-hidden shadow-lg max-w-xl mx-auto">
            <div className="flex items-center px-3 text-gray-400">
              <Search size={18} />
            </div>

            <input
              type="text"
              placeholder="What do you need help with?"
              className="flex-1 px-2 py-3 text-sm text-gray-700 outline-none"
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-sm font-medium">
              Search
            </button>
          </div>

          {/* Popular tags */}
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
            <span className="text-gray-200">Popular:</span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Cleaning
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Handyman
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Plumbing
            </span>

            <span className="bg-white/20 px-3 py-1 rounded-full">
              Moving
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}