import { Button } from "@/components/ui"
import { Task as TaskType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move } from 'lucide-react';

const dummy: TaskType = {
  _id: 'a',
  name: 'Nom de la tâche',
  description: 'Description de la tâche',
  color: 'lightblue',
  deadline: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function Task () {
  
  return (
    <div style={{backgroundColor: dummy?.color ? dummy.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px] mt-3">
      <span className="flex justify-between">
        <h3 className="text-m font-semibold">{dummy?.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button><Move  width={20} height={20}/></Button>
          <Button><Edit width={20} height={20} /></Button>
          <Button><Delete width={20} height={20} /></Button>
        </div>
      </span>
      <p className="text-sm">{dummy?.description}</p>
    </div>
  )
}
