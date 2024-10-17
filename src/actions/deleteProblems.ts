"use server";
import prisma from "@/db";

const deleteProblems = async () => {
  try {
    await prisma.problem.deleteMany({});
  } catch (error) {
    console.log("Error while deleting all problems", error);
  }
};

export default deleteProblems;
