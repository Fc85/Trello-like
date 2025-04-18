'use client'

import { Project } from "@/types";
import { ProjectCard } from "./_components/home";
import { Button } from "../components/ui"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CreateEditProjectModal from "./_components/home/CreateEditProjectModal";
import { getProjects } from "./db";

export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false)
  const [projectsList, setProjectsList] = useState<Project[]>()

  useEffect(()=> {
    updateList()
  },[])

  const updateList = () => {
    const projects = getProjects()

    setProjectsList(projects)
  }

  return (
    <div className="px-[10%] min-h-[100vh]">
      {isProjectModalOpen && createPortal(<CreateEditProjectModal close={()=>setIsProjectModalOpen(false)} updateList={updateList} />, document.body)}
      <h1 className="text-7xl font-bold text-center py-[100px]">Accueil</h1>
      <section>
        <div className="flex justify-between items-center mb-[20px]">
          <h2 className="text-3xl">Liste des projets</h2>
          <Button onClick={()=>setIsProjectModalOpen(true)}>Nouveau projet</Button>
        </div>
        <hr/>
        <div className="grid grid-cols-3 gap-5 mt-[20px]">
          {projectsList?.sort((a: Project, b: Project) => {
            if(a.starred && b.starred){
              return a.name > b.name ? 1 : -1
            }
            if(a.starred || b.starred){
              return (a.starred || false) < (b.starred || false) ? 1 : -1
            }
            return a.name > b.name ? 1 : -1

          })?.map((item: Project)=><ProjectCard key={item._id} updateList={updateList} project={{...item}} />)}
        </div>
      </section>
    </div>
  );
}
