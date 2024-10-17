"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User2 } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const SignInButton = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (session && session.user) {
    return (
      <div className="flex items-center gap-x-5">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="size-10">
              <AvatarImage src={session.user?.image ?? ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-2xl text-white font-bold">
                {session.user.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={10} align="end">
            <DropdownMenuItem disabled={true}>
              <User2 className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return <Button onClick={() => router.push("/auth")}>Sign In</Button>;
};
