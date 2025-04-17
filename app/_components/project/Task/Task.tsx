import { deleteTask } from "@/app/db";
import { Button } from "@/components/ui"
import { Task as TaskType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move } from 'lucide-react';
import { useState } from "react";
import CreateEditModal from "../CreateEditModal";
import { createPortal } from "react-dom";

export default function Task ({columnId, taskData, updateList}: {columnId: string, taskData: TaskType, updateList: ()=>void}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div style={{backgroundColor: taskData.color ? taskData.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px] mt-3">
      {isModalOpen && 
        createPortal(<CreateEditModal type="TASK" data={taskData} parentId={columnId} close={()=>setIsModalOpen(false)} updateList={updateList} />, document.body)
      }      
      <span className="flex justify-between items-center mb-2">
        <h3 className="text-m font-semibold">{taskData.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button onClick={()=>deleteTask(taskData._id, columnId, ()=> updateList())}><Delete width={20} height={20} /></Button>
          <Button onClick={()=>setIsModalOpen(true)}><Edit width={20} height={20} /></Button>
          <Button><Move  width={20} height={20}/></Button>
        </div>
      </span>
      <p className="text-sm">{taskData.description}</p>
    </div>
  )
}
