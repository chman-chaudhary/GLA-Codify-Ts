"use client";

import { CodeEditorProblem, language } from "@/actions/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

type CodeEditorProps = {
  problem: CodeEditorProblem;
  onRunCode: (
    code: string,
    languageId: string,
    testcasesLength: number
  ) => void;
};

export const CodeEditor = ({ problem, onRunCode }: CodeEditorProps) => {
  const { theme, systemTheme } = useTheme();

  const [languageId, setLanguageId] = useState<language>("java");
  const [code, setCode] = useState<string>(problem.boilercode[languageId]);
  const [isRunLoading, setIsRunLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);
  const [testcasesLength, setTestcasesLength] = useState<number>(0);

  useEffect(() => {
    if (problem && problem.boilercode && problem.boilercode[languageId]) {
      setCode(problem.boilercode[languageId]);
    }
  }, [problem.boilercode, languageId, problem]);

  useEffect(() => {
    setTestcasesLength(problem.testCases.length);
  }, [problem]);

  return (
    <div className="h-full w-full">
      <SelectLanguage setLanguage={setLanguageId} />
      <Editor
        language={languageId}
        theme={
          theme === "system"
            ? systemTheme === "dark"
              ? "vs-dark"
              : "default"
            : theme === "dark"
            ? "vs-dark"
            : "default"
        }
        value={code}
        className="h-full w-full"
        onChange={(value) => {
          setCode(value as string);
        }}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastColumn: 3,
        }}
      />
      <Footer
        onRunCode={onRunCode}
        testcasesLength={testcasesLength}
        code={code}
        languageId={languageId}
        setIsRunLoading={setIsRunLoading}
        isRunLoading={isRunLoading}
        setIsSubmitLoading={setIsSubmitLoading}
        isSubmitLoading={isSubmitLoading}
      />
    </div>
  );
};

type FooterProps = {
  onRunCode: (
    code: string,
    languageId: string,
    testcasesLength: number
  ) => void;
  testcasesLength: number;
  code: string;
  languageId: string;
  setIsRunLoading: (state: boolean) => void;
  isRunLoading: boolean;
  setIsSubmitLoading: (state: boolean) => void;
  isSubmitLoading: boolean;
};

const Footer = ({
  onRunCode,
  testcasesLength,
  code,
  languageId,
  setIsRunLoading,
  isRunLoading,
  setIsSubmitLoading,
  isSubmitLoading,
}: FooterProps) => {
  return (
    <div className="flex items-center justify-end sticky bottom-0 pb-2 gap-3 pr-4">
      <Button
        variant="secondary"
        className="font-semibold text-secondary-foreground"
        onClick={async () => {
          setIsRunLoading(true);
          try {
            await onRunCode(code, languageId, testcasesLength);
          } catch (error) {
            console.error("Error while execution of code:", error);
          } finally {
            setIsRunLoading(false);
          }
        }}
        disabled={isRunLoading || isSubmitLoading}
      >
        {isRunLoading ? "Running..." : "Run"}
      </Button>
      <Button
        variant="outline"
        className="bg-green-600 font-semibold text-white hover:bg-green-700"
        disabled={isRunLoading || isSubmitLoading}
        onClick={async () => {
          setIsSubmitLoading(true);
          try {
            await onRunCode(code, languageId, 1000000);
          } catch (error) {
            console.error("Error while execution of code:", error);
          } finally {
            setIsSubmitLoading(false);
          }
        }}
      >
        {isSubmitLoading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
};

type SelectLanguageProps = {
  setLanguage: (state: language) => void;
};

const SelectLanguage = ({ setLanguage }: SelectLanguageProps) => {
  return (
    <div className="p-1">
      <Select
        defaultValue="java"
        onValueChange={(value: language) => setLanguage(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Languages</SelectLabel>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
