import { useState, useEffect } from 'react';

interface JobInfo {
  jobTitle: string;
  salary: string;
  jobContent: string;
  skills: string[];
}

const defaultInfo = {
  jobTitle: '',
  salary: '',
  jobContent: '',
  skills: []
}

function App() {
  const [jobInfo, setJobInfo] = useState<JobInfo>(defaultInfo);

  useEffect(() => {
    function fetchJobInfo() {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTabId = tabs[0]?.id;

        chrome.runtime.sendMessage({
          status: 'getJobInfo',
          from: 'popup',
          tabId: activeTabId
        }, response => {
          console.log('useEffect', response);
          if (response.status === "jobInfoReceived") {
            setJobInfo(response.data || defaultInfo);
          }
        });
      });
    };

    fetchJobInfo();
  }, []);


  return (
    <div style={{ padding: '10px' }}>
      <h1>{jobInfo.jobTitle || 'Job Title'}</h1>
      <p>{jobInfo.jobContent ? `Job Content: ${jobInfo.jobContent}` : 'No job content info'}</p>
      <p>{jobInfo.salary ? `Salary: ${jobInfo.salary}` : 'No salary info'}</p>
      <ul>
        {jobInfo.skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
