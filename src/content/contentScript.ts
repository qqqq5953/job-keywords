import { getSplitWords, tabInfo, mergeSkillsAndKeywords } from "../lib/extractor";

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

function getMergedSkillsAndKeywords(jobInfo: JobInfo) {
  const keywordsArray = Object
    .values(tabInfo)
    .flatMap(category => {
      return Object
        .values(category)
        .flatMap(group => group.map(keyword => keyword.name));
    })

  // Keywords stored in a Set for O(1) lookup time
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

  return mergeSkillsAndKeywords(jobInfo.skills, keywordsJobContent, keywordsOther);
}

async function init(sendResponse: (
  response?: any) => void,
  tabInfo: TabInfo
) {
  await waitForElement('h1');
  const jobInfo = extractJobInfo();

  if (jobInfo.jobTitle === 'No job title found') return

  const mergedSkillsAndKeywords = getMergedSkillsAndKeywords(jobInfo)

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