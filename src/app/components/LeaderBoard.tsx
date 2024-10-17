"use client";

import getLeaderBoard from "@/actions/getLeaderBoard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";

interface LeaderBoardItem {
  id: string;
  name: string | null;
  image: string | null;
  points: number;
  email: string;
}

export const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderBoardItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getLeaderBoard();
        setLeaderboard(data);
      } catch (e) {
        console.log("Error in fetching leaderboard", e);
      }
    };
    fetchData();
  }, []);

  return (
    <Table className="w-full text-md rounded-md mb-20">
      <TableHeader>
        <TableRow>
          <TableHead>Rank</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaderboard.map((item, index) => (
          <TableRow key={item.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <User name={item.name ?? ""} image={item.image ?? ""} />
            </TableCell>
            <TableCell>{item.email}</TableCell>
            <TableCell>{item.points}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const User = ({ image, name }: { image: string; name: string }) => {
  return (
    <div className="flex items-center gap-x-2">
      <Avatar className="size-7">
        <AvatarImage src={image} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-xl text-white font-bold">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <p>{name}</p>
    </div>
  );
};
