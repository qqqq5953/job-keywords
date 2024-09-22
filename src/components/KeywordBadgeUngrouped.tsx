import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { RxCross1 } from "react-icons/rx";
import { Button } from './ui/button';

type Props = {
  keyword: Keyword
  setKeywords: Dispatch<SetStateAction<Keyword[]>>
}

export default function KeywordBadgeUngrouped(props: Props) {
  const { name: currentKeyword } = props.keyword

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function editKeyword(newKeyword: string) {
    if (!newKeyword || currentKeyword === newKeyword) return setIsEditing(false);

    props.setKeywords(prev => {
      const isKeywordAlreadyExist = prev.some(keyword => keyword.name === newKeyword)

      if (isKeywordAlreadyExist) return prev;

      return prev.map(keyword =>
        keyword.name === currentKeyword ?
          { ...keyword, name: newKeyword } :
          keyword
      );
    });

    setIsEditing(false)
  }

  function deleteKeyword() {
    props.setKeywords(prev => {
      return prev.filter(keyword => keyword.name !== currentKeyword)
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
        className='p-1 size-auto'
        onClick={deleteKeyword}
      >
        <RxCross1 size={12} />
      </Button>
    </Badge>
  )
}
