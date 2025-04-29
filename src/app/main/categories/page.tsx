import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Test from "@/lib/registry";
import { NewCard } from "@/ui/categories/new-card";
import { CategoryCard } from "@/ui/categories/card";
import { allCategories } from "@/services/categories";

export default async function Page() {
  const categories = await allCategories();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">      
      <div className="grid grid-cols-1 gap-6 items-stretch auto-rows-auto 2xl:grid-cols-6 xl:grid-cols-4 md:grid-cols-2">
        {categories.map(c=>(
          <CategoryCard key={c.id} item={c} />
        ))}
        <NewCard />
      </div>
    </div>
  );
}
