import { Button } from "@/components/ui"
import { Column as ColumnType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move } from 'lucide-react';

const dummy: ColumnType = {
  _id: 'a',
  name: 'Nom de la colonne',
  description: 'Description de la colonne',
  color: '#f86a21',
  deadline: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export default function Column () {
  
  return (
    <div style={{backgroundColor: dummy?.color ? dummy.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px]">
      <span className="flex justify-between">
        <h3 className="text-lg font-semibold">{dummy?.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button><Move  width={20} height={20}/></Button>
          <Button><Edit width={20} height={20} /></Button>
          <Button><Delete width={20} height={20} /></Button>
        </div>
      </span>
      <p>{dummy?.description}</p>
      <hr className="my-2" />
      <h4 className="font-semibold">Tâches</h4>
    </div>
  )
}
