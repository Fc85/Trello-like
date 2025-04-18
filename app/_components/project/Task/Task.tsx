import { deleteTask, duplicateTask, editTask } from "@/app/db";
import { Button } from "@/components/ui"
import { Task as TaskType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move, CopyPlus, CircleCheck } from 'lucide-react';
import { useState } from "react";
import CreateEditColumnTaskModal from "../CreateEditColumnTaskModal";
import { createPortal } from "react-dom";
import { format } from "date-fns";

export default function Task ({columnId, taskData, updateList}: {columnId: string, taskData: TaskType, updateList: ()=>void}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div style={{backgroundColor: taskData.color ? taskData.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px] mt-3">
      {isModalOpen && 
        createPortal(<CreateEditColumnTaskModal type="TASK" data={taskData} parentId={columnId} close={()=>setIsModalOpen(false)} updateList={updateList} />, document.body)
      }      
      <span className="flex justify-between items-center mb-2">
        <h3 className="text-m font-semibold">{taskData.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button title="Supprimer" onClick={()=>deleteTask(taskData._id, columnId, ()=> updateList())}><Delete width={13} height={13} /></Button>
          {!taskData.isCompleted && (<>
            <Button title="Dupliquer" onClick={()=>duplicateTask(columnId, taskData._id, ()=>updateList())}><CopyPlus width={13} height={13}/></Button>
            <Button title="Modifier" onClick={()=>setIsModalOpen(true)}><Edit width={13} height={13} /></Button>
          </>)}
          <Button style={{cursor: 'grab'}}  title="Déplacer"><Move width={13} height={13}/></Button>
        </div>
      </span>
      <p className="text-sm">{taskData.description}</p>
      <span className="flex items-center justify-between p-0 m-0">
      <small>{taskData?.deadline && `Date limite : ${format(new Date(taskData.deadline), 'dd/MM/yyyy')}`}</small>
      {!taskData.isCompleted && <Button title="Compléter la tâche" onClick={()=>editTask(taskData._id, {isCompleted: true}, ()=>updateList())}><CircleCheck width={13} height={13}/></Button>}
      </span>
      {taskData.isCompleted && taskData.completedAt && <small>Complétée le : {format(new Date(taskData.completedAt), 'dd/MM/yyyy')}</small>}
    </div>
  )
}
