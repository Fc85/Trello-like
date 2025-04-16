import { Button } from "@/components/ui"
import { Column as ColumnType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move, Plus } from 'lucide-react';
import Task from "../Task/Task";
import { deleteColumn } from "@/app/db";

export default function Column ({columnData, updateList}: {columnData: ColumnType, updateList: ()=>void}) {
  
  return (
    <div style={{backgroundColor: columnData?.color ? columnData.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px] w-[350px] min-w-[350px]">
      <span className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{columnData?.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button onClick={()=>deleteColumn(columnData._id, ()=> updateList())}><Delete width={20} height={20} /></Button>
          <Button><Edit width={20} height={20} /></Button>
          <Button><Move  width={20} height={20}/></Button>
        </div>
      </span>
      <p>{columnData?.description}</p>
      <hr className="my-2" />
      <span className="flex justify-between items-center">
        <h4 className="font-semibold">Tâches</h4>
        <Button><Plus width={20} height={20} /></Button>
      </span>
      <Task/>
      <Task/>
      <Task/>
    </div>
  )
}
