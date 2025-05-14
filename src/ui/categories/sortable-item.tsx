"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CategoryCard } from "./card";
import { category } from "generated/prisma";
import { cn } from "@/lib/utils";

export function SortableItem({ id, cate }: { id: number; cate: category }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("cursor-grab active:cursor-grabbing ", isDragging ? "shadow-2xl scale-105": "")}
      suppressHydrationWarning
    >
      <CategoryCard item={cate} />
    </div>
  );
}
