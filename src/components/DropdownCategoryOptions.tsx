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
import DialogRenameCategory from "./DialogRenameCategory"

type Props = {
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
}

export default function DropdownCategoryOptions(props: Props) {
  const [isOpenRename, setIsOpenRename] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

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
          <DropdownMenuItem className="gap-1" onClick={() => setIsOpenRename(true)}>
            <RiEditLine />Rename
          </DropdownMenuItem>
          <DropdownMenuItem className="gap-1" onClick={() => setIsOpenDelete(true)}>
            <RiDeleteBinLine />Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogRenameCategory
        isOpen={isOpenRename}
        setIsOpen={setIsOpenRename}
        currentTab={props.currentTab}
        setCurrentTab={props.setCurrentTab}
        setTabInfo={props.setTabInfo}
      />

      <DialogDeleteCategory
        isOpen={isOpenDelete}
        setIsOpen={setIsOpenDelete}
        currentTab={props.currentTab}
        setCurrentTab={props.setCurrentTab}
        setTabInfo={props.setTabInfo}
      />
    </>
  )
}
