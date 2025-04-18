'use client'

import { Button } from "@/components/ui";
import { Project, Column as ColumnType } from "@/types";
import { useState, useEffect } from "react";
import { Column, CreateEditColumnTaskModal } from "../_components/project";
import { createPortal } from "react-dom";
import { editProject, getOneProject } from "../db";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

type TT = Omit<Project<{populateColumns: true}>, "columns"> & {columns: ColumnType<{populateTasks: true}>[]}

export default function Projet({params}: {params: {id: string}}) {
  const {id} = params
  const [projectData, setProjectData] = useState<TT| null>(null)
  const [columnsIds, setColumnIds] = useState<string[]>([])
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false)

  const updateList = ():void => {
    const newProjectData = getOneProject(id, {populateColumns: true}, {populateTasks: true})
    setProjectData(newProjectData as unknown as TT)
    setColumnIds(newProjectData?.columns?.map((item: ColumnType)=> item._id) || [])
  }

  useEffect(()=> {
   updateList()
  }, [])

  const onDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    const activeIndex: number | undefined = projectData?.columns.findIndex((item: ColumnType<{populateTasks: true}>)=> item._id === active.id)
    const overIndex: number | undefined = projectData?.columns.findIndex((item: ColumnType<{populateTasks: true}>)=> item._id === over?.id)
    
    if(activeIndex !== undefined && activeIndex > -1 && overIndex !== undefined && overIndex > -1){
      const array = [...columnsIds]
      const item = array[activeIndex];
      array.splice(activeIndex, 1);
      array.splice(overIndex, 0, item);
      
      editProject(id, {columns: array}, () => updateList() )
    }
  }
  
  return (
    <DndContext onDragEnd={onDragEnd}>
      {isColumnModalOpen && createPortal(<CreateEditColumnTaskModal type='COLUMN' parentId={id} close={()=>setIsColumnModalOpen(false)} updateList={updateList} />, document.body)}
      <div className="w-full bg-white flex justify-between px-[10%] py-5 items-end">
        <div className="w-auto" >
          <h2 className="text-xl font-bold">{projectData?.name}</h2>
          <p>{projectData?.description}</p>
        </div>
        <div className="min-w-fit h-fit ml-[20px]">
          <Button title="Ajouter une colonne" onClick={()=>setIsColumnModalOpen(true)}>Nouvelle colonne</Button>
        </div>
      </div>
      <div className="mx-auto h-full w-[80%] flex gap-5 mt-[20px] overflow-x-auto pb-5">
        <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy} >
          {projectData?.columns?.map((item)=> <Column key={item._id} projectId={id} columnData={item} updateList={()=>updateList()} />)}
        </SortableContext>
      </div>
    </DndContext>
  );
}
