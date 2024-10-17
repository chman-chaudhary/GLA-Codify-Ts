"use client";

import Link from "next/link";
import { SignInButton } from "../SignInButton";
import { AlarmClock, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";

const ProblemHeader = () => {
  const [time, setTime] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleClockClick = () => {
    setShowTimer(!showTimer);
    setTime(0);
  };

  useEffect(() => {
    let intervalId;
    if (showTimer) {
      intervalId = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [showTimer]);

  return (
    <div className="flex justify-between items-center h-[10%] px-5 py-3 border-b-[0.5px] border-gray-300 backdrop-blur-sm">
      <Link href="/" className="w-1/3 items-center justify-start">
        <span className="text-3xl font-quicksandBold cursor-pointer">
          <span className="text-primary">GLA</span> Codify
        </span>
      </Link>
      <div className="w-1/3 flex items-center justify-end gap-x-5">
        <Button variant="outline" size="sm">
          {showTimer ? (
            <span className="flex items-center gap-2">
              {formatTime(time)}
              <RefreshCcw
                className="size-4"
                onClick={() => handleClockClick()}
              />
            </span>
          ) : (
            <AlarmClock onClick={() => handleClockClick()} />
          )}
        </Button>
        <ModeToggle />
        <SignInButton />
      </div>
    </div>
  );
};

export default ProblemHeader;
