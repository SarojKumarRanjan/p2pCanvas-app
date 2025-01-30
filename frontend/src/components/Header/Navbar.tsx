import { useState } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ThemeToggle } from "./theme-toggle";
import { TvMinimalPlay, Menu} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function MainNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  /* const navLinks = [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
  ]; */

  return (
    <>
      <div className="w-full top-0 z-50 fixed bg-primary-foreground/10 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center">
              <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center">
                  <TvMinimalPlay className="text-white w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="hidden sm:inline">Study Space</span>
                <span className="sm:hidden">Space</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {/* <nav className="flex items-center space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.title}
                    href={link.href}
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {link.title}
                  </a>
                ))}
              </nav> */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost">Log In</Button>
                <Button variant="outline">Sign Up</Button>
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                  <SheetHeader>
                    <SheetTitle>
                      <div className="flex items-center gap-2">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-7 h-7 rounded flex items-center justify-center">
                          <TvMinimalPlay className="text-white w-4 h-4" />
                        </div>
                        Study Space
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    {/* Mobile Nav Links */}
                    {/* <div className="flex flex-col space-y-3">
                      {navLinks.map((link) => (
                        <a
                          key={link.title}
                          href={link.href}
                          className="text-sm font-medium transition-colors hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          {link.title}
                        </a>
                      ))}
                    </div> */}
                    <Separator className="my-4" />
                    {/* Auth Buttons */}
                    <div className="flex flex-col gap-2">
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                      <Button className="w-full">Sign Up</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}

export default MainNavbar;