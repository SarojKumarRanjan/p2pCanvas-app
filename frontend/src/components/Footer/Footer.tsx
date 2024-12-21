import { Separator } from "@/components/ui/separator";
import { TvMinimalPlay } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-10 py-4">
      <div className="flex flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:justify-between gap-8 lg:gap-4 my-6">
          {/* Logo, subheading and media icons */}
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-8 rounded flex items-center justify-center">
                <TvMinimalPlay className="text-white" />
              </div>
              <span className="text-xl font-bold">Study Space</span>
            </div>
            <p className="text-sm">Co-Study space for students</p>
          </div>

          {/* Navigation links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
            {/* Product Section */}
            <div className="space-y-4">
              <h3 className="font-bold">PRODUCT</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="text-md">
                  Email Collection
                </a>
                <a href="#" className="">
                  Pricing
                </a>
                <a href="#" className="">
                  FAQ
                </a>
              </div>
            </div>

            {/* Community Section */}
            <div className="space-y-4">
              <h3 className="font-bold">COMMUNITY</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="">
                  Discord
                </a>
                <a href="#" className="">
                  Twitter
                </a>
                <a href="#" className="">
                  Email
                </a>
              </div>
            </div>

            {/* Legal Section */}
            <div className="space-y-4">
              <h3 className="font-bold">LEGAL</h3>
              <div className="flex flex-col space-y-2">
                <a href="#" className="">
                  Terms
                </a>
                <a href="#" className="">
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="py-2">
          <Separator className="mb-4" />
          <p className="text-center text-sm">
            Copyright © 2025 Study Space. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;