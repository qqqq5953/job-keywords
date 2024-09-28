import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

import { MdOutlineLibraryAdd } from "react-icons/md";

import { backend, cloud, css, db, devop, framework, infoSec, languages, libraries, other, stateManagement, test, tools } from "./lib/defaultCategories";
import DialogAddGroup from "./components/DialogAddGroup";
import Group from "./components/Group";
import DropdownCategoryOptions from "./components/DropdownCategoryOptions";

function App() {
  const [isActivate, setIsActivate] = useState(false)
  const [currentTab, setCurrentTab] = useState("programming")

  // Change the state to use an object to manage categories and keywords
  const [tabInfo, setTabInfo] = useState<Record<string, Record<string, Keyword[]>>>({
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
  });

  const tabs = Object.keys(tabInfo)
  const selectedTabInfo = tabInfo[currentTab]

  function deactivate(isChecked: boolean) {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;

      chrome.runtime.sendMessage({
        status: 'deactivate',
        from: 'popup',
        tabId: activeTabId
      }, response => {
        const state = response.status === "deactivateSuccess" ? isChecked : !isChecked

        setIsActivate(state)
        chrome.storage?.local.set({ switchState: state });
      });
    });
  }

  function activate(isChecked: boolean) {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;

      chrome.runtime.sendMessage({
        status: 'activate',
        from: 'popup',
        tabId: activeTabId
      }, response => {
        const state = response.status === "activateSuccess" ? isChecked : !isChecked

        setIsActivate(state)
        chrome.storage?.local.set({ switchState: state });
      });
    });
  }

  function handleToggle(isChecked: boolean) {
    if (isChecked) {
      activate(isChecked)
    } else {
      deactivate(isChecked)
    }
  };

  useEffect(() => {
    // Load the switch state from Chrome storage when the component mounts
    chrome.storage?.local.get('switchState', (result) => {
      if (result.switchState !== undefined) {
        setIsActivate(result.switchState);
      }
    });
  }, []);

  function addCategory() {
    let newTitle = "Untitled";

    setTabInfo(prev => {
      let count = 0;

      while (tabs.indexOf(newTitle) !== -1) {
        count++;
        newTitle = `Untitled${count}`;
      }

      return {
        ...prev,
        [newTitle]: {}
      }
    })

    setCurrentTab(newTitle)
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 gap-4'>
      <div className="relative w-full">
        <h1 className="text-2xl text-center font-semibold">Keywords Extractor</h1>
        <div className="absolute top-2 right-0 flex items-center gap-2 text-xs">
          <span>{isActivate ? "On" : "Off"}</span>
          <Switch
            checked={isActivate}
            onCheckedChange={(isChecked) => handleToggle(isChecked)}
          />
        </div>
      </div>
      <p className="text-neutral-600 text-center">An extension for 104 job search website to extract <span className="font-semibold">ENGLISH</span> keywords from job description. Default to programming job.</p>
      <div className="text-xs">
        Todo:
        <ul className="list-disc list-inside">
          <li>Detect css class on screen size change</li>
          <li>https://www.104.com.tw/job/3twld?jobsource=tab_cs_to_job 中文抓不到關鍵字如 jquery / React Native</li>
        </ul>
      </div>
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <div className="flex items-center">
          <div className="max-w-[400px] overflow-auto pt-4 pb-4">
            <TabsList className="grow flex justify-start w-fit">
              {[...tabs].reverse().map(tab => {
                return <TabsTrigger
                  key={tab}
                  value={tab}
                  className="capitalize"
                >
                  {tab}
                </TabsTrigger>
              })}
            </TabsList>
          </div>
          <div className="shrink-0 grow flex items-center justify-between">
            <Button
              className="text-neutral-700 hover:text-blue-600 hover:bg-transparent duration-300"
              variant="ghost"
              onClick={addCategory}
            >
              <MdOutlineLibraryAdd size={20} />
            </Button>
            <DropdownCategoryOptions
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
              setTabInfo={setTabInfo}
            />
          </div>
        </div>

        {tabs.map(tab => {
          return <TabsContent
            key={tab}
            value={tab}
            className="pt-8 border-t"
          >
            <DialogAddGroup
              tabInfo={tabInfo}
              setTabInfo={setTabInfo}
              currentTab={currentTab}
            />

            <ul className="flex flex-col gap-5">
              {Object.entries(selectedTabInfo).map(([groupName, categorySet]) => (
                <Group
                  key={groupName}
                  groupName={groupName}
                  currentTab={currentTab}
                  tabInfo={tabInfo}
                  setTabInfo={setTabInfo}
                  categorySet={categorySet}
                />
              ))}
            </ul >
            {/* <pre className="text-xs">{JSON.stringify(tabInfo, null, 2)}</pre> */}
          </TabsContent >
        })}
      </Tabs >
    </div >
  );
}

export default App;
