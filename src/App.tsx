import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

import { RiAddLargeFill } from "react-icons/ri";

import { backend, cloud, css, db, devop, framework, infoSec, languages, libraries, other, stateManagement, test, tools } from "./lib/defaultCategories";
import KeywordBadge from "./components/KeywordBadge";

type Category = {
  belongsTo: string;
  keyword: string;
}

function App() {
  const [isActivate, setIsActivate] = useState(false)

  // Change the state to use an object to manage categories and keywords
  const [frontendTab, setFrontendTab] = useState<Record<string, Category[]>>({
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
  });

  function editKeyword(categoryName: string, oldKeyword: string, newKeyword: string) {
    if (oldKeyword === newKeyword) return;

    const alreadyExist = [...frontendTab[categoryName]].some(item => item.keyword === newKeyword)

    if (alreadyExist) return

    setFrontendTab(prev => {
      const updatedCategory = prev[categoryName].map(item => {
        // find target keyword and change it
        if (item.keyword === oldKeyword) {
          return { ...item, keyword: newKeyword };
        }

        return item;
      });

      return {
        ...prev,
        [categoryName]: updatedCategory,
      };
    });
  }

  function addKeyword(categoryName: string) {
    setFrontendTab(prev => {
      let count = 0;
      let newKeyword = "Untitled";

      // Check for existing keywords in the category
      const existingKeywords = prev[categoryName].map(item => item.keyword);

      // Count how many "Untitled" entries exist and find a unique keyword
      while (existingKeywords.indexOf(newKeyword) !== -1) {
        count++;
        newKeyword = `Untitled${count}`;
      }

      return {
        ...prev,
        [categoryName]: [...prev[categoryName], {
          belongsTo: categoryName,
          keyword: newKeyword
        }], // Add the new keyword to the Set
      };
    });
  }

  function deleteKeyword(categoryName: string, deletedKeyword: string) {
    setFrontendTab(prev => {
      const updatedCategory = prev[categoryName].filter(item => item.keyword !== deletedKeyword);

      return {
        ...prev,
        [categoryName]: updatedCategory,
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
      <Tabs defaultValue="programming">
        <TabsList>
          <TabsTrigger value="programming">Programming</TabsTrigger>
        </TabsList>
        <TabsContent value="programming">
          <ul className="flex flex-col gap-4">
            {Object.entries(frontendTab).map(([categoryName, categorySet]) => (
              <li key={categoryName} className="relative flex flex-col gap-4 items-center bg-neutral-100 p-4 rounded-lg">
                <div className="font-semibold shrink-0">{categoryName}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => addKeyword(categoryName)}
                  className="absolute right-6 top-3 hover:text-orange-500"
                >
                  <RiAddLargeFill size={16} />
                </Button>
                <div className="flex gap-2 items-center flex-wrap">
                  {Array.from(categorySet).map((category, index) => (
                    <KeywordBadge
                      key={index}
                      category={category}
                      editKeyword={editKeyword}
                      deleteKeyword={deleteKeyword}
                    />
                  ))}
                </div>
              </li>
            ))}
            {/* {frontendTab.map((category) => {
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
          {/* <pre className="text-xs">{JSON.stringify(frontendTab, null, 2)}</pre> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
