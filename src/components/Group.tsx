import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { RiAddLargeFill, RiEditLine } from 'react-icons/ri'
import DropdownGroupOptions from './DropdownGroupOptions'
import KeywordBadge from './KeywordBadge'
import { Input } from './ui/input'

type Props = {
  groupName: string
  currentTab: string
  tabInfo: Record<string, Record<string, Keyword[]>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
  categorySet: Keyword[]
}

export default function Group(props: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const groupNameRef = useRef<HTMLInputElement>(null)
  const [alert, setAlert] = useState("")

  function addKeyword() {
    props.setTabInfo(prev => {
      let count = 0;
      let newKeyword = "New Keyword";

      // Check for existing keywords in the category
      const existingKeywords = prev[props.currentTab][props.groupName].map(keyword => keyword.name);

      // Count how many "New Keyword" entries exist and find a unique keyword
      while (existingKeywords.indexOf(newKeyword) !== -1) {
        count++;
        newKeyword = `New Keyword${count}`;
      }

      return {
        ...prev,
        [props.currentTab]: {
          ...prev[props.currentTab],
          [props.groupName]: [...prev[props.currentTab][props.groupName], {
            belongsTo: props.groupName,
            name: newKeyword
          }],
        }
      };
    });
  }

  function editGroupName(newGroupName: string) {
    if (!newGroupName || props.groupName === newGroupName) {
      return setIsEditing(false);
    }

    const isGroupAlreadyExist = props.tabInfo[props.currentTab][newGroupName]

    if (isGroupAlreadyExist) {
      return setAlert("Group name alreay exists")
    }

    const currentGroup = props.tabInfo[props.currentTab][props.groupName]

    props.setTabInfo(prev => {
      const {
        [props.groupName]: currentGroupName,
        ...rest
      } = prev[props.currentTab]

      return {
        ...prev,
        [props.currentTab]: {
          [newGroupName]: currentGroup,
          ...rest,
        }
      };
    })

    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing) {
      groupNameRef.current?.select()
    }
  }, [isEditing])

  return (
    <li className="relative flex flex-col gap-4 items-center p-4 rounded-lg bg-neutral-50 shadow-md shadow-neutral-200 border border-neutral-100">
      <div className='flex items-center gap-1'>
        {
          isEditing ?
            <div>
              <Input
                defaultValue={props.groupName}
                ref={groupNameRef}
                className='h-auto min-w-0 text-xs shadow-none focus-within:border-none px-2 py-1'
                onBlur={(e) => editGroupName(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editGroupName(groupNameRef.current!.value.trim())
                  } else if (e.key === "Escape") {
                    setIsEditing(false)
                  }
                }}
              />
              {alert && <span className='text-amber-500 text-xs ml-1'>{alert}</span>}
            </div> :
            <div className="font-semibold">{props.groupName}</div>
        }
        <Button
          size="sm"
          variant="ghost"
          className='p-1.5 h-auto group duration-300 hover:text-blue-500'
          onClick={() => setIsEditing(true)}
        >
          <RiEditLine size={14} />
        </Button>
      </div>

      <DropdownGroupOptions
        groupName={props.groupName}
        setTabInfo={props.setTabInfo}
        currentTab={props.currentTab}
      />

      <div className="flex gap-2.5 items-center flex-wrap">
        {Array.from(props.categorySet).map((keyword, index) => (
          <KeywordBadge
            key={index}
            keyword={keyword}
            tabInfo={props.tabInfo}
            setTabInfo={props.setTabInfo}
            currentTab={props.currentTab}
          />
        ))}
        <Button
          size="sm"
          variant="ghost"
          onClick={addKeyword}
          className="text-neutral-500 group duration-300"
        >
          <RiAddLargeFill size={14} className='group-hover:stroke-1 group-hover:text-blue-500' />
        </Button>
      </div>
    </li>
  )
}
