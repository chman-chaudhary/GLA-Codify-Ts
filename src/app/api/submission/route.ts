import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getProblem } from "@/actions/problem";
import {
  language,
  LanguagesToNumber,
  SubmissionResponseType,
} from "@/actions/types";

export async function POST(req: NextRequest) {
  const { code, languageId, problemSlug, testcasesLength } = await req.json();

  const problem = await getProblem(problemSlug, languageId);

  if (!problem) {
    return NextResponse.json({
      success: false,
      message: "Problem not found!...",
    });
  }

  problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace(
    "USER_CODE_HERE",
    code
  );
  const sourceCodes: string[] = [];
  problem.inputs.map((input, idx) => {
    if (idx < testcasesLength) {
      let code = problem.fullBoilerplateCode;
      input.split("\r\n").map((i, idx) => {
        code = code.replace(`input_${idx}`, i);
      });
      sourceCodes.push(code);
    }
  });

  const createSubmissionOptions = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
      "Content-Type": "application/json",
    },
    data: {
      submissions: sourceCodes.map((code, idx) => ({
        language_id: LanguagesToNumber[languageId as language],
        source_code: code,
        expected_output: problem.outputs[idx],
      })),
    },
  };

  try {
    const response = await axios.request(createSubmissionOptions);
    const tokenArray: string[] = [];
    response.data.map((tokenObj: { token: string }) => {
      tokenArray.push(tokenObj.token);
    });
    const tokens = tokenArray.join(",");
    if (!tokens) {
      return NextResponse.json({
        success: false,
        message: "ERROR! while creating submission",
      });
    }
    const result = await checkBatchStatus(tokens);
    return NextResponse.json({ result, problem });
  } catch (e) {
    console.log("Error while creating submission", e);
    return NextResponse.json({
      success: false,
      message: "ERROR! while submission...",
    });
  }
}

const checkBatchStatus = async (
  tokens: string
): Promise<SubmissionResponseType[]> => {
  try {
    const submissions = await getSubmission(tokens);
    let inProgress = false;
    submissions.forEach((submission: SubmissionResponseType) => {
      if (
        submission.status.description === "In Queue" ||
        submission.status.description === "Processing"
      ) {
        inProgress = true;
      }
    });

    if (inProgress) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(checkBatchStatus(tokens)), 2000);
      });
    } else {
      return submissions;
    }
  } catch (error) {
    console.error("Error fetching batch statuses:", error);
    return [];
  }
};

const getSubmission = async (tokens: string) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: tokens,
      base64_encoded: "false",
      fields: "*",
    },
    headers: {
      "x-rapidapi-key": process.env.X_RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.X_RAPIDAPI_HOST,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data.submissions;
  } catch (error) {
    console.error("ERROR! while getting Submission", error);
  }
};
