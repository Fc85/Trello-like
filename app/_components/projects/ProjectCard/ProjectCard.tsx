import { Project } from "@/dataSchemas";
import { Star, Pencil as Edit, Trash2 as Delete } from 'lucide-react';
import { Button } from "../../../../components/ui";
import { useState } from "react";
import CreateEditModal from "../CreateEditModal";
import { createPortal } from "react-dom";


export default function ProjectCard (data: Project) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<{isOpen: boolean, project?: Project}>({isOpen: false})
  
  return (
    <span className="project-card-container">
      {isProjectModalOpen.isOpen && createPortal(<CreateEditModal close={()=>setIsProjectModalOpen({isOpen:false})} {...(isProjectModalOpen.isOpen ? {project: isProjectModalOpen.project} : {})} />, document.body)}
      <span className="project-card-header">
        {data.name}
        <Star cursor='pointer' width={20} height={20} fill={data.starred ? "gold" : "none"} />
      </span>
        <p>{data.description}</p>
        <Button>Accéder</Button>
        <Button className="mr-3" onClick={()=>setIsProjectModalOpen({isOpen: true, project: data})}>
          <Edit/>
        </Button>
        <Button className="mr-3">
          <Delete/>
        </Button>
    </span>
  )
}
