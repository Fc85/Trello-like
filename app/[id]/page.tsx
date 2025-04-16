'use client'

import { Button } from "@/components/ui";
import { Project, Column as ColumnType } from "@/types";
import { useState, useEffect } from "react";
import { Column, CreateEditModal } from "../_components/project";
import { createPortal } from "react-dom";
import { getOneProject } from "../db";

export default function Projet({params}: {params: {id: string}}) {
  const {id} = params
  const [projectData, setProjectData] = useState<Project<{populateColumns: true}> | null>(null)
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false)

  const updateList = ():void => {
    const newProjectData = getOneProject(id, {populateColumns: true}, {populateTasks: true})
    setProjectData(newProjectData)
  }

  useEffect(()=> {
   updateList()
  }, [])
  
  return (
    <div>
      {isColumnModalOpen && createPortal(<CreateEditModal type='COLUMN' parentId={id} close={()=>setIsColumnModalOpen(false)} updateList={updateList} />, document.body)}
      <div className="w-full bg-white flex justify-between px-[10%] py-5 items-end">
        <div className="w-auto" >
          <h2 className="text-xl font-bold">{projectData?.name}</h2>
          <p>{projectData?.description}</p>
        </div>
        <div className="min-w-fit h-fit ml-[20px]">
          <Button onClick={()=>setIsColumnModalOpen(true)}>Nouvelle colonne</Button>
        </div>
      </div>
      <div className="mx-auto w-[80%] flex gap-5 mt-[20px] overflow-hidden overflow-x-auto pb-5">
        {projectData?.columns?.map((item: ColumnType)=> <Column key={item._id} projectId={id} columnData={item} updateList={()=>updateList()} />)}
      </div>
    </div>
  );
}
