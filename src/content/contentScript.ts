// import { getSplitWords, keywordSet, mergeSkillsAndKeywords } from "../lib/extractor";

// const singleWordKeywords: Set<string> = new Set();
// const multiWordKeywords: Set<string> = new Set();

// // Preprocess keywords
// Array.from(keywordSet).forEach(keyword => {
//   // console.log('keyword', keyword);
//   // const preprocessedKeyword = preprocessText(keyword)
//   // console.log('preprocessedKeyword', preprocessedKeyword);

//   if (keyword.includes(' ') || keyword.includes('/')) {
//     multiWordKeywords.add(keyword);
//   } else {
//     singleWordKeywords.add(keyword);
//   }
// });

const framework = [
  { belongsTo: 'Frontend Framework', name: 'reactjs' },
  { belongsTo: 'Frontend Framework', name: 'react.js' },
  { belongsTo: 'Frontend Framework', name: 'react' },
  { belongsTo: 'Frontend Framework', name: 'react hook' },
  { belongsTo: 'Frontend Framework', name: 'react hooks' },
  { belongsTo: 'Frontend Framework', name: 'react native' },
  { belongsTo: 'Frontend Framework', name: 'next.js' },
  { belongsTo: 'Frontend Framework', name: 'nextjs' },
  { belongsTo: 'Frontend Framework', name: 'vue' },
  { belongsTo: 'Frontend Framework', name: 'vue.js' },
  { belongsTo: 'Frontend Framework', name: 'vuejs' },
  { belongsTo: 'Frontend Framework', name: 'vue2' },
  { belongsTo: 'Frontend Framework', name: 'vue3' },
  { belongsTo: 'Frontend Framework', name: 'nuxt.js' },
  { belongsTo: 'Frontend Framework', name: 'nuxtjs' },
  { belongsTo: 'Frontend Framework', name: 'gatsby' }
];
const stateManagement = [
  { belongsTo: 'State Management', name: 'vuex' },
  { belongsTo: 'State Management', name: 'pinia' },
  { belongsTo: 'State Management', name: 'redux' },
  { belongsTo: 'State Management', name: 'rtk' },
  { belongsTo: 'State Management', name: 'redux toolkit' },
  { belongsTo: 'State Management', name: 'zustand' }
];
const languages = [
  { belongsTo: 'Frontend Languages', name: 'javascript' },
  { belongsTo: 'Frontend Languages', name: 'typescript' },
  { belongsTo: 'Frontend Languages', name: 'ts' },
  { belongsTo: 'Frontend Languages', name: 'js' }
];
const libraries = [
  { belongsTo: 'Libraries', name: 'zod' },
  { belongsTo: 'Libraries', name: 'swr' },
  { belongsTo: 'Libraries', name: 'react query' },
  { belongsTo: 'Libraries', name: 'rtk query' },
  { belongsTo: 'Libraries', name: 'msw' },
  { belongsTo: 'Libraries', name: 'storybook' },
  { belongsTo: 'Libraries', name: 'react-i18n' },
  { belongsTo: 'Libraries', name: 'vue-i18n' },
  { belongsTo: 'Libraries', name: 'react i18n' },
  { belongsTo: 'Libraries', name: 'vue i18n' },
  { belongsTo: 'Libraries', name: 'react router' },
  { belongsTo: 'Libraries', name: 'vue router' },
  { belongsTo: 'Libraries', name: 'apache echarts' },
  { belongsTo: 'Libraries', name: 'konva.js' },
  { belongsTo: 'Libraries', name: 'three.js' },
  { belongsTo: 'Libraries', name: 'shader' },
  { belongsTo: 'Libraries', name: 'd3.js' },
  { belongsTo: 'Libraries', name: 'chart.js' },
  { belongsTo: 'Libraries', name: 'jquery' }
];
const css = [
  { belongsTo: 'CSS', name: 'tailwind css' },
  { belongsTo: 'CSS', name: 'tailwind' },
  { belongsTo: 'CSS', name: 'tailwindcss' },
  { belongsTo: 'CSS', name: 'shadcn' },
  { belongsTo: 'CSS', name: 'bootstrap' },
  { belongsTo: 'CSS', name: 'bootstrap 5' },
  { belongsTo: 'CSS', name: 'bootstrap5' },
  { belongsTo: 'CSS', name: 'scss' },
  { belongsTo: 'CSS', name: 'css' },
  { belongsTo: 'CSS', name: 'headless ui' },
  { belongsTo: 'CSS', name: 'material ui' },
  { belongsTo: 'CSS', name: 'ant design' },
  { belongsTo: 'CSS', name: 'style component' }
];
const backend = [
  { belongsTo: 'Backend', name: 'nodejs' },
  { belongsTo: 'Backend', name: 'node.js' },
  { belongsTo: 'Backend', name: 'express.js' },
  { belongsTo: 'Backend', name: 'php' },
  { belongsTo: 'Backend', name: 'laravel' },
  { belongsTo: 'Backend', name: 'python' },
  { belongsTo: 'Backend', name: 'fastapi' }
];
const cloud = [
  { belongsTo: 'Cloud', name: 'aws' },
  { belongsTo: 'Cloud', name: 'gcp' },
  { belongsTo: 'Cloud', name: 'azure' },
  { belongsTo: 'Cloud', name: 'firebase' }
];
const test = [
  { belongsTo: 'Test', name: 'jest' },
  { belongsTo: 'Test', name: 'vitest' },
  { belongsTo: 'Test', name: 'playwright' },
  { belongsTo: 'Test', name: 'cypress' },
  { belongsTo: 'Test', name: 'unit test' },
  { belongsTo: 'Test', name: 'unit testing' },
  { belongsTo: 'Test', name: 'end-to-end testing' },
  { belongsTo: 'Test', name: 'e2e test' }
];
const db = [
  { belongsTo: 'Database', name: 'mongodb' },
  { belongsTo: 'Database', name: 'mongoose' },
  { belongsTo: 'Database', name: 'sql' },
  { belongsTo: 'Database', name: 'mysql' },
  { belongsTo: 'Database', name: 'postgresql' }
];
const tools = [
  { belongsTo: 'Tools', name: 'vite' },
  { belongsTo: 'Tools', name: 'webpack' },
  { belongsTo: 'Tools', name: 'gulp' },
  { belongsTo: 'Tools', name: 'babel' }
];
const devop = [
  { belongsTo: 'Devop', name: 'docker' },
  { belongsTo: 'Devop', name: 'kubernetes' },
  { belongsTo: 'Devop', name: 'k8s' }
];
const infoSec = [
  { belongsTo: 'InfoSec', name: 'xss' },
  { belongsTo: 'InfoSec', name: 'cors' },
  { belongsTo: 'InfoSec', name: 'csrf' }
]
const other = [
  { belongsTo: 'Other', name: 'graphql' },
  { belongsTo: 'Other', name: 'websocket' },
  { belongsTo: 'Other', name: 'webrtc' },
  { belongsTo: 'Other', name: 'agile' },
  { belongsTo: 'Other', name: '敏捷' },
  { belongsTo: 'Other', name: 'seo' },
  { belongsTo: 'Other', name: 'git' },
  { belongsTo: 'Other', name: 'github' },
  { belongsTo: 'Other', name: 'gitlab' },
  { belongsTo: 'Other', name: '性能' },
  { belongsTo: 'Other', name: '效能優化' },
  { belongsTo: 'Other', name: 'csr' },
  { belongsTo: 'Other', name: 'ssr' },
  { belongsTo: 'Other', name: 'ssg' },
  { belongsTo: 'Other', name: 'server side rendering' },
  { belongsTo: 'Other', name: 'static site generation' },
  { belongsTo: 'Other', name: 'clean code' },
  { belongsTo: 'Other', name: 'solid' },
  { belongsTo: 'Other', name: 'ci/cd' },
  { belongsTo: 'Other', name: 'cicd' },
  { belongsTo: 'Other', name: 'gitlab ci/cd' },
  { belongsTo: 'Other', name: 'code review' },
  { belongsTo: 'Other', name: 'linux' },
  { belongsTo: 'Other', name: 'tdd' }
];

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

