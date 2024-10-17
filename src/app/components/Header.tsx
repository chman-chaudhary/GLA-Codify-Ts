import Link from "next/link";
import { SignInButton } from "./SignInButton";
import { ModeToggle } from "@/components/ui/ModeToggle";

export const Header = () => {
  return (
    <div className="w-full top-0 left-0 right-0 z-50 fixed">
      <div className="w-[90vw] h-20 mx-auto mt-3 py-2 px-4 space-y-2 border-[1px] border-gray-400/25 backdrop-blur-md rounded-lg flex items-center justify-between">
        <Link href="/">
          <span className="text-4xl font-bold font-quicksandBold cursor-pointer">
            <span className="text-primary">GLA</span> Codify
          </span>
        </Link>
        <div className="flex items-center gap-x-5">
          <ModeToggle />
          <SignInButton />
        </div>
      </div>
    </div>
  );
};
