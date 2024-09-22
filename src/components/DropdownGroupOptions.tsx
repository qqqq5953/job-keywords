import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { BsThreeDots } from "react-icons/bs"
import { RiDeleteBinLine } from "react-icons/ri"
import { Button } from "./ui/button"
import { Dispatch, SetStateAction, useState } from "react"
import DialogDeleteGroup from "./DialogDeleteGroup"

type Props = {
  groupName: string
  currentTab: string
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
}

export default function DropdownGroupOptions(props: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-4 top-3"
          >
            <BsThreeDots />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="gap-1" onClick={() => setIsOpen(true)}>
            <RiDeleteBinLine />Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogDeleteGroup
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        currentTab={props.currentTab}
        groupName={props.groupName}
        setTabInfo={props.setTabInfo}
      />
    </>
  )
}
