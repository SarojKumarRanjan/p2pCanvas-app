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
    <>
      <MainNavbar />
      <div className="relative flex h-svh w-full flex-col items-center justify-center overflow-hidden">
        <ShimmerButton className="shadow-2xl   h-8">
          <span className=" whitespace-pre-wrap text-center text-[0.5em] font-light leading-none tracking-tight text-white  lg:text-lg">
            ✨ Introducing Study Space
          </span>
          <ArrowRightIcon className="w-4 h-4 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 text-white" />
        </ShimmerButton>
        <h1 className=" z-10 whitespace-pre-wrap text-center  py-6 text-5xl font-medium leading-none tracking-tighter   sm:text-6xl md:text-7xl lg:text-7xl ">
          <span className="font-medium">
            <SparklesText
              sparklesCount={30}
              className="text-5xl font-medium leading-none tracking-tighter   sm:text-5xl md:text-6xl lg:text-7xl "
              text="Study Space is the new way"
            />
            to study in co-space.
          </span>
        </h1>
        <p className="mb-12 text-center text-lg tracking-tight ">
          At Studyspace, we bridge the gap in virtual learning with 
          <br className="hidden md:block" /> empowering every learner to thrive together.
        </p>
        <PopupModal>
          <Button className="px-8 mt-[-28px] ">
            Get Started For Free
            <ArrowRightIcon className="w-4 h-5   transition-transform duration-300 ease-in-out group-hover:translate-x-0.5 " />
          </Button>
        </PopupModal>
        
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
          )}
        />
       
      </div>
    </>
  );
}
