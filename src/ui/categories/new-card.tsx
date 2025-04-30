'use client'
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiPlusCircle } from "react-icons/fi";

import { createCategory } from "@/services/categories";
import { useActionState } from "react";

export function NewCard() {
  const [state, formAction] = useActionState(createCategory, {state: "success"});
  return (
    <form action={formAction}>
      <button
        type="submit"
        className="block w-full h-full p-0 text-left bg-transparent border-none"
      >
        <Card
          className="flex items-center w-full h-full justify-center cursor-pointer group"
        >
          <CardContent>
            <FiPlusCircle className="w-10 h-10 text-gray-400 m-5 transition-colors group-hover:text-primary" />
          </CardContent>
        </Card>
      </button>
    </form>
  );
}
