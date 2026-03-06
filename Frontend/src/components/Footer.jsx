
import { Briefcase } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">

      <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* Brand */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-600 text-white p-1.5 rounded-md">
              <Briefcase size={16} />
            </div>
            <span className="text-lg font-semibold text-blue-600">
              LocalPro
            </span>
          </div>

          <p className="text-sm text-gray-500 leading-relaxed">
            The most trusted platform for booking professional home services.
            We connect you with top-rated local pros in your neighborhood.
          </p>
        </section>

        {/* Services */}
        <nav>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Services
          </h3>

          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-blue-600">House Cleaning</a></li>
            <li><a href="#" className="hover:text-blue-600">Plumbing Repair</a></li>
            <li><a href="#" className="hover:text-blue-600">Electrical Work</a></li>
            <li><a href="#" className="hover:text-blue-600">Handyman Services</a></li>
          </ul>
        </nav>

        {/* Company */}
        <nav>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Company
          </h3>

          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-blue-600">About Us</a></li>
            <li><a href="#" className="hover:text-blue-600">Become a Pro</a></li>
            <li><a href="#" className="hover:text-blue-600">Support Center</a></li>
            <li><a href="#" className="hover:text-blue-600">Contact</a></li>
          </ul>
        </nav>

        {/* Newsletter */}
        <section>
          <h3 className="text-sm font-semibold text-gray-800 mb-3 uppercase tracking-wide">
            Newsletter
          </h3>

          <p className="text-sm text-gray-500 mb-3">
            Get tips and exclusive offers delivered to your inbox.
          </p>

          <form className="flex items-center border border-gray-300 rounded-md overflow-hidden">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 px-3 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-2 hover:bg-blue-700"
            >
              →
            </button>
          </form>
        </section>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © 2024 LocalPro Services Inc. All rights reserved.
      </div>

    </footer>
  );
}

