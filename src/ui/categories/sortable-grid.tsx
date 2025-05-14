"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensors,
  useSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { sortableSchema } from "@/data/category/categoryData";
import { z } from "zod";
import { category } from "generated/prisma";
import { SortableItem } from "./sortable-item";
import { NewCard } from "./new-card";
import { sortCategories } from "@/services/categories";
import { toast } from "sonner";

export function CateSortableGrid({ categories }: { categories: category[] }) {
  const [items, setItems] = useState<z.infer<typeof sortableSchema>[]>(
    categories.map(({ id, serialNo }) => ({ id, serialNo }))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleDragEnd = async (e: DragEndEvent) => {
    const {active, over} = e;
    if(over && over.id !== active.id) {
      const oldIndex = items.findIndex((item)=> item.id === active.id);
      const newIndex = items.findIndex((item)=> item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      try {
        await sortCategories(newItems);
      } catch (error: any) {
        setItems(items);
        toast("更新顺序时发生异常，可能的原因：" + error.message);
      } 

      
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-6 items-stretch auto-rows-auto xl:grid-cols-4 md:grid-cols-2 mx-2 my-5">
          {items.map((item) => (
            <SortableItem
              key={item.id}
              id={item.id}
              cate={categories.find((i) => i.id === item.id)!}
            />
          ))}
          <NewCard />
        </div>
        
      </SortableContext>
    </DndContext>
  );
}
