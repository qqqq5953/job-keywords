import { getSplitWords, keywordSet, mergeSkillsAndKeywords } from "../lib/extractor";

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

// "content_scripts": [
//   {
//     "matches": [
//       "https://www.104.com.tw/job/*"
//     ],
//     "js": [
//       "assets/content.js"
//     ],
//     "run_at": "document_end"
//   }
// ]

const singleWordKeywords: Set<string> = new Set();
const multiWordKeywords: Set<string> = new Set();

// Preprocess keywords
Array.from(keywordSet).forEach(keyword => {
  // console.log('keyword', keyword);
  // const preprocessedKeyword = preprocessText(keyword)
  // console.log('preprocessedKeyword', preprocessedKeyword);

  if (keyword.includes(' ') || keyword.includes('/')) {
    multiWordKeywords.add(keyword);
  } else {
    singleWordKeywords.add(keyword);
  }
});

function extractJobInfo(): JobInfo {
  const jobTitle = (document.querySelector('h1') as HTMLElement)?.innerText || 'No job title found';
  const salary = (document.querySelector('.identity-type > div[data-v-bff8d6dd] > div[data-v-bff8d6dd] > p[data-v-fb1b8854]') as HTMLElement)?.innerText || 'No salary provided';
  const jobContent = (document.querySelector('.job-description p') as HTMLElement)?.innerText || 'No jobContent provided';
  const otherConditions = (document.querySelector('.job-requirement-table__data p') as HTMLElement)?.innerText || 'No other conditions provided';
  const skills = Array.from(document.querySelectorAll('span a.tools')).map(skill => (skill as HTMLElement).innerText) || 'No skills provided';

  return { jobTitle, salary, skills, jobContent, otherConditions };
}

(window as any).extractJobInfo = extractJobInfo;

function sendMessageToWorker(jobInfo: JobInfo) {
  chrome.runtime.sendMessage({
    status: "onSuccessDataFetched",
    from: "contentScript",
    data: jobInfo
  }, response => {
    if (chrome.runtime.lastError) {
      console.log("Could not establish connection: ", chrome.runtime.lastError.message);
    } else {
      console.log("Message sent successfully", response);
    }
  });
}

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

async function init() {
  await waitForElement('h1');
  const jobInfo = extractJobInfo();

  if (jobInfo.jobTitle !== 'No job title found') {
    sendMessageToWorker(jobInfo);

    // Insert skills beside the job title
    const keywordsJobContent = getSplitWords(jobInfo.jobContent, singleWordKeywords, multiWordKeywords);

    const keywordsOther = getSplitWords(jobInfo.otherConditions, singleWordKeywords, multiWordKeywords);

    const jobTitleElement = document.querySelector('h1') as HTMLElement;

    const mergedSkillsAndKeywords = mergeSkillsAndKeywords(jobInfo.skills, keywordsJobContent, keywordsOther);

    if (mergedSkillsAndKeywords.length !== 0) {
      const keywordsElement = document.createElement('div');

      keywordsElement.id = "keyword"
      keywordsElement.style.paddingTop = "12px"
      keywordsElement.style.paddingBottom = "12px"
      keywordsElement.style.display = "flex"
      keywordsElement.style.flexWrap = "wrap"
      keywordsElement.style.alignItems = "center"
      keywordsElement.style.gap = "8px"

      const skillBadges = [...mergedSkillsAndKeywords]
        .sort()
        .map(skill => `<div style="border-radius:9999px; background:#f3f4f6; color:#ff7800; padding:4px 10px">${skill}</div>`)
        .join('')

      keywordsElement.innerHTML = skillBadges
      jobTitleElement?.parentNode?.insertBefore(keywordsElement, jobTitleElement.nextSibling);
    }
  }

  // Set up the MutationObserver for future changes
  // const observer = new MutationObserver(() => {
  //   const updatedJobInfo = extractJobInfo();
  //   console.log('init MutationObserver updatedJobInfo', updatedJobInfo);

  //   if (updatedJobInfo.jobTitle !== 'No job title found') {
  //     sendMessageToWorker(updatedJobInfo);
  //   }
  // });

  // observer.observe(document.body, { childList: true, subtree: true });
}

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('contentScript onMessage', message);

  if (message.status === 'requestForNewData') {
    console.log('requestForNewData');
    const updatedJobInfo = extractJobInfo();
    sendMessageToWorker(updatedJobInfo);
  } else if (message.status === 'passOnCacheData') {
    console.log('use cache data');
    sendMessageToWorker(message.data);
  } else if (message.status === 'deactivate') {
    console.log("Deactivating content script...");
    const keyword = document.getElementById('keyword') as HTMLElement;

    if (keyword) {
      keyword.innerHTML = "";
    }
  } else if (message.status === 'activate') {
    console.log("Reactivating content script...");
    init(); // Reinitalize the script to show keywords again
  }
});
