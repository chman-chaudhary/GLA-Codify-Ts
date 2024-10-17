"use client";

import { useEffect, useState } from "react";
import getProblems from "@/actions/getProblems";
import { Difficulty, Problem as PrismaProblem, User } from "@prisma/client";
import YouTube from "react-youtube";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { CheckCircle } from "lucide-react";
import { BsDash } from "react-icons/bs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaYoutube } from "react-icons/fa";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

interface ExtendedProblem extends PrismaProblem {
  isSolved: boolean | undefined; // Indicates if the problem is solved by the current user
  lastSolver: User | null; // Include last solver details
}

export const Problems = () => {
  const { data: session } = useSession();
  const [showVideo, setShowVideo] = useState(false);

  const [problems, setProblems] = useState<ExtendedProblem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const problems = await getProblems(session?.user?.email || "");
      if (!problems) {
        setProblems([]);
      } else {
        setProblems(problems);
      }
    };

    fetchProblems();
  }, []);

  return (
    <>
      <Table className="w-full text-md mb-20">
        <TableHeader>
          <TableRow>
            <TableHead className="w-32 pl-8">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="max-w-60 text-center">Difficulty</TableHead>
            <TableHead className="text-center">Solution</TableHead>
            <TableHead className="text-center">Last Solver</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problems.map((problem, idx) => (
            <TableRow key={problem.id} className="cursor-pointer">
              {/* is Solved */}
              <TableCell className="w-32 pl-8 flex items-center">
                {problem.isSolved ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <CheckCircle className="size-4 ml-3 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-green-500">
                        <span className="text-white">Solved</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BsDash className="size-4 ml-3 text-yellow-500" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-yellow-500">
                        <span className="text-white">Unsolved</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>

              {/* Title */}
              <TableCell className="max-w-48 min-w-48 hover:text-primary">
                <Link
                  href={
                    session && session.user
                      ? `/problem/${problem.slug}`
                      : "/auth"
                  }
                >
                  {idx + 1}. {problem.title}
                </Link>
              </TableCell>

              {/* Difficulty */}
              <TableCell className="flex justify-center items-center">
                {problem.difficulty === Difficulty.EASY ? (
                  <span className="bg-green-500 text-white py-1 px-2 text-sm rounded-md">
                    Easy
                  </span>
                ) : problem.difficulty === Difficulty.MEDIUM ? (
                  <span className="bg-yellow-500 text-white p-1 text-sm rounded-md">
                    Medium
                  </span>
                ) : (
                  <span className="bg-red-500 text-white py-1 px-2 text-sm rounded-md">
                    Hard
                  </span>
                )}
              </TableCell>

              {/* Solution */}
              <TableCell>
                <div className="flex justify-center items-center">
                  {problem.solution ? (
                    <>
                      <FaYoutube
                        className="size-7 text-red-500"
                        onClick={() => setShowVideo(true)}
                      />
                      {showVideo && (
                        <YouTubeContainer
                          videoId={problem.solution}
                          setShowVideo={setShowVideo}
                        />
                      )}
                    </>
                  ) : (
                    <span className="text-gray-500 text-xs">Comming soon</span>
                  )}
                </div>
              </TableCell>

              {/* Last Solver */}
              <TableCell className="flex justify-center items-center">
                {problem.lastSolver ? (
                  <>
                    <Avatar className="size-5 mr-2">
                      <AvatarImage
                        src={problem.lastSolver.image ?? ""}
                        alt="User image"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-base text-white font-bold">
                        {problem.lastSolver.name !== undefined
                          ? problem.lastSolver.name?.charAt(0)
                          : ""}
                      </AvatarFallback>
                    </Avatar>{" "}
                    <span className="hover:underline">
                      {problem.lastSolver?.name}
                    </span>
                  </>
                ) : (
                  <div className="flex items-center gap-x-2">
                    <BsDash className="size-5 text-yellow-500" />{" "}
                    <span className="text-gray-500 text-sm">No one</span>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

type YouTubeContainerProps = {
  videoId: string;
  setShowVideo: (state: React.SetStateAction<boolean>) => void;
};

const YouTubeContainer = ({ videoId, setShowVideo }: YouTubeContainerProps) => {
  return (
    <div className="flex fixed justify-center items-center top-0 left-0 h-screen w-full z-30 backdrop-blur-sm">
      <div>
        <div className="flex justify-end items-center w-full">
          <Cross2Icon
            className="size-8 hover:text-primary"
            onClick={() => setShowVideo(false)}
          />
        </div>
        <YouTube videoId={videoId} />
      </div>
    </div>
  );
};
