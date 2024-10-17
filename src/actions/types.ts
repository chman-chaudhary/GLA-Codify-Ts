import { Problem } from "@prisma/client";

export interface CodeEditorProblem extends Problem {
  isSolved: boolean | undefined;
  examples: {
    image?: string;
    input: string;
    output: string;
    explanation: string;
  }[];
  boilercode: {
    cpp: string;
    java: string;
    javascript: string;
    python: string;
  };
  testCases: {
    id: string;
    input: {
      key: string;
      value: string;
    }[];
    output: string;
  }[];
}

export interface ExtendedProblem extends Problem {
  isSolved: boolean | undefined;
  examples: {
    image?: string;
    input: string;
    output: string;
    explanation: string;
  }[];
}

export const LanguagesToNumber = {
  java: 62,
  javascript: 63,
  cpp: 53,
  python: 71,
};

export type language = "java" | "javascript" | "cpp" | "python";

export const LanguagesToExtension = {
  java: "java",
  cpp: "cpp",
  python: "py",
  javascript: "js",
};

export type CompleteProblemType = {
  id: string;
  fullBoilerplateCode: string;
  inputs: string[];
  outputs: string[];
};

export type SubmissionResponseType = {
  compile_output: string | null;
  expected_output: string | null;
  language: { id: number; name: string };
  language_id: number;
  source_code: string;
  status: { id: number; description: string };
  status_id: number;
  stderr: string | null;
  stdin: null;
  stdout: string | null;
  time: string;
  token: string;
};
