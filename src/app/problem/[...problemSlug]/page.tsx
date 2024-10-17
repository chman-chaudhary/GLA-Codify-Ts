"use client";

import getProblem from "@/actions/getProblem";
import { CodeEditor } from "@/app/components/problem/CodeEditor";
import { ProblemDescription } from "@/app/components/problem/ProblemDescription";
import { TestCase } from "@/app/components/problem/TestCase";
import ProblemHeader from "@/app/components/problem/ProblemHeader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Status } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  ExtendedProblem,
  CodeEditorProblem,
  CompleteProblemType,
  SubmissionResponseType,
} from "@/actions/types";
import { addSubmission } from "@/actions/addSubmission";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Page({ params }: { params: { problemSlug: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [response, setResponse] = useState<SubmissionResponseType[] | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [problem, setProblem] = useState<ExtendedProblem>();
  const [submitStatus, setSubmitStatus] = useState<{
    status: Status;
    testCaseIdx: number;
  }>();
  const [completeProblem, setCompleteProblem] = useState<CompleteProblemType>();

  // fetching Problem
  useEffect(() => {
    const fetchProblems = async () => {
      const problem = await getProblem(
        session?.user?.email || "",
        params.problemSlug[0]
      );
      if (problem) {
        setProblem(problem as ExtendedProblem);
      } else {
        console.error("Invalid problem data:", problem);
        router.push("/");
      }
    };

    fetchProblems();
  }, [params.problemSlug]);

  // Run Code
  const handleRunCode = async (
    code: string,
    languageId: string,
    testcasesLength: number
  ) => {
    const response = await axios.post("/api/submission", {
      code,
      languageId,
      problemSlug: problem?.slug,
      testcasesLength,
    });
    setResponse(response.data.result);
    setCompleteProblem(response.data.problem);
    if (testcasesLength > 100000) {
      const status: { status: Status; testCaseIdx: number } = getResultStatus(
        response.data.result
      );
      if (problem && session?.user?.email) {
        await addSubmission(
          session.user.email,
          problem.id,
          status.status,
          problem.difficulty
        );
        setSubmitStatus(status);
        setIsDrawerOpen(true);
      } else {
        console.log("Problem or User Email not found.");
      }
    }
  };

  function getResultStatus(results: SubmissionResponseType[]): {
    status: Status;
    testCaseIdx: number;
  } {
    for (let i = 0; i < results.length; i++) {
      if (results[i].status.id == 3) continue;
      if (results[i].status.id == 4)
        return { status: Status.WA, testCaseIdx: i };
      if (results[i].status.id == 5)
        return { status: Status.TLE, testCaseIdx: i };
      else return { status: Status.RTE, testCaseIdx: i };
    }

    return { status: Status.AC, testCaseIdx: -1 };
  }

  if (!problem) {
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      <ProblemHeader />
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full min-w-full rounded-lg md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={35} minSize={25}>
          <ProblemDescription problem={problem as ExtendedProblem} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={65} minSize={40}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={75}>
              <CodeEditor
                problem={problem as CodeEditorProblem}
                onRunCode={handleRunCode}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={25} minSize={5}>
              <TestCase
                response={response as SubmissionResponseType[]}
                problemData={problem as CodeEditorProblem}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
      {response && completeProblem && submitStatus && (
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle
                className={
                  `text-center text-4xl` +
                  (submitStatus?.status === Status.AC
                    ? " text-green-500"
                    : " text-red-500")
                }
              >
                {submitStatus?.status === Status.AC
                  ? "Accepted"
                  : submitStatus?.status === "RTE"
                  ? "Run Time Error"
                  : submitStatus?.status === Status.WA
                  ? "Wrong Answer"
                  : "Time Limit Exceeded"}
              </DrawerTitle>
              <DrawerDescription className="space-y-5">
                <h3 className="text-xl text-center my-5">
                  Test Cases:{" "}
                  <span
                    className={
                      "" +
                      (submitStatus.testCaseIdx === -1
                        ? "text-green-500"
                        : "text-red-500")
                    }
                  >
                    {submitStatus.testCaseIdx === -1
                      ? response.length
                      : submitStatus.testCaseIdx + 1}
                  </span>
                  /{response.length}
                </h3>
                {submitStatus.status !== Status.AC && (
                  <div className="flex flex-col items-center gap-x-5">
                    <ShowResult
                      label="Input"
                      text={completeProblem.inputs[submitStatus.testCaseIdx]}
                    />
                    {submitStatus.status === Status.WA && (
                      <ShowResult
                        label="Output"
                        text={response[submitStatus.testCaseIdx].stdout}
                      />
                    )}
                    {submitStatus.status === Status.RTE && (
                      <ShowResult
                        label="Runtime Error"
                        text={response[submitStatus.testCaseIdx].stderr}
                      />
                    )}
                    <ShowResult
                      label="Expected Output"
                      text={completeProblem.outputs[submitStatus.testCaseIdx]}
                    />
                  </div>
                )}
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

const ShowResult = ({
  label,
  text,
}: {
  label: string | null;
  text: string | null;
}) => {
  return (
    <div className="max-w-[60%] min-w-[60%] mb-3 space-y-2">
      <Label className="mx-1">{label ?? ""}:</Label>
      <div className="bg-secondary max-h-24 overflow-y-scroll p-2 rounded-md">
        {text ?? ""}
      </div>
    </div>
  );
};
