'use client'

import { Project } from "@/dataSchemas";
import { ProjectCard } from "./_components/projects";
import { Button } from "../components/ui"
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CreateEditModal from "./_components/projects/CreateEditModal";

export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false)
  const [projectsList, setProjectsList] = useState<Project[]>()

  useEffect(()=> {
    const fromLS = window.localStorage.getItem('projects')
    const parsed = fromLS ? JSON.parse(fromLS) : []

    setProjectsList(parsed)
  },[])

  return (
    <div className="home-container">
      {isProjectModalOpen && createPortal(<CreateEditModal close={()=>setIsProjectModalOpen(false)} />, document.body)}
      <h1 className="home-title">Accueil</h1>
      <section>
        <div className="projects-list-header">
          <h2>Liste des projets</h2>
          <Button onClick={()=>setIsProjectModalOpen(true)}>Nouveau projet</Button>
        </div>
        <hr/>
        <div className="projects-list">
          {projectsList?.map((item)=><ProjectCard key={item._id} {...item} />)}
        </div>
      </section>
    </div>
  );
}
