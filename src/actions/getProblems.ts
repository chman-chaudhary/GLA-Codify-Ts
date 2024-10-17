"use server";

import prisma from "@/db/index";
import { Status } from "@prisma/client";

export default async function getProblems(userEmail: string) {
  try {
    // Fetch all problems including their submissions and lastSolver
    const problems = await prisma.problem.findMany({
      include: {
        submissions: true,
        lastSolver: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    // Fetch the current user along with their submissions
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      include: {
        submissions: true,
      },
    });

    // Map over the fetched problems to include additional details
    const response = problems.map((problem) => {
      // Check if the current user has solved the problem
      const isSolved = user?.submissions.some(
        (submission) =>
          submission.problemId === problem.id && submission.status === Status.AC
      );

      // Prepare the problem response object
      return {
        ...problem,
        isSolved, // Indicates if the problem has been solved by the current user
        lastSolver: problem.lastSolver
          ? {
              id: problem.lastSolver.id,
              name: problem.lastSolver.name,
              email: problem.lastSolver.email,
              image: problem.lastSolver.image ?? null,
              points: problem.lastSolver.points,
            }
          : null, // Handle case where there is no last solver
      };
    });

    return response;
  } catch (e) {
    console.log("ERROR! while fetching problems", e);
  }
}
