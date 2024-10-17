"use server";

import fs from "fs";
import { language, LanguagesToExtension } from "./types";

const MOUNT_PATH = "src/problems";

export const getProblem = async (problemSlug: string, languageId: language) => {
  languageId = LanguagesToExtension[languageId] as language;
  const fullBoilderPlate = await getProblemFullBoilerplateCode(
    problemSlug,
    languageId
  );

  const inputs = await getProblemInputs(problemSlug);
  const outputs = await getProblemOutputs(problemSlug);

  return {
    id: problemSlug,
    fullBoilerplateCode: fullBoilderPlate,
    inputs: inputs,
    outputs: outputs,
  };
};

async function getProblemFullBoilerplateCode(
  problemSlug: string,
  languageId: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      `${MOUNT_PATH}/${problemSlug}/boilerplate-full/function.${languageId}`,
      { encoding: "utf-8" },
      (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    );
  });
}

async function getProblemInputs(problemSlug: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(
      `${MOUNT_PATH}/${problemSlug}/tests/inputs`,
      async (err, files) => {
        if (err) {
          console.log(err);
        } else {
          await Promise.all(
            files.map((file) => {
              return new Promise<string>((resolve, reject) => {
                fs.readFile(
                  `${MOUNT_PATH}/${problemSlug}/tests/inputs/${file}`,
                  { encoding: "utf-8" },
                  (err, data) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(data);
                  }
                );
              });
            })
          )
            .then((data) => {
              resolve(data);
            })
            .catch((e) => reject(e));
        }
      }
    );
  });
}

async function getProblemOutputs(problemSlug: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(
      `${MOUNT_PATH}/${problemSlug}/tests/outputs`,
      async (err, files) => {
        if (err) {
          console.log(err);
        } else {
          await Promise.all(
            files.map((file) => {
              return new Promise<string>((resolve, reject) => {
                fs.readFile(
                  `${MOUNT_PATH}/${problemSlug}/tests/outputs/${file}`,
                  { encoding: "utf-8" },
                  (err, data) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(data);
                  }
                );
              });
            })
          )
            .then((data) => {
              resolve(data);
            })
            .catch((e) => reject(e));
        }
      }
    );
  });
}
