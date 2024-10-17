"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../db"; // Adjust the path according to your project structure

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    slug,
    description,
    companies,
    topics,
    constraints,
    difficulty = "EASY",
    boilercode,
    examples = [],
    testcases = [], // We will handle this separately
    solution,
    image,
  } = body;

  try {
    // Create the new problem with associated data
    const newProblem = await prisma.problem.create({
      data: {
        title,
        slug,
        description,
        companies,
        topics,
        constraints,
        difficulty,
        boilercode,
        solution,
        image,
        examples: {
          create: examples.map(
            (example: {
              input: string;
              output: string;
              image?: string;
              explanation?: string;
            }) => ({
              input: example.input,
              output: example.output,
              explanation: example.explanation,
              image: example.image,
            })
          ),
        },
        testCases: {
          create: testcases.map(
            (testCase: { input: JSON; output: string }) => ({
              input: testCase.input,
              output: testCase.output,
            })
          ),
        },
      },
    });

    // Return success response with the newly created problem
    return NextResponse.json({ success: true, newProblem });
  } catch (error) {
    console.error("Error adding problem:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong while adding the problem.",
    });
  }
}
