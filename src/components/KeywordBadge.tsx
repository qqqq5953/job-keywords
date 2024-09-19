import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'
import { Input } from './ui/input'
import { RxCross1 } from "react-icons/rx";
import { Button } from './ui/button';

type Category = {
  belongsTo: string;
  keyword: string;
}

type Props = {
  category: {
    belongsTo: string;
    keyword: string;
  }
  programmingTab: Record<string, Category[]>
  setProgrammingTab: Dispatch<SetStateAction<Record<string, Category[]>>>
}

export default function KeywordBadge(props: Props) {
  const {
    belongsTo: categoryName,
    keyword: currentKeyword
  } = props.category

  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function editKeyword(newKeyword: string) {
    if (currentKeyword === newKeyword) return setIsEditing(false);

    const categories = props.programmingTab[categoryName]
    const alreadyExist = [...categories].some(category => category.keyword === newKeyword)

    if (!alreadyExist) return setIsEditing(false);

    props.setProgrammingTab(prev => {
      const updatedCategory = prev[categoryName].map(category => {
        // find target keyword and change it
        if (category.keyword === currentKeyword) {
          return { ...category, keyword: newKeyword };
        }

        return category;
      });

      return {
        ...prev,
        [categoryName]: updatedCategory,
      };
    });

    setIsEditing(false)
  }

  function deleteKeyword() {
    props.setProgrammingTab(prev => {
      const updatedCategory = prev[categoryName].filter(item => item.keyword !== currentKeyword);

      return {
        ...prev,
        [categoryName]: updatedCategory,
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
      className="shrink-0 bg-neutral-200 hover:bg-neutral-200 rounded-full gap-1 pr-1"
    >
      {isEditing ?
        <Input
          defaultValue={currentKeyword}
          ref={inputRef}
          className="h-auto min-w-0 max-w-20 text-xs shadow-none focus-within:border-none px-2 py-1"
          onBlur={(e) => editKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              editKeyword(inputRef.current!.value)
            } else if (e.key === "Escape") {
              setIsEditing(false)
            }
          }}
        /> :
        <span
          onClick={() => setIsEditing(true)}
          className={`${currentKeyword.includes("Untitled") ? "font-light" : ""}`}
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
