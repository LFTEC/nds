"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Test from "@/lib/registry";
import { NewCard } from "@/ui/registry/new-card";

export default function Page() {
  const handle = async () => {
    try {
      await Test();
    } catch (error) {
      toast("test", { description: "test" });
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <p>紫菜登记</p>
      <Button onClick={handle}>Show Toast</Button>
      <div className="grid grid-cols-4 gap-6">
        <NewCard />
      </div>
    </div>
  );
}
