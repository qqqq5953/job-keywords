import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BsThreeDots } from "react-icons/bs"
import { RiDeleteBinLine, RiEditLine } from "react-icons/ri"
import { Button } from "./ui/button"
import { Dispatch, SetStateAction, useState } from "react"
import DialogDeleteCategory from "./DialogDeleteCategory"

type Props = {
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
}

export default function DropdownCategoryOptions(props: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="text-neutral-700 hover:text-blue-600 duration-300"
            variant="ghost"
            size="sm"
          >
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-1" onClick={() => setIsOpen(true)}>
            <RiEditLine />Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-1" onClick={() => setIsOpen(true)}>
            <RiDeleteBinLine />Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteCategory
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentTab={props.currentTab}
        setCurrentTab={props.setCurrentTab}
        setTabInfo={props.setTabInfo}
      />
    </>
  )
}
