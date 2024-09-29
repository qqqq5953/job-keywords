/// <reference types="vite/client" />

type Message = {
  status: 'activate' | 'deactivate' | 'onSuccessDataFetched' | 'reactivate',
  from: 'popup' | 'contentScript' | 'serviceWorker',
  data: string | null
  tabId?: number
}

type Keyword = {
  belongsTo: string;
  name: string;
}

type TabInfo = Record<string, Record<string, Keyword[]>>