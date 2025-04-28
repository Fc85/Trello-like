import { Button } from "@/components/ui"
import { Column as ColumnType, Task as TaskType } from "@/types"
import { Pencil as Edit, Trash2 as Delete, Move, Plus, CopyPlus } from 'lucide-react';
import Task from "../Task/Task";
import { deleteColumn, duplicateColumn } from "@/app/db";
import { useState } from "react";
import { createPortal } from "react-dom";
import CreateEditColumnTaskModal from "../CreateEditColumnTaskModal";
import { format } from "date-fns";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';

export default function Column ({columnData, projectId,tasksIds, updateList}: {columnData: ColumnType<{populateTasks: true}>, projectId: string,tasksIds: string[], updateList: ()=>void}) {
  const [isModalOpen, setIsModalOpen] = useState<{isOpen: boolean, type?: 'COLUMN' | 'TASK'}>({isOpen: false})
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: columnData._id});
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={{...style, backgroundColor: columnData?.color ? columnData.color : '#e5e5e5'}} className="border-1 border-black rounded-2xl p-[20px] w-[350px] min-w-[350px]">
        {isModalOpen.isOpen && isModalOpen.type && 
          createPortal(<CreateEditColumnTaskModal type={isModalOpen.type} {...(isModalOpen.type === 'COLUMN' ? {data: columnData} : {})} parentId={isModalOpen.type === 'COLUMN' ? projectId : columnData._id} close={()=>setIsModalOpen({isOpen: false})} updateList={updateList} />, document.body)
        }
        <span className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{columnData?.name}</h3>
        <div className="flex gap-1 min-w-fit h-fit">
          <Button title="Supprimer" onClick={()=>deleteColumn(projectId, columnData._id, ()=> updateList())}><Delete width={20} height={20} /></Button>
          <Button title="Dupliquer" onClick={()=>duplicateColumn(projectId, columnData._id, ()=> updateList())} ><CopyPlus width={20} height={20}/></Button>
          <Button title="Modifier" onClick={()=>setIsModalOpen({ isOpen: true, type:'COLUMN'})}><Edit width={20} height={20} /></Button>
          <Button {...attributes} {...listeners} style={{cursor: 'grab'}} title="Déplacer"><Move  width={20} height={20}/></Button>
        </div>
      </span>
      <p>{columnData?.description}</p>
      <small>{columnData?.deadline && `Date limite : ${format(new Date(columnData.deadline), 'dd/MM/yyyy')}`}</small>
      <hr className="my-2" />
      <span className="flex justify-between items-center">
        <h4 className="font-semibold">Tâches</h4>
        <Button title="Ajouter une tâche" onClick={()=>setIsModalOpen({ isOpen: true, type:'TASK'})}><Plus width={20} height={20} /></Button>
      </span>
        <SortableContext items={tasksIds} strategy={verticalListSortingStrategy}>
          {columnData.tasks?.map((item:TaskType)=> <Task key={item._id} columnId={columnData._id} taskData={item} updateList={()=>updateList()} />)}
        </SortableContext>
    </div>
  )
}
