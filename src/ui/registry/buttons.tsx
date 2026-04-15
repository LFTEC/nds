'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useActionState } from "react";
import { deleteNori } from "@/services/noriService";
import { HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@/components/ui/button";

export default function DeleteNori({ id, batchNo }: { id: string; batchNo: string }) {
  const deleteAction = deleteNori.bind(null, id);
  const [state, formAction] = useActionState(deleteAction, { state: "success" });

  if (state.state === "error") {
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
        >
          <HiOutlineTrash className="size-4" />
          删除
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>请确认</AlertDialogTitle>
          <AlertDialogDescription>{`确定要删除紫菜批次${batchNo}吗？`}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <form action={formAction}>
            <AlertDialogAction type="submit">确认</AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
