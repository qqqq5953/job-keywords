
const framework = ["reactjs", "react.js", "react", "react hook", "react hooks", "react native", "next.js", "nextjs", "vue", "vue.js", "vuejs", "vue2", "vue3", "nuxt.js", "nuxtjs", "gatsby"];
const stateManagement = ["vuex", "pinia", "redux", "rtk", "redux toolkit", "zustand"];
const languageAndLibraries = [
  "javascript", "typescript", "ts", "js", "zod",
  "swr", "react query", "rtk query",
  "msw", "storybook",
  "react i18n", "vue-i18n",
  "react router", "vue router",
  "apache echarts", "konva.js", "three.js", "shader", "d3.js", "chart.js",
  "jquery"
];
const css = [
  "tailwind css", "tailwind", "tailwindcss", "shadcn",
  "bootstrap", "bootstrap 5", "bootstrap5", "scss", "css",
  "headless ui", "material ui", "ant design", "style component"
];
const backend = ["nodejs", "node.js", "express.js", "php", "laravel", "python", "fastapi"];
const cloud = ["aws", "gcp", "azure", "firebase"];
const test = ["jest", "vitest", "playwright", "cypress", "unit test", "unit testing", "end-to-end testing", "e2e test"];
const db = ["mongodb", "mongoose", "sql", "mysql", "postgresql"];
const tools = ["vite", "webpack", "gulp", "babel"];
const devop = ["docker", "kubernetes", "k8s"];
const infoSec = ["xss", "cors", "csrf"]
const other = ["graphql", "websocket", "webrtc", "agile", "敏捷", "seo", "git", "github", "gitlab", "性能", "效能優化", "csr", "ssr", "ssg", "server side rendering", "static site generation", "clean code", "solid", "ci/cd", "cicd", "gitlab ci/cd", "code review", "linux", "tdd"];

// Keywords stored in a Set for O(1) lookup time
export const keywordSet = new Set([
  ...framework,
  ...stateManagement,
  ...languageAndLibraries,
  ...css,
  ...backend,
  ...cloud,
  ...test,
  ...db,
  ...tools,
  ...devop,
  ...infoSec,
  ...other
]);

const skillsMapping: { [key: string]: string } = {
  "react": "react",
  "reactjs": "react",
  "react.js": "react",
  "react hook": "react hooks",
  "react hooks": "react hooks",
  "next.js": "next.js",
  "nextjs": "next.js",

  "vue": "vue",
  "vuejs": "vue",
  "vue.js": "vue",
  "vue2": "vue",
  "vue3": "vue",
  "nuxt.js": "nuxt.js",
  "nuxtjs": "nuxt.js",

  "angularjs": "angular",
  "angular.js": "angular",

  "nodejs": "node.js",
  "node.js": "node.js",
  "express.js": "express.js",

  "tailwind css": "tailwind",
  "tailwindcss": "tailwind",
};

function normalizeKeyword(keyword: string): string {
  const lowerCaseKeyword = keyword.toLowerCase().trim();
  return skillsMapping[lowerCaseKeyword] || lowerCaseKeyword;
}

export function mergeSkillsAndKeywords(
  skills: string[],
  keywordsContent: string[],
  keywordsOther: string[]
): string[] {
  const normalizedSkills = skills.map(skill => normalizeKeyword(skill));
  const normalizedKeywordsContent = keywordsContent.map(keyword => normalizeKeyword(keyword));
  const normalizedKeywordsOther = keywordsOther.map(keyword => normalizeKeyword(keyword));

  // Combine both arrays and remove duplicates using a Set
  const combinedSet = new Set([
    ...normalizedKeywordsContent,
    ...normalizedKeywordsOther,
    ...normalizedSkills
  ]);

  return Array.from(combinedSet);
}

export function getSplitWords(text: string, singleWordKeywords: Set<string>, multiWordKeywords: Set<string>): string[] {
  if (isChineseContent(text)) {
    return splitMixedText(text, singleWordKeywords);
  } else {
    return splitEnglishText(text, singleWordKeywords, multiWordKeywords);
  }
}

// Improved function to split mixed Chinese and English text
function splitMixedText(text: string, singleWordKeywords: Set<string>): string[] {
  // const regex = /[\u4e00-\u9fa5]+|[A-Za-z]+(?:[ ]+[A-Za-z]+)*|[\p{P}\p{Z}]+/gu;
  const regex = /[\u4e00-\u9fa5]+|[a-zA-Z0-9.-/]+(?:[ ]+[a-zA-Z0-9.-/]+)*|[\p{P}\p{Z}]/gu;

  const matchedText = text.match(regex) as RegExpMatchArray
  console.log('matchedText', matchedText.slice(190, 220));

  const jobWords = matchedText.map(word => word.trim()).filter(Boolean);
  console.log('jobWords', jobWords.slice(150, 190));

  const foundKeywords: Set<string> = new Set();

  // Check each word in job content, and if it's in the keywordSet, add to foundKeywords
  jobWords.forEach(word => {
    if (!containsChineseAndSymbols(word)) {
      const cleanedWord = cleanWord(word);
      console.log('word', word);
      console.log('cleanedWord', cleanedWord);

      // remove list marker
      const trimCleanedWord = cleanedWord.length > 1 && cleanedWord.startsWith('-') ?
        cleanedWord.slice(1).trim() :
        cleanedWord.trim()

      const lowerCaseTrimCleanedWord = trimCleanedWord.toLowerCase();
      console.log('lowerCaseTrimCleanedWord', lowerCaseTrimCleanedWord);

      const [first, second] = lowerCaseTrimCleanedWord.split("/")

      if (first && singleWordKeywords.has(first.trim())) {
        foundKeywords.add(first);
      }

      if (second && singleWordKeywords.has(second.trim())) {
        foundKeywords.add(second);
      }

      if (keywordSet.has(lowerCaseTrimCleanedWord)) {
        foundKeywords.add(lowerCaseTrimCleanedWord);
      }
    }
  });

  return Array.from(foundKeywords)
}

function splitEnglishText(text: string, singleWordKeywords: Set<string>, multiWordKeywords: Set<string>): string[] {
  const words = text.split(/\s+|[,!?()":/]/).filter(Boolean);
  // console.log('words', words.slice(111));
  const foundKeywords: Set<string> = new Set();

  let i = 0;
  while (i < words.length) {
    const currentWord = words[i].trim().toLowerCase();
    const nextWord = words[i + 1] ? words[i + 1].trim().toLowerCase() : '';
    // console.log('currentWord', currentWord);
    // console.log('nextWord', nextWord);

    // Only check for multi-word keywords if nextWord exists
    if (nextWord) {
      const combinedWord = `${currentWord} ${nextWord}`;
      // console.log('combinedWord', combinedWord);

      if (multiWordKeywords.has(combinedWord)) {
        // console.log('====add====', combinedWord);

        foundKeywords.add(combinedWord);
        i += 2; // Skip the next word because it's part of a multi-word keyword
        continue;
      }
    }

    // Otherwise check single word
    if (singleWordKeywords.has(currentWord)) {
      foundKeywords.add(currentWord);
    }

    i += 1;
  }

  return Array.from(foundKeywords);
}

function containsChineseAndSymbols(str: string) {
  const regex = /[\u4e00-\u9fa5]|[、，。！：？、【】]/;
  const isHyphen = str === '-'
  const isDot = str === '•'
  return regex.test(str) || isHyphen || isDot;
}

function cleanWord(word: string) {
  return word.replace(/[、，。！：？、【】",:()*]/g, '');
}

function isChineseContent(text: string) {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  return chineseRegex.test(text);
}

