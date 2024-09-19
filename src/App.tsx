import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

import { RiAddLargeFill } from "react-icons/ri";

import { backend, cloud, css, db, devop, framework, infoSec, languages, libraries, other, stateManagement, test, tools } from "./lib/defaultCategories";
import KeywordBadge from "./components/KeywordBadge";

// interface JobInfo {
//   jobTitle: string;
//   salary: string;
//   jobContent: string;
//   skills: string[];
// }

// const defaultInfo = {
//   jobTitle: '',
//   salary: '',
//   jobContent: '',
//   skills: []
// }

function App() {
  // const [jobInfo, setJobInfo] = useState<JobInfo>(defaultInfo);
  const [isActivate, setIsActivate] = useState(false)

  const [frontendTab, setFrontendTab] = useState([
    { name: "Frontend Framework", keywords: framework.sort() },
    { name: "State Management", keywords: stateManagement.sort() },
    { name: "Frontend Languages", keywords: languages.sort() },
    { name: "Libraries", keywords: libraries.sort() },
    { name: "CSS", keywords: css.sort() },
    { name: "Backend", keywords: backend.sort() },
    { name: "Cloud", keywords: cloud.sort() },
    { name: "Test", keywords: test.sort() },
    { name: "Database", keywords: db.sort() },
    { name: "Tools", keywords: tools.sort() },
    { name: "Devop", keywords: devop.sort() },
    { name: "InfoSec", keywords: infoSec.sort() },
    { name: "Other", keywords: other.sort() },
  ]);

  function editKeyword(categoryName: string, oldKeyword: string, newKeyword: string) {
    if (oldKeyword === newKeyword) return

    setFrontendTab(prev => {
      return prev.map(category => {
        if (category.name === categoryName) {
          const newKeywords = category.keywords.map(keyword => {
            if (keyword === oldKeyword) {
              return newKeyword
            } else {
              return keyword
            }
          })

          return {
            ...category,
            keywords: newKeywords
          }
        } else {
          return category
        }
      })
    })
  }

  function addKeyword(categoryName: string) {
    setFrontendTab(prev => {
      return prev.map(category => {
        if (category.name === categoryName) {
          const untitledIndex = category.keywords.lastIndexOf("Untitled")
          console.log('untitledIndex', untitledIndex);
          const lastIndex = category.keywords.length - 1

          const append = untitledIndex !== -1 ?
            `Untitled ${lastIndex - untitledIndex + 1}` :
            "Untitled"

          return {
            name: category.name,
            keywords: [...category.keywords, append]
          }
        } else {
          return category
        }
      })
    })
  }

  function deleteKeyword(categoryName: string, deletedKeyword: string) {
    setFrontendTab(prev => {
      return prev.map(category => {
        if (category.name === categoryName) {
          const newKeywords = category.keywords.filter(keyword => {
            return keyword !== deletedKeyword
          })

          return {
            ...category,
            keywords: newKeywords
          }
        } else {
          return category
        }
      })
    })
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
    console.log('chrome.storage', chrome.storage);

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
          <li>每個類別用 set 取代 array 存，過濾重複的標籤</li>
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
            {frontendTab.map((category) => {
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
                  {category.keywords.map((keyword, index) => {
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
            })}
          </ul>
          {/* <pre className="text-xs">{JSON.stringify(frontendTab, null, 2)}</pre> */}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;
