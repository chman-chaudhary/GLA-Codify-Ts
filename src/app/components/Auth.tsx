"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Auth = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session && session.user) {
      router.push("/");
    }
  });

  return (
    <Card className="bg-secondary px-5">
      <CardHeader>
        <CardTitle className="text-4xl font-quicksandBold text-center">
          Welcome to <span className="text-primary">GLA</span> Codify
        </CardTitle>
        <CardDescription className="text-xl text-center font-quicksandSemiBold">
          Login to access problems
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-4">
        <Button
          className=" text-white text-xl py-8 rounded-xl font-quicksandBold transition duration-300 ease-in-out hover:-translate-y-3"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            await signIn("google");
            setIsLoading(false);
          }}
        >
          <FaGoogle className="size-6 mr-4" /> Continue with Google
        </Button>
        <Button
          className=" text-white text-xl py-8 rounded-xl font-quicksandBold transition duration-300 ease-in-out hover:-translate-y-3"
          onClick={() => signIn("github")}
          disabled={true}
        >
          <FaGithub className="size-6 mr-4" /> Continue with Github
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-3 mt-5">
        <CardTitle className="text-5xl font-quicksandBold">
          <span className="text-primary">GLA</span> University
        </CardTitle>
        <CardDescription className="text-xl text-center font-quicksandSemiBold">
          Empowering Students to Solve, Code, and Succeed!
        </CardDescription>
      </CardFooter>
    </Card>
  );
};

export default Auth;
