// import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { backend, cloud, css, db, devop, framework, infoSec, languages, libraries, other, stateManagement, test, tools } from "./lib/extractor";
import { useState } from "react";
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

  function addKeyword(categoryName: string, keyword?: string) {
    setFrontendTab(prev => {
      return prev.map(category => {
        if (category.name === categoryName) {
          const untitledIndex = category.keywords.lastIndexOf("Untitled")

          return {
            name: category.name,
            keywords: untitledIndex !== -1 ?
              [...category.keywords.slice(0, untitledIndex), `${keyword}`] :
              [...category.keywords, "Untitled"]
          }
        } else {
          return category
        }
      })
    })
  }

  // const frontendTab = useMemo(() => {
  //   return [
  //     { name: "Frontend Framework", keywords: framework.sort() },
  //     { name: "State Management", keywords: stateManagement.sort() },
  //     { name: "Frontend Languages", keywords: languages.sort() },
  //     { name: "Libraries", keywords: libraries.sort() },
  //     { name: "CSS", keywords: css.sort() },
  //     { name: "Backend", keywords: backend.sort() },
  //     { name: "Cloud", keywords: cloud.sort() },
  //     { name: "Test", keywords: test.sort() },
  //     { name: "Database", keywords: db.sort() },
  //     { name: "Tools", keywords: tools.sort() },
  //     { name: "Devop", keywords: devop.sort() },
  //     { name: "InfoSec", keywords: infoSec.sort() },
  //     { name: "Other", keywords: other.sort() },
  //   ]
  // }, [])

  function deactivate() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
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

  // useEffect(() => {
  //   function fetchJobInfo() {
  //     chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //       const activeTabId = tabs[0]?.id;

  //       chrome.runtime.sendMessage({
  //         status: 'getJobInfo',
  //         from: 'popup',
  //         tabId: activeTabId
  //       }, response => {
  //         console.log('useEffect', response);
  //         if (response.status === "jobInfoReceived") {
  //           setJobInfo(response.data || defaultInfo);
  //         }
  //       });
  //     });
  //   };

  //   // fetchJobInfo();
  // }, []);


  return (
    <div className='flex flex-col items-center p-4 gap-4'>
      <div className="relative w-full">
        <h1 className="text-2xl text-center font-semibold">Keywords extractor</h1>
        <Button
          onClick={deactivate}
          size="sm"
          variant="secondary"
          className="absolute top-0 right-0 text-xs"
        >
          Deactivate
        </Button>
      </div>
      <div>
        <h3 className="text-lg text-center font-semibold pb-4">Built-in categories</h3>
        <Tabs defaultValue="programming" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="programming">Programming</TabsTrigger>
          </TabsList>
          <TabsContent value="programming">
            <ul className="flex flex-col gap-4">
              {frontendTab.map((category) => {
                return <li key={category.name} className="flex flex-col gap-4 items-center bg-neutral-100 p-4 rounded-lg">
                  <div className="font-semibold shrink-0">{category.name}</div>
                  <div className="flex gap-2 items-center flex-wrap">
                    {category.keywords.map((keyword, index) => {
                      return <KeywordBadge
                        key={index}
                        keyword={keyword}
                        category={category}
                        editKeyword={editKeyword}
                      />
                    })}
                    <Button size="sm" variant="ghost" onClick={() => addKeyword(category.name)}>+</Button>
                  </div>
                </li>
              })}
            </ul>
            <pre className="text-xs">{JSON.stringify(frontendTab, null, 2)}</pre>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default App;
