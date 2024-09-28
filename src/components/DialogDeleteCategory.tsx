import { Dispatch, SetStateAction } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from './ui/button'

type Props = {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  currentTab: string
  setCurrentTab: Dispatch<SetStateAction<string>>
  setTabInfo: Dispatch<SetStateAction<Record<string, Record<string, Keyword[]>>>>
}

export default function DialogDeleteCategory(props: Props) {
  function deleteCategory() {
    props.setTabInfo(prev => {
      const {
        [props.currentTab]: currentCategory,
        ...rest
      } = prev

      const restTabs = Object.keys(rest).reverse()
      if (restTabs.length > 0) {
        props.setCurrentTab(restTabs[0])
      }

      return rest;
    })

    props.setIsOpen(false)
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do you want to delete <span className="underline underline-offset-2">{props.currentTab}</span> ?</DialogTitle>
          <DialogDescription>
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 pt-3">
          <Button variant="ghost" onClick={() => props.setIsOpen(false)}>Cancel</Button>
          <Button onClick={deleteCategory} className="bg-blue-500 hover:bg-blue-500/90">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
