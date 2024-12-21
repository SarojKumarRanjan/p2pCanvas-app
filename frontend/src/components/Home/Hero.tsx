import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/Dotpattern";
import MainNavbar from "../Header/Navbar";
import { ShimmerButton } from "../magicui/shimmerButton";

import { ArrowRightIcon } from "lucide-react";
import { SparklesText } from "../magicui/Sparkle-text";
import { Button } from "../ui/button";
import PopupModal from "./PopupModal";

export function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col -mb-5">
      <div className="relative z-50">
        <MainNavbar />
      </div>

      <main className="flex-1 flex flex-col">
        <div className="relative  flex w-full min-h-[calc(100vh)] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 z-0">
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
              )}
            />
          </div>

          <div className="relative z-10 flex flex-col items-center mt-12 max-w-6xl mx-auto">
            <ShimmerButton className="shadow-2xl h-8 ">
              <span className="whitespace-pre-wrap text-center text-[0.5em] font-light leading-none tracking-tight text-white lg:text-lg">
                ✨ Introducing Study Space
              </span>
              <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-white" />
            </ShimmerButton>

            <h1 className="whitespace-pre-wrap text-center py-6 text-4xl font-medium leading-none tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="font-medium">
                <SparklesText
                  sparklesCount={30}
                  className="text-4xl font-medium leading-none tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
                  text="Study Space is the new way"
                />
                <span className="block mt-2">to study in co-space.</span>
              </span>
            </h1>

            <p className="mb-12 text-center text-base sm:text-lg tracking-tight max-w-2xl">
              At Studyspace, we bridge the gap in virtual learning with
              <br className="hidden md:block" /> empowering every learner to
              thrive together.
            </p>

            <PopupModal>
              <Button className="px-8">
                Get Started For Free
                <ArrowRightIcon className="w-4 h-5 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
              </Button>
            </PopupModal>
          </div>
        </div>
      </main>
    </div>
  );
}
