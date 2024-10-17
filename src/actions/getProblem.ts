"use server";

import prisma from "@/db/index";
import { Status } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function getProblems(
  userEmail: string,
  problemSlug: string
) {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        slug: problemSlug,
      },
      include: {
        submissions: true,
        examples: true,
        testCases: true,
      },
    });

    if (!problem) {
      return redirect("/");
    }

    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        submissions: true,
      },
    });

    const isSolved = user?.submissions.some(
      (submission) =>
        submission.problemId === problem.id && submission.status === Status.AC
    );

    return {
      ...problem,
      isSolved,
    };
  } catch (error) {
    console.log("Error! while fetching problem", error);
  }
}
