import favicon128 from '../assets/favicon_128.png';
import inactive128 from '../assets/inactive_128.png';

type KeywordBadges = string

const tabKeywordBadgesCache: { [tab: number]: KeywordBadges } = {};
const activeTabs: { [tab: number]: boolean } = {};

chrome.runtime.onInstalled.addListener((details) => {
  console.log('Job Info Extractor Extension Installed', details);
});

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
  message: Message,
  sender: chrome.runtime.MessageSender,
) {
  if (message.status === "onSuccessDataFetched") {
    handleOnSuccessDataFetched(message, sender)
  }
}

function handleOnSuccessDataFetched(
  message: Message,
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

function queueJobInfoProcessing(message: Message, tabId: number) {
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

function cacheJobInfo(message: Message, tabId: number) {
  console.log('Cache job info for tabId', tabId, tabKeywordBadgesCache);

  if (!tabKeywordBadgesCache[tabId] && message.data) {
    tabKeywordBadgesCache[tabId] = message.data;
  }
}

function handlePopup(
  message: Message,
  sendResponse: (response?: any) => void
) {
  const { status, tabId } = message

  if (status === "activate") {
    activateExtension(tabId, sendResponse)
  } else if (status === "deactivate") {
    deactivateExtension(tabId, sendResponse)
  }
}

function activateExtension(tabId: number | undefined, sendResponse?: (response?: any) => void) {
  if (!tabId) return

  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ['assets/content.js'] // Ensure content script runs when clicking the extension icon
  }, _response => {
    console.log('activate executeScript');
    chrome.action.setPopup({
      popup: "index.html"
    })

    setIcon(tabId, favicon128)

    chrome.tabs.sendMessage(tabId, {
      status: 'activate',
      from: 'serviceWorker',
      data: tabKeywordBadgesCache[tabId] ?? null
    }).then((res) => {
      // Respond to popup
      if (sendResponse) {
        sendResponse(res);
      } else {
        chrome.runtime.sendMessage({
          status: 'activateSuccess',
          from: 'serviceWorker',
          tabId: tabId
        });
      }
    }).catch(err => {
      console.log('activate err', err);

      setIcon(tabId, inactive128)
      chrome.runtime.sendMessage({
        from: 'serviceWorker',
        status: 'deactivateFailed',
        tabId: tabId,
        data: err
      });
    });

    activeTabs[tabId] = true;
  });
}

function deactivateExtension(tabId: number | undefined, sendResponse?: (response?: any) => void) {
  if (!tabId) return

  console.log(`Extension deactivated on tab ${tabId}`);
  chrome.tabs.sendMessage(tabId, {
    status: 'deactivate',
    from: 'serviceWorker',
    data: null
  }).then((res) => {
    // Respond to popup
    if (sendResponse) {
      sendResponse(res);
    } else {
      chrome.runtime.sendMessage({
        status: 'deactivateSuccess',
        from: 'serviceWorker',
        tabId: tabId
      });
    }

    setIcon(tabId, inactive128)
  }).catch(err => {
    // setIcon(tabId, favicon128)
    chrome.runtime.sendMessage({
      from: 'serviceWorker',
      status: 'deactivateFailed',
      tabId: tabId,
      data: err
    });
  });

  activeTabs[tabId] = false;
}

function setIcon(tabId: number, icon: string) {
  chrome.action.setIcon({
    tabId: tabId,
    path: {
      "128": icon,
    }
  });
}

function toggleExtension(tabId: number | undefined) {
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

    toggleExtension(tabId) // toggle on switch tab
  })
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete' || !isIn104Website(tab.url)) return

  toggleExtension(tabId) // toggle on create new tab
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabKeywordBadgesCache[tabId];  // Clean up data when a tab is closed
  delete activeTabs[tabId];  // Clean up data when a tab is closed
  console.log('delete tabId', tabId, tabKeywordBadgesCache, activeTabs);
});