function normalizeKeyword(keyword: string): string {
  const lowerCaseKeyword = keyword.toLowerCase().trim();
  return skillsMapping[lowerCaseKeyword] || lowerCaseKeyword;
}

function mergeSkillsAndKeywords(
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

function getSplitWords(text: string, singleWordKeywords: Set<string>, multiWordKeywords: Set<string>, keywordSet: Set<string>): string[] {
  if (isChineseContent(text)) {
    return splitMixedText(text, singleWordKeywords, multiWordKeywords, keywordSet);
  } else {
    return splitEnglishText(text, singleWordKeywords, multiWordKeywords);
  }
}

// Improved function to split mixed Chinese and English text
function splitMixedText(
  text: string,
  singleWordKeywords: Set<string>,
  multiWordKeywords: Set<string>,
  keywordSet: Set<string>,
): string[] {
  // const regex = /[\u4e00-\u9fa5]+|[A-Za-z]+(?:[ ]+[A-Za-z]+)*|[\p{P}\p{Z}]+/gu;
  const regex = /[\u4e00-\u9fa5]+|[a-zA-Z0-9.-/]+(?:[ ]+[a-zA-Z0-9.-/]+)*|[\p{P}\p{Z}]/gu;

  const matchedText = text.match(regex) as RegExpMatchArray
  // console.log('matchedText', matchedText.slice(190, 220));

  const jobWords = matchedText.map(word => word.trim()).filter(Boolean);
  // console.log('jobWords', jobWords.slice(150, 190));

  const foundKeywords: Set<string> = new Set();

  // Check each word in job content, and if it's in the keywordSet, add to foundKeywords
  jobWords.forEach(word => {
    if (!containsChineseAndSymbols(word)) {
      const cleanedWord = cleanWord(word);
      // console.log('word', word);
      // console.log('cleanedWord', cleanedWord);

      // remove list marker
      const trimCleanedWord = cleanedWord.length > 1 && cleanedWord.startsWith('-') ?
        cleanedWord.slice(1).trim() :
        cleanedWord.trim()

      const lowerCaseTrimCleanedWord = trimCleanedWord.toLowerCase();
      // console.log('lowerCaseTrimCleanedWord', lowerCaseTrimCleanedWord);

      const splitedWord = lowerCaseTrimCleanedWord.split("/")

      splitedWord.forEach(word => {
        if (
          word && singleWordKeywords.has(word.trim()) ||
          word && multiWordKeywords.has(word.trim())
        ) {
          foundKeywords.add(word.trim());
        }
      })

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

interface JobInfo {
  jobTitle: string;
  salary: string;
  jobContent: string;
  otherConditions: string;
  skills: string[];
}

declare global {
  interface Window {
    extractJobInfo: () => JobInfo;
  }
}

function extractJobInfo(): JobInfo {
  const jobTitle = (document.querySelector('h1') as HTMLElement)?.innerText || 'No job title found';
  const salary = (document.querySelector('.identity-type > div[data-v-bff8d6dd] > div[data-v-bff8d6dd] > p[data-v-fb1b8854]') as HTMLElement)?.innerText || 'No salary provided';
  const jobContent = (document.querySelector('.job-description > p') as HTMLElement)?.innerText || 'No jobContent provided';
  const otherConditions = (document.querySelector('.job-requirement-table__data p') as HTMLElement)?.innerText || 'No other conditions provided';
  const skills = Array.from(document.querySelectorAll('span a.tools')).map(skill => (skill as HTMLElement).innerText) || 'No skills provided';

  return { jobTitle, salary, skills, jobContent, otherConditions };
}

(window as any).extractJobInfo = extractJobInfo;

function waitForElement(selector: string) {
  return new Promise(resolve => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver(_mutations => {
      // console.log('waitForElement MutationObserver _mutations', _mutations);
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

async function init(sendResponse: (
  response?: any) => void,
  tabInfo: TabInfo
) {
  await waitForElement('h1');
  const jobInfo = extractJobInfo();

  if (jobInfo.jobTitle === 'No job title found') return

  const keywordsArray = Object
    .values(tabInfo)
    .flatMap(category => {
      return Object
        .values(category)
        .flatMap(group => group.map(keyword => keyword.name));
    })

  const keywordSet = new Set(keywordsArray);

  const singleWordKeywords: Set<string> = new Set();
  const multiWordKeywords: Set<string> = new Set();

  Array.from(keywordSet).forEach(keyword => {
    if (keyword.includes(' ') || keyword.includes('/')) {
      multiWordKeywords.add(keyword);
    } else {
      singleWordKeywords.add(keyword);
    }
  });

  const keywordsJobContent = getSplitWords(jobInfo.jobContent, singleWordKeywords, multiWordKeywords, keywordSet);

  const keywordsOther = getSplitWords(jobInfo.otherConditions, singleWordKeywords, multiWordKeywords, keywordSet);

  const mergedSkillsAndKeywords = mergeSkillsAndKeywords(jobInfo.skills, keywordsJobContent, keywordsOther);

  if (mergedSkillsAndKeywords.length === 0) return

  const skillBadges = [...mergedSkillsAndKeywords]
    .sort()
    .map(skill => `<div style="border-radius:9999px; background:#f3f4f6; color:#ff7800; padding:4px 10px">${skill}</div>`)
    .join('')

  const keywordsElement = document.getElementById('keywords');

  displayKeywords(keywordsElement, skillBadges)

  sendResponse({
    status: 'activateSuccess',
    from: 'contentScript',
    data: { skillBadges, tabInfo }
  })
}

function displayKeywords(keywordsElement: HTMLElement | null, skillBadges: string) {
  if (!keywordsElement) {
    keywordsElement = document.createElement('div');
    keywordsElement.id = "keywords";
    Object.assign(keywordsElement.style, {
      paddingTop: "12px",
      paddingBottom: "12px",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: "8px"
    });

    const jobTitleElement = document.querySelector('h1') as HTMLElement;
    jobTitleElement?.parentNode?.insertBefore(keywordsElement, jobTitleElement.nextSibling);
  }

  /*
  There's no requirement to set the innerHTML before inserting the element into the DOM. The process of inserting the element and setting its contents are independent of each other.
  */
  keywordsElement.innerHTML = skillBadges;
}

function handleDeactivate(sendResponse: (response?: any) => void) {
  console.log("Deactivating content script...");
  const keywordsElement = document.getElementById('keywords');

  if (keywordsElement) {
    keywordsElement.innerHTML = "";
  }

  sendResponse({
    status: 'deactivateSuccess',
    from: 'contentScript',
    data: null
  })
}

function handleActivate(message: Message, sendResponse: (response?: any) => void) {
  chrome.storage.local.get('tabInfo', (result) => {
    console.log('get tabInfo', result);

    const tabInfo = {
      programming: {
        "Frontend Languages": languages,
        "Frontend Framework": framework,
        "State Management": stateManagement,
        "Libraries": libraries,
        "CSS": css,
        "Backend": backend,
        "Cloud": cloud,
        "Test": test,
        "Database": db,
        "Tools": tools,
        "Devop": devop,
        "InfoSec": infoSec,
        "Other": other,
      }
    }

    if (result.tabInfo == undefined) {
      console.log('set tabInfo');
      chrome.storage.local.set({ tabInfo: tabInfo });
    } else {
      console.log('already has tabInfo');
    }

    if (message.data) {
      console.log("Reactivating using cache data");
      const keywordsElement = document.getElementById('keywords');
      displayKeywords(keywordsElement, message.data)
      sendResponse({
        status: 'activateSuccess',
        from: 'contentScript',
        data: { tabInfo }
      })
    } else {
      console.log("Activating content script...");
      init(sendResponse, tabInfo)
    }
  });
}

chrome.runtime.onMessage.addListener((message: Message, _sender, sendResponse) => {
  console.log('contentScript onMessage', message);

  if (message.status === 'deactivate') {
    handleDeactivate(sendResponse)
  } else if (message.status === 'activate') {
    handleActivate(message, sendResponse)
  }

  return true
});