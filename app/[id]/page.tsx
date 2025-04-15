'use client'

import { Button } from "@/components/ui";
import { Project } from "@/types";
import { useState, useEffect } from "react";
import { Column } from "../_components/columns";

export default function Projet({params}: {params: {id: string}}) {
  const {id} = params
  const [projectData, setProjectData] = useState<Project>()

   useEffect(()=> {
    const fromLS = window.localStorage.getItem('projects')
    const parsed = fromLS ? JSON.parse(fromLS) : []
    const match = parsed.find((item: Project)=>item._id === id)
    
    if(match){
      setProjectData(match)
    }
  }, [])
  
  return (
    <div>
      <div className="w-full bg-white flex justify-between px-[10%] py-5 items-end">
        <div className="w-auto" >
          <h2 className="text-xl font-bold">{projectData?.name}</h2>
          <p>{projectData?.description}</p>
        </div>
        <div className="min-w-fit h-fit ml-[20px]">
          <Button>Nouvelle colonne</Button>
        </div>
      </div>
      <div className="px-[10%] grid grid-cols-3 gap-5 mt-[20px]">
        <Column/>
      </div>
    </div>
  );
}
