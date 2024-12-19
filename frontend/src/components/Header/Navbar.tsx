import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ThemeToggle } from "./theme-toggle";
import {TvMinimalPlay} from 'lucide-react'

function MainNavbar() {
  return (
    <>
      <div className="w-full top-0  z-50 fixed bg-primary-foreground/10 backdrop-blur-md   ">
        <div className="mx-32 h-16 flex justify-between  items-center">
          <div className="text-2xl font-bold">
            <h1 className="flex items-center gap-2">
              <TvMinimalPlay/>
              Study Space </h1>
          </div>
          <div className="flex gap-4">
            <Button variant={"ghost"}>Log In</Button>
            <Button variant={"outline"}>Sign Up</Button>
            <ThemeToggle />
          </div>
        </div>
        <Separator />
      </div>
    </>
  );
}

export default MainNavbar;
