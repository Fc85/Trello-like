'use client'

import { Button } from "@/components/ui";
import { Project } from "@/types";
import { useState, useEffect } from "react";
import { Column, CreateEditColumnModal } from "../_components/project";
import { createPortal } from "react-dom";

export default function Projet({params}: {params: {id: string}}) {
  const {id} = params
  const [projectData, setProjectData] = useState<Project>()
  const [isColumnModalOpen, setIsColumnModalOpen] = useState<boolean>(false)

   useEffect(()=> {
    updateList()
  }, [])

  const updateList = ():void => {
    const fromLS = window.localStorage.getItem('projects')
    const parsed = fromLS ? JSON.parse(fromLS) : []
    const match = parsed.find((item: Project)=>item._id === id)
    
    if(match){
      setProjectData(match)
    }
  }
  
  return (
    <div>
      {isColumnModalOpen && createPortal(<CreateEditColumnModal project={projectData} close={()=>setIsColumnModalOpen(false)} updateList={updateList} />, document.body)}
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
        <Column/>
        <Column/>
        <Column/>
        <Column/>
        <Column/>
        <Column/>
      </div>
    </div>
  );
}
