
'use client'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { category } from '@/generated/prisma';
import { Button } from '@/components/ui/button';
import { MdOutlineEditNote } from "react-icons/md";
import { useState, useActionState } from 'react';
import { setInvisible as setCategoryInvisible } from '@/services/categories';
import { errorState } from '@/lib/utils';
import { toast } from "sonner";

export function CategoryCard({item}: {item: category}) {
  const [invisible, setInvisible] = useState(item.invisible);
  //const initialState : errorState = {state: 'success'};

  //const [state, categoryStatusAction] = useActionState(setCategoryInvisible, initialState);
  const handleInvisibleChange = async (e: boolean)=> {
    const newInvisible = !e;
    setInvisible(newInvisible);
    const state = await setCategoryInvisible({id: item.id, invisible: newInvisible});

    if(state.state == 'error') {
      toast("发生异常",{description: `${state.message}`});
    }
  };
  return (
      <Card>
        <CardHeader>
          <CardTitle>{item.name}</CardTitle>
          <CardDescription>{item.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-row justify-between'>
            <div className='flex items-center gap-2'>
              <Switch id='enable-div'  checked={!invisible} onCheckedChange={handleInvisibleChange }  />
              <Label htmlFor='enable-div'>启用</Label>
            </div>
            <Button asChild><MdOutlineEditNote/></Button>
          </div>
        </CardContent>
      </Card>
  );
}