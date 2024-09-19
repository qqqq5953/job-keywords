/// <reference types="vite/client" />

type Message = {
  status: 'activate' | 'deactivate' | 'onSuccessDataFetched',
  from: 'popup' | 'contentScript' | 'serviceWorker',
  data: string | null
  tabId?: number
}