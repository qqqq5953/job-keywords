import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { RxCross1 } from "react-icons/rx";
import { Button } from './ui/button';

type Props = {
  keyword: Keyword
  tabInfo: Record<string, Record<string, Keyword[]>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
  currentTab: string
}

export default function KeywordBadge(props: Props) {
  const {
    belongsTo: groupName,
    name: currentKeyword
  } = props.keyword

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function editKeyword(newKeyword: string) {
    console.log('newKeyword', newKeyword);

    if (!newKeyword || currentKeyword === newKeyword) return setIsEditing(false);

    const group = props.tabInfo[props.currentTab][groupName]
    console.log('group', group);

    const isKeywordAlreadyExist = [...group].some(keyword => keyword.name === newKeyword)

    console.log('isKeywordAlreadyExist', isKeywordAlreadyExist);

    if (isKeywordAlreadyExist) return setIsEditing(false);

    props.setTabInfo(prev => {
      const updatedGroup = prev[props.currentTab][groupName].map(group => {
        // find target keyword and change it
        if (group.name === currentKeyword) {
          return { ...group, name: newKeyword };
        }

        return group;
      });

      return {
        ...prev,
        [props.currentTab]: {
          ...prev[props.currentTab],
          [groupName]: updatedGroup,
        }
      }
    });

    setIsEditing(false)
  }

  function deleteKeyword() {
    props.setTabInfo(prev => {
      const updatedGroup = prev[props.currentTab][groupName].filter(keyword => keyword.name !== currentKeyword);

      return {
        ...prev,
        [props.currentTab]: {
          ...prev[props.currentTab],
          [groupName]: updatedGroup,
        }
      };
    });
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select()
    }
  }, [isEditing])

  return (
    <Badge
      variant="secondary"
      className="shrink-0 bg-neutral-100 hover:bg-neutral-200 rounded-full gap-1 pr-1 cursor-pointer"
    >
      {isEditing ?
        <Input
          defaultValue={currentKeyword}
          ref={inputRef}
          className="h-auto min-w-0 max-w-20 text-xs shadow-none focus-within:border-none px-2 py-1"
          onBlur={(e) => editKeyword(e.target.value.trim())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editKeyword(inputRef.current!.value.trim())
            } else if (e.key === "Escape") {
              setIsEditing(false)
            }
          }}
        /> :
        <span
          onClick={() => setIsEditing(true)}
          className={`${currentKeyword.includes("New Keyword") ? "font-light" : ""}`}
        >{currentKeyword}</span>
      }
      <Button
        size="sm"
        variant="ghost"
        className='p-1 size-auto text-neutral-500 hover:bg-transparent group'
        onClick={deleteKeyword}
      >
        <RxCross1 size={12} className='group-hover:text-blue-500 group-hover:stroke-1' />
      </Button>
    </Badge>
  )
}
