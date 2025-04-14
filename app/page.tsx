'use client'

import { Project } from "@/dataSchemas";
import { ProjectCard } from "./_components/projects";
import { Button } from "../components/ui"
import { useState } from "react";
import { createPortal } from "react-dom";
import CreateEditModal from "./_components/projects/CreateEditModal";

const dummy: Project ={
  _id: 'exampleId',
  name: 'Nom du projet',
  description: "Description du projet",
  createdAt: new Date(),
  updatedAt: new Date,
}


export default function Home() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false)

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
          <ProjectCard {...dummy} />
        </div>
      </section>
    </div>
  );
}
