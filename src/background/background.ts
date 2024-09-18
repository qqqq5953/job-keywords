import favicon128 from '../assets/favicon_128.png';
import inactive128 from '../assets/inactive_128.png';

interface JobInfo {
  jobTitle: string;
  salary: string;
  jobContent: string;
  skills: string[];
}

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Job Info Extractor Extension Installed', details);
});

const tabJobInfoCache: { [key: number]: JobInfo } = {};
const activeTabs: { [key: number]: boolean } = {};

// chrome.action.onClicked.addListener((tab) => {
//   if (!tab.id || !tab.url?.includes('https://www.104.com.tw/job')) return;

//   chrome.action.setPopup({
//     popup: "index.html"
//   })
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background script:", message);

  const messageProcessorMap: Record<string, () => void> = {
    contentScript: handleContentScript.bind(null, message, sender),
    popup: handlePopup.bind(null, message, sendResponse)
  }

  const messageProcessor = messageProcessorMap[message.from]
  if (messageProcessor) messageProcessor()

  /*
  If you're waiting for an asynchronous operation (such as chrome.tabs.query, chrome.scripting.executeScript, etc.) before sending a response, use "return true" to indicate an asynchronous response.
  */
  return true;
});

function handleContentScript(
  message: any,
  sender: chrome.runtime.MessageSender,
) {
  if (message.status === "onSuccessDataFetched") {
    handleOnSuccessDataFetched(message, sender)
  }
}

function handleOnSuccessDataFetched(
  message: any,
  sender: chrome.runtime.MessageSender
) {
  if (!sender.tab || !sender.tab.id) return;

  const tabId = sender.tab.id;

  // Check if the content script has been injected in the tab
  chrome.scripting.executeScript({
    target: { tabId },
    func: () => !!window.extractJobInfo,  // Check if extractJobInfo exists
  }, (results) => {
    if (!results || !results[0]?.result) {
      console.log("Content script not injected, skipping message send.");
      return
    }

    queueJobInfoProcessing(message, tabId);
  });
}

let requestQueue: { tabId: number, resolve: Function }[] = [];
let requestTimeout: number | null = null;

function queueJobInfoProcessing(message: any, tabId: number) {
  console.log('queueJobInfoProcessing', message);

  // Add request to the queue for batching
  requestQueue.push({ tabId, resolve: () => cacheJobInfo(message, tabId) });

  if (!requestTimeout) {
    requestTimeout = setTimeout(() => processBatch(), 200);  // Process requests after 200ms
  }
}

function processBatch() {
  requestTimeout = null;

  // Filter unique requests (avoid duplicate tabIds)
  const uniqueRequests = [...new Map(requestQueue.map(req => [req.tabId, req])).values()];
  requestQueue = [];

  console.log('processBatch uniqueRequests', uniqueRequests);

  // Process each unique request
  uniqueRequests.forEach(req => req.resolve());
}

function cacheJobInfo(message: any, tabId: number) {
  console.log('Cache job info for tabId', tabId, tabJobInfoCache);

  if (!tabJobInfoCache[tabId]) {
    tabJobInfoCache[tabId] = message.data;
  }
}

function handlePopup(
  message: any,
  sendResponse: (response?: any) => void
) {
  const { status, tabId } = message

  if (status === "getJobInfo" && tabId) {
    const jobInfo = tabJobInfoCache[tabId]

    sendResponse({
      status: "jobInfoReceived",
      from: 'serviceWorker',
      data: jobInfo
    });
  }

  if (status === "deactivate" && tabId) {
    deactivateExtension(tabId)
  }

  if (status === "activate" && tabId) {
    activateExtension(tabId)
  }

  if (status === 'getSwitchState') {
    chrome.storage.local.get('switchState', (result) => {
      sendResponse(result.switchState);
    });
    return true;  // Indicates asynchronous response
  }
}

function activateExtension(tabId: number | undefined) {
  if (!tabId) return

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['assets/content.js']  // Ensure content script runs when clicking the extension icon
  }, _response => {
    console.log('activate executeScript');
    chrome.action.setPopup({
      popup: "index.html"
    })

    chrome.action.setIcon({
      tabId: tabId,
      path: {
        "128": favicon128,
      }
    });

    chrome.tabs.sendMessage(tabId, {
      status: 'activate',
      from: 'serviceWorker',
      data: null
    });

    activeTabs[tabId] = true;
  });
}

function deactivateExtension(tabId: number | undefined) {
  if (!tabId) return

  console.log(`Extension deactivated on tab ${tabId}`);
  chrome.tabs.sendMessage(tabId, {
    status: 'deactivate',
    from: 'serviceWorker',
    data: null
  });

  chrome.action.setIcon({
    tabId: tabId,
    path: {
      "128": inactive128,
    }
  });

  activeTabs[tabId] = false;
}

function toggleExtension(tabId: number | undefined) {
  if (!tabId) return

  chrome.storage.local.get('switchState', (result) => {
    if (result.switchState) {
      activateExtension(tabId);
    } else {
      deactivateExtension(tabId)
    }
  });
}

function isIn104Website(tabUrl: string | undefined) {
  return tabUrl?.includes('https://www.104.com.tw/job')
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  console.log('activeInfo', activeInfo);
  const tabId = activeInfo.tabId;

  // Get information about the active tab
  chrome.tabs.get(tabId, (tab) => {
    const tabUrl = tab.url || ''; // Ensure the URL is available

    if (!isIn104Website(tabUrl)) {
      return console.log('Non-job-search tab activated, ignoring.');
    }

    // toggle on switch tab
    toggleExtension(tabId)

    // const jobInfo = tabJobInfoCache[tabId]

    // // the message is sent from the background script to the contentScript in the specified tab.
    // if (jobInfo) {
    //   chrome.tabs.sendMessage(tabId, {
    //     status: 'passOnCacheData',
    //     from: 'serviceWorker',
    //     data: jobInfo
    //   });
    // } else {
    //   chrome.tabs.sendMessage(tabId, {
    //     status: 'requestForNewData',
    //     from: 'serviceWorker',
    //     data: null
    //   });
    // }
  })
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !isIn104Website(tab.url)) return
  // toggle on create new tab
  toggleExtension(tabId)
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabJobInfoCache[tabId];  // Clean up data when a tab is closed
  delete activeTabs[tabId];  // Clean up data when a tab is closed
  console.log('delete tabId', tabId, tabJobInfoCache, activeTabs);
});