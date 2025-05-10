'use client'
import { Button } from "@/components/ui/button";
import { HiOutlineArrowRightStartOnRectangle } from "react-icons/hi2";
import { startIndicate } from "@/services/centerService";

export function NoriButton({ id }: { id: string }) {
  const onCreate = async () => {
    await startIndicate(id);
  };

  return (
    <Button
      variant="ghost"
      className="flex gap-2 items-center border py-1 px-2 rounded-md hover:bg-blue-200 transition-colors"
      onClick={onCreate}
    >
      <HiOutlineArrowRightStartOnRectangle className="size-4" />
      <span>录入</span>
    </Button>
  );
}
