import { useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { RxCross1 } from "react-icons/rx";
import { Button } from './ui/button';

type Props = {
  category: {
    belongsTo: string;
    keyword: string;
  }
  // keyword: string
  // category: {
  //   name: string;
  //   keywords: Set<string>;
  // }
  // category: {
  //   name: string;
  //   keywords: string[];
  // }
  editKeyword: (
    categoryName: string,
    oldKeyword: string,
    newKeyword: string
  ) => void
  deleteKeyword: (
    categoryName: string,
    deletedKeyword: string,
  ) => void
}

export default function KeywordBadge(props: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleEdit(text: string) {
    props.editKeyword(props.category.belongsTo, props.category.keyword, text)
    // props.editKeyword(props.category.name, props.keyword, text)
    setIsEditing(false)
  }

  useEffect(() => {
    console.log('useEffect');

    if (isEditing) {
      inputRef.current?.select()
    }
  }, [isEditing])

  return (
    <Badge
      variant="secondary"
      className="shrink-0 bg-neutral-200 hover:bg-neutral-200 rounded-full gap-1 pr-1"
    >
      {isEditing ?
        <Input
          defaultValue={props.category.keyword}
          ref={inputRef}
          className="h-auto min-w-0 max-w-20 text-xs shadow-none focus-within:border-none px-2 py-1"
          onBlur={(e) => handleEdit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleEdit(inputRef.current!.value)
            } else if (e.key === "Escape") {
              setIsEditing(false)
            }
          }}
        /> :
        <span
          onClick={() => setIsEditing(true)}
          className={`${props.category.keyword.includes("Untitled") ? "font-light" : ""}`}
        >{props.category.keyword}</span>
      }
      <Button
        size="sm"
        variant="ghost"
        className='p-1 size-auto'
        onClick={() => props.deleteKeyword(
          props.category.belongsTo,
          props.category.keyword
        )}
      >
        <RxCross1 size={12} />
      </Button>
    </Badge>
  )
}
