'use client'

import { Button } from "@/components/ui";
import { Project, Column as ColumnType } from "@/types";
import { useState, useEffect } from "react";
import { Column, CreateEditColumnTaskModal } from "../_components/project";
import { createPortal } from "react-dom";
import { editColumn, editProject, getColumns, getOneProject } from "../db";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

type PopulatedProjects = Omit<Project<{populateColumns: true}>, "columns"> & {columns: ColumnType<{populateTasks: true}>[]}
type dndOriginType = "COLUMN" | "TASK"
type dndOrigin = {type: dndOriginType | null, parentId?: string}


export default function Projet({params}: {params: {id: string}}) {
  const {id} = params
  const [projectData, setProjectData] = useState<PopulatedProjects| null>(null)
  const [columnsIds, setColumnsIds] = useState<string[]>([])
  const [tasksIds, setTasksIds] = useState<Record<string, Array<string>>>({})
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false)

  const updateList = ():void => {
    const newProjectData = getOneProject(id, {populateColumns: true}, {populateTasks: true}) as (PopulatedProjects | null)

    if (newProjectData) {
      let newTasksIds = {}
      
      setProjectData(newProjectData as unknown as PopulatedProjects)
  
      // Définition de l'id des columns
      setColumnsIds((newProjectData?.columns?.map((item)=> item._id) as string[]) || [])
  
      // Définition de l'id des tâches
      newProjectData?.columns?.forEach((col)=>{
        newTasksIds = {...newTasksIds, [col._id]: (col.tasks)?.map((item)=> item._id) || []}
      })

      setTasksIds(newTasksIds)
    }
  }

  useEffect(()=> {
   updateList()
  }, [])

  const getOrigin = (elemId: string): dndOrigin => {
    if(columnsIds.includes(elemId)){
      return {type: 'COLUMN'}
    }

    for(const key in tasksIds){
      if(tasksIds[key].includes(elemId)){
        return {type: 'TASK', parentId: key}
      }
    }

    return {type: null}
  }

  const onDragEnd = ({active, over}: DragEndEvent) => {
    const activeOrigin: dndOrigin = getOrigin(active.id as string)
    const overOrigin: dndOrigin = getOrigin(over?.id as string)
    
    // DnD des colonnes
    if(activeOrigin.type === 'COLUMN' && overOrigin.type === 'COLUMN'){
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

    // DnD des tâches
    if(activeOrigin.type === 'TASK' && overOrigin.type === 'TASK' && activeOrigin.parentId === overOrigin.parentId){
      const columnsList = getColumns()
      const columnIndex = columnsList.findIndex((item)=> item._id === activeOrigin.parentId)

      if(columnIndex > -1){
        const activeIndex: number | undefined = columnsList[columnIndex].tasks?.findIndex((item)=> item === active.id)
        const overIndex: number | undefined = columnsList[columnIndex].tasks?.findIndex((item)=> item === over?.id)

        if(activeIndex !== undefined && activeIndex > -1 && overIndex !== undefined && overIndex > -1){
          const array = columnsList[columnIndex].tasks || []
          const item = array[activeIndex];
          array.splice(activeIndex, 1);
          array.splice(overIndex, 0, item);
          
          editColumn(columnsList[columnIndex]._id, {tasks: array}, () => updateList() )
        }
      }
      

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
        <SortableContext items={columnsIds} strategy={horizontalListSortingStrategy}>
          {projectData?.columns?.map((item)=> <Column key={item._id} projectId={id} tasksIds={tasksIds[item._id]} columnData={item} updateList={()=>updateList()} />)}
        </SortableContext>
      </div>
    </DndContext>
  );
}
