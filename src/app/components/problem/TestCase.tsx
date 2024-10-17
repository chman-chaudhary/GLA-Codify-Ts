"use client";

import { CodeEditorProblem, SubmissionResponseType } from "@/actions/types";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";

export const TestCase = ({
  response,
  problemData,
}: {
  response: SubmissionResponseType[];
  problemData: CodeEditorProblem;
}) => {
  const [visibleTestCase, setVisibleTestCase] = useState<string>();
  const [problem, setProblem] = useState<CodeEditorProblem>();

  useEffect(() => {
    setProblem(problemData);
  }, [problem, setProblem]);

  if (!problem || !problem.testCases) {
    return <></>;
  }

  return (
    <div>
      <h2 className="text-md font-semibold text-secondary-foreground ml-4 my-1">
        Testcases
      </h2>
      <Separator className="my-1" />
      <div className="flex gap-x-4 px-2 py-1">
        {problem.testCases.map((testcase, idx) => {
          return (
            <div key={idx + 1}>
              <div
                className={
                  `rounded-md px-3 py-1 hover:bg-secondary` +
                  (visibleTestCase === testcase.id ? " bg-secondary" : "") +
                  (!visibleTestCase && idx == 0 ? " bg-secondary" : "")
                }
                onClick={() => setVisibleTestCase(testcase.id)}
              >
                <span
                  className={
                    `text-sm font-semibold flex items-center gap-x-1` +
                    (response != null
                      ? response[idx]?.status?.description === "Accepted"
                        ? " text-green-500"
                        : " text-red-500"
                      : "")
                  }
                >
                  {response ? (
                    response[idx]?.status?.description === "Accepted" ? (
                      <span className="text-[0.5rem]">🟢</span>
                    ) : (
                      <span className="text-[0.5rem]">🔴</span>
                    )
                  ) : (
                    ""
                  )}{" "}
                  Case {idx + 1}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        {problem.testCases.map((testcase, idx) => {
          if (
            visibleTestCase === testcase.id ||
            (!visibleTestCase && idx == 0)
          ) {
            return (
              <div key={idx} className="px-4 py-2">
                {response != null &&
                  response[idx]?.status?.description !== "Accepted" &&
                  response[idx]?.compile_output != null && (
                    <ShowError
                      key={`error-${testcase.id}`} // Add a unique key for ShowError
                      label={response[idx]?.status?.description}
                      errorMessage={response[idx]?.compile_output}
                    />
                  )}
                {response != null &&
                  response[idx]?.status?.description !== "Accepted" &&
                  response[idx]?.stderr != null && (
                    <ShowError
                      key={`error-${testcase.id}`} // Add a unique key for ShowError
                      label={response[idx]?.status?.description}
                      errorMessage={response[idx]?.stderr}
                    />
                  )}
                {testcase.input.map((input, index) => {
                  return (
                    <ShowInput
                      key={`input-${testcase.id}-${index}`} // Add a unique key for each input
                      label={input.key}
                      text={input.value.toString()}
                    />
                  );
                })}
                {response != null && response[idx].stdout != null && (
                  <ShowError
                    key={`output-${testcase.id}`} // Add a unique key for output ShowError
                    label="Output"
                    errorMessage={response[idx]?.stdout}
                  />
                )}
                <ShowInput
                  key={`expected-${testcase.id}`} // Add a unique key for Expected output
                  label="Expected output"
                  text={testcase.output.toString()}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
};

const ShowInput = ({ text, label }: { text: string; label: string }) => {
  return (
    <>
      <Label className="text-md font-semibold">{label} :</Label>
      <div className="mb-4 mt-2 text-md bg-secondary px-3 py-2 rounded-lg flex items-center justify-start">
        <code>{text}</code>
      </div>
    </>
  );
};

const ShowError = ({
  label,
  errorMessage,
}: {
  label: string;
  errorMessage: string;
}) => {
  return (
    <>
      <Label className="text-md font-semibold">{label} :</Label>
      <div className="mb-4 mt-2 text-md bg-secondary px-3 py-2 rounded-lg">
        {errorMessage.split("\n").map((message, idx) => {
          return <pre key={idx}>{message}</pre>;
        })}
      </div>
    </>
  );
};
