'use client'

import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { useActionState } from "react";
import { deleteNori } from "@/services/noriService";

export default function DeleteNori({id}:{id:string}) {
  const deleteAction = deleteNori.bind(null, id);
  const [state, formAction] = useActionState(deleteAction, {state: "success"});

  if (state.state === "error") {
    // 处理异常
  }
  return (
    <form action={formAction} >
      <AlertDialogAction type="submit">确认</AlertDialogAction>
      
    </form>
  )
}