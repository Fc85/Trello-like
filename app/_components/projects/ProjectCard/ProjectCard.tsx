import { Project } from "@/dataSchemas";
import { Star, Pencil as Edit, Trash2 as Delete } from 'lucide-react';
import { Button } from "../../../../components/ui";
import { useState } from "react";
import CreateEditModal from "../CreateEditModal";
import { createPortal } from "react-dom";


export default function ProjectCard (data: {project: Project, updateList: ()=>void}) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<{isOpen: boolean, project?: Project}>({isOpen: false})

  const deleteProject = (): void => {
    const fromLS = window.localStorage.getItem('projects') || ''
    const parsed = JSON.parse(fromLS)
    const projectIndex = parsed.findIndex((item: Project)=>item._id === data.project._id)

    if(projectIndex !== -1){
      parsed.splice(projectIndex, 1)

      window.localStorage.setItem('projects', JSON.stringify(parsed))
      data.updateList()
    }
  }

  const toggleStarred = (): void => {
    const fromLS = window.localStorage.getItem('projects') || ''
    const parsed = JSON.parse(fromLS)
    const projectIndex = parsed.findIndex((item: Project)=>item._id === data.project._id)

    if(projectIndex !== -1){
      parsed[projectIndex].starred = !parsed[projectIndex].starred

      window.localStorage.setItem('projects', JSON.stringify(parsed))
      data.updateList()
    }
  }
  
  return (
    <span className="project-card-container">
      {isProjectModalOpen.isOpen && createPortal(<CreateEditModal close={()=>setIsProjectModalOpen({isOpen:false})} updateList={data.updateList}  {...(isProjectModalOpen.isOpen ? {project: isProjectModalOpen.project} : {})} />, document.body)}
      <span className="project-card-header">
        {data.project.name}
        <Star cursor='pointer' width={20} height={20} fill={data.project.starred ? "gold" : "none"} onClick={()=>toggleStarred()} />
      </span>
        <p>{data.project.description}</p>
        <Button>Accéder</Button>
        <Button className="mr-3" onClick={()=>setIsProjectModalOpen({isOpen: true, project: data.project})}>
          <Edit/>
        </Button>
        <Button className="mr-3">
          <Delete onClick={()=>deleteProject()}/>
        </Button>
    </span>
  )
}
