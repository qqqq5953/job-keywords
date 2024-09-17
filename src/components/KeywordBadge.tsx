import { useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'

type Props = {
  keyword: string
  category: {
    name: string;
    keywords: string[];
  }
  editKeyword: (
    categoryName: string,
    oldKeyword: string,
    newKeyword: string
  ) => void
}

export default function KeywordBadge(props: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleEdit(text: string) {
    props.editKeyword(props.category.name, props.keyword, text)
    setIsEditing(false)
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.select()
    }
  }, [isEditing])

  return (
    <>
      {isEditing ? (
        <Badge
          variant="secondary"
          className="shrink-0 bg-neutral-200 hover:bg-neutral-200 rounded-full"
          onClick={() => setIsEditing(true)}
        >
          <Input
            defaultValue={props.keyword}
            ref={inputRef}
            className="h-auto min-w-0 max-w-20 text-xs shadow-none focus-within:border-none px-2 py-1"
            onBlur={(e) => handleEdit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEdit(inputRef.current!.value)
              }
            }}
          />
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          className="shrink-0 bg-neutral-200 hover:bg-neutral-200 rounded-full"
          onClick={() => setIsEditing(true)}
        >
          {props.keyword}
        </Badge>
      )}
    </>
  )
}
