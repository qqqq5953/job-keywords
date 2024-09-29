import { Dispatch, SetStateAction, useRef } from 'react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Input } from './ui/input'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
}

export default function DialogRenameCategory(props: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function renameCategory() {
    const newName = inputRef.current?.value

    if (!newName) return props.setIsOpen(false)

    props.setTabInfo(prev => {
      const isnameExist = Object.keys(prev).some(tabName => tabName.trim().toLocaleLowerCase() === newName.trim().toLocaleLowerCase())

      if (isnameExist) return prev

      const {
        [props.currentTab]: currentCategory,
        ...rest
      } = prev

      const newTabInfo = {
        ...rest,
        [newName]: currentCategory
      };

      props.setCurrentTab(newName)

      return newTabInfo
    })

    props.setIsOpen(false)
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
          <Input ref={inputRef} defaultValue={props.currentTab} />
        </DialogHeader>
        <DialogFooter className="gap-2 pt-3">
          <Button variant="ghost" onClick={() => props.setIsOpen(false)}>Cancel</Button>
          <Button onClick={renameCategory} className="bg-blue-500 hover:bg-blue-500/90">Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
