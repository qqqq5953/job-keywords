import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

import { RiAddLargeFill } from "react-icons/ri";
import { MdOutlineLibraryAdd } from "react-icons/md";

import { backend, cloud, css, db, devop, framework, infoSec, languages, libraries, other, stateManagement, test, tools } from "./lib/defaultCategories";
import KeywordBadge from "./components/KeywordBadge";
import DialogAddGroup from "./components/DialogAddGroup";

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

  const selectedTabInfo = tabInfo[currentTab]

  function addKeyword(groupName: string) {
    setTabInfo(prev => {
      let count = 0;
      let newKeyword = "New Keyword";

      // Check for existing keywords in the category
      const existingKeywords = prev[currentTab][groupName].map(keyword => keyword.name);

      // Count how many "New Keyword" entries exist and find a unique keyword
      while (existingKeywords.indexOf(newKeyword) !== -1) {
        count++;
        newKeyword = `New Keyword${count}`;
      }

      return {
        ...prev,
        [currentTab]: {
          ...prev[currentTab],
          [groupName]: [...prev[currentTab][groupName], {
            belongsTo: groupName,
            name: newKeyword
          }], // Add the new keyword to the Set
        }
      };
    });
  }

  function deactivate() {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;

      chrome.runtime.sendMessage({
        status: 'deactivate',
        from: 'popup',
        tabId: activeTabId
      }, response => {
        if (response.status === "deactivate") {
          alert('deactivate success')
        }
      });
    });
  }

  function activate() {
    chrome.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTabId = tabs[0]?.id;

      chrome.runtime.sendMessage({
        status: 'activate',
        from: 'popup',
        tabId: activeTabId
      }, response => {
        if (response.status === "activate") {
          alert('activate success')
        }
      });
    });
  }

  function handleToggle(isChecked: boolean) {
    setIsActivate(isChecked)

    if (isChecked) {
      activate()
    } else {
      deactivate()
    }

    // Save the new state to Chrome storage
    chrome.storage?.local.set({ switchState: isChecked });
  };

  useEffect(() => {
    // Load the switch state from Chrome storage when the component mounts
    chrome.storage?.local.get('switchState', (result) => {
      if (result.switchState !== undefined) {
        setIsActivate(result.switchState);
      }
    });
  }, []);

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
          <li>每個關鍵字加上 category 紀錄屬於哪個類別：
            <div>1. 改變儲存標籤的資料結構以減少 CRUD 時間複雜度</div>
            <div>2. 前台可以用 groupBy() 分類標籤</div>
          </li>
        </ul>
      </div>
      <div className="relative">
        <Button className="absolute top-0 right-0 gap-1 text-xs hover:text-blue-600 hover:bg-transparent duration-300" variant="ghost">
          <MdOutlineLibraryAdd size={16} /> Add Keyword
        </Button>

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="programming" className="capitalize">{currentTab}</TabsTrigger>
          </TabsList>
          <TabsContent value="programming" className="pt-8 border-t">
            <DialogAddGroup
              tabInfo={tabInfo}
              setTabInfo={setTabInfo}
              currentTab={currentTab}
            />

            <ul className="flex flex-col gap-5">
              {Object.entries(selectedTabInfo).map(([groupName, categorySet]) => (
                <li key={groupName} className="relative flex flex-col gap-4 items-center p-4 rounded-lg bg-neutral-50 shadow-md shadow-neutral-200 border border-neutral-100">
                  <div className="font-semibold shrink-0">{groupName}</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addKeyword(groupName)}
                    className="absolute right-6 top-3 hover:text-orange-500 duration-300"
                  >
                    <RiAddLargeFill size={16} />
                  </Button>
                  <div className="flex gap-2.5 items-center flex-wrap">
                    {Array.from(categorySet).map((keyword, index) => (
                      <KeywordBadge
                        key={index}
                        keyword={keyword}
                        tabInfo={tabInfo}
                        setTabInfo={setTabInfo}
                        currentTab={currentTab}
                      />
                    ))}
                  </div>
                </li>
              ))}
              {/* {programmingTab.map((category) => {
              return <li key={category.name} className="relative flex flex-col gap-4 items-center bg-neutral-100 p-4 rounded-lg">
                <div className="font-semibold shrink-0">{category.name}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addKeyword(category.name)}
                  className="absolute right-6 top-3 hover:text-orange-500"
                >
                  <RiAddLargeFill size={16} />
                </Button>
                <div className="flex gap-2 items-center flex-wrap">
                  {Array.from(category.keywords).map((keyword, index) => {
                    return <KeywordBadge
                      key={index}
                      keyword={keyword}
                      category={category}
                      editKeyword={editKeyword}
                      deleteKeyword={deleteKeyword}
                    />
                  })}
                </div>
              </li>
            })} */}
            </ul>
            <pre className="text-xs">{JSON.stringify(tabInfo, null, 2)}</pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
