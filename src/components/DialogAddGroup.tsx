import { SetStateAction, Dispatch, useState, ChangeEvent } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { MdPostAdd } from 'react-icons/md'
import { Label } from './ui/label'
import { Input } from './ui/input'
import KeywordBadgeUngrouped from './KeywordBadgeUngrouped'
import { RiAddLargeFill } from 'react-icons/ri'

type Props = {
  tabInfo: Record<string, Record<string, Keyword[]>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
  currentTab: string
}

export default function DialogAddGroup(props: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [groupName, setGroupName] = useState<string>("Untitled")
  const [keywords, setKeywords] = useState<Keyword[]>([{
    belongsTo: groupName,
    name: "New Keyword"
  }]);
  const [alert, setAlert] = useState({
    groupName: "",
    keywords: ""
  })

  function addGroup() {
    const warning = {
      groupName: "",
      keywords: ""
    }

    if (keywords.length === 0) {
      warning.keywords = "Keyword is required"
    }

    if (!groupName) {
      warning.groupName = "Group Name is required"
    }

    if (props.tabInfo[props.currentTab][groupName]) {
      warning.groupName = "Group Name already exists"
    }

    if (warning.groupName || warning.keywords) {
      return setAlert(warning)
    }

    // add groupName
    const keywordsWithGroupName = keywords.map(keyword => {
      return {
        belongsTo: groupName,
        name: keyword.name
      }
    })

    props.setTabInfo(prev => {
      return {
        ...prev,
        [props.currentTab]: {
          [groupName]: keywordsWithGroupName,
          ...prev[props.currentTab],
        }
      }
    });

    setIsOpen(false)
    setAlert({
      groupName: "",
      keywords: ""
    })
  }

  function addKeyword() {
    setKeywords(prev => {
      let count = 0;
      let newKeyword = "New Keyword";

      const existingKeywords = keywords.map(keyword => keyword.name);

      while (existingKeywords.indexOf(newKeyword) !== -1) {
        count++;
        newKeyword = `New Keyword${count}`;
      }

      return [...prev, {
        belongsTo: groupName,
        name: newKeyword
      }]
    })

    setAlert(prev => ({
      ...prev,
      keywords: ""
    }))
  }

  function handleGroupNameChange(e: ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value)

    if (e.target.value == null || e.target.value === "") {
      setAlert(prev => ({
        ...prev,
        groupName: "Group Name is required"
      }))
      return
    }

    setAlert(prev => ({
      ...prev,
      groupName: ""
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full text-xs mb-4 gap-1"
        >
          <MdPostAdd size={16} /> Add Group
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Group Name</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <div>
            <Label htmlFor="Keyword name">Group Name</Label>
            <Input value={groupName} onChange={handleGroupNameChange} id="Keyword name" placeholder="Keyword name" className="mt-1" />
            {alert.groupName && <span className='text-amber-500 text-xs ml-1'>{alert.groupName}</span>}
          </div>
          <div className="flex items-center pt-2">
            <div className="flex flex-wrap gap-2">
              {keywords.length !== 0 && keywords.map((keyword, index) => (
                <KeywordBadgeUngrouped
                  key={index}
                  keyword={keyword}
                  setKeywords={setKeywords}
                />
              ))}
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={addKeyword}
              className="gap-1 hover:text-blue-600 hover:bg-transparent duration-300 ml-2"
            >
              <RiAddLargeFill /> Add Keyword
            </Button>
          </div>
          {alert.keywords && <div className='text-amber-500 text-xs ml-1'>{alert.keywords}</div>}
        </div>
        <DialogFooter className="gap-2 pt-3">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button className="bg-blue-600 hover:bg-blue-600/90" onClick={addGroup}>Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
