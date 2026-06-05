import assert from "node:assert/strict";
import {
  buildPrompt,
  getJobTitle,
  normalizeQuestions,
} from "../app/api/questions/utils.js";

const tests = [
  {
    name: "getJobTitle trims and collapses whitespace",
    run() {
      assert.equal(
        getJobTitle("  Customer   Success Manager  "),
        "Customer Success Manager"
      );
    },
  },
  {
    name: "getJobTitle rejects non-string values",
    run() {
      assert.equal(getJobTitle(null), "");
      assert.equal(getJobTitle(123), "");
    },
  },
  {
    name: "normalizeQuestions returns exactly the first three non-empty strings",
    run() {
      const questions = normalizeQuestions({
        questions: [
          " First question? ",
          "",
          42,
          "Second   question?",
          "Third question?",
          "Fourth question?",
        ],
      });

      assert.deepEqual(questions, [
        "First question?",
        "Second question?",
        "Third question?",
      ]);
    },
  },
  {
    name: "normalizeQuestions rejects missing or malformed question arrays",
    run() {
      assert.deepEqual(normalizeQuestions({}), []);
      assert.deepEqual(normalizeQuestions({ questions: "not an array" }), []);
    },
  },
  {
    name: "buildPrompt asks Gemini for role-specific JSON without private details",
    run() {
      const prompt = buildPrompt("Customer Success Manager");

      assert.match(prompt, /Customer Success Manager/);
      assert.match(prompt, /exactly 3/i);
      assert.match(prompt, /valid JSON only/i);
      assert.match(prompt, /personal, private, or resume-specific/i);
      assert.match(prompt, /protected-class/i);
      assert.match(prompt, /"questions"/);
    },
  },
];

for (const test of tests) {
  test.run();
  console.log(`PASS ${test.name}`);
}

console.log(`\n${tests.length} tests passed.`);
