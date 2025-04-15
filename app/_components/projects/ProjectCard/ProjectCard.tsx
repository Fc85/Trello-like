import { Project } from "@/types";
import { Star, Pencil as Edit, Trash2 as Delete } from 'lucide-react';
import { Button } from "../../../../components/ui";
import { useState } from "react";
import CreateEditModal from "../CreateEditModal";
import { createPortal } from "react-dom";
import Link from "next/link";


export default function ProjectCard ({project, updateList}: {project: Project, updateList: ()=>void}) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<{isOpen: boolean, project?: Project}>({isOpen: false})

  const deleteProject = (): void => {
    const fromLS = window.localStorage.getItem('projects') || ''
    const parsed = JSON.parse(fromLS)
    const projectIndex = parsed.findIndex((item: Project)=>item._id === project._id)

    if(projectIndex !== -1){
      parsed.splice(projectIndex, 1)

      window.localStorage.setItem('projects', JSON.stringify(parsed))
      updateList()
    }
  }

  const toggleStarred = (): void => {
    const fromLS = window.localStorage.getItem('projects') || ''
    const parsed = JSON.parse(fromLS)
    const projectIndex = parsed.findIndex((item: Project)=>item._id === project._id)

    if(projectIndex !== -1){
      parsed[projectIndex].starred = !parsed[projectIndex].starred

      window.localStorage.setItem('projects', JSON.stringify(parsed))
      updateList()
    }
  }
  
  return (
    <span className="border-1 border-black rounded-2xl p-[20px] bg-white">
      {isProjectModalOpen.isOpen && createPortal(<CreateEditModal close={()=>setIsProjectModalOpen({isOpen:false})} updateList={updateList}  {...(isProjectModalOpen.isOpen ? {project: isProjectModalOpen.project} : {})} />, document.body)}
      <span className="flex justify-between items-center mb-[20px]">
        {project.name}
        <Star cursor='pointer' width={20} height={20} fill={project.starred ? "gold" : "none"} onClick={()=>toggleStarred()} />
      </span>
        <p>{project.description}</p>
        <Link href={`/${project._id}`}><Button className="float-right mt-[20px]">Accéder</Button></Link>
        <Button className="mr-3 float-right mt-[20px]" onClick={()=>setIsProjectModalOpen({isOpen: true, project: project})}>
          <Edit/>
        </Button>
        <Button className="mr-3 float-right mt-[20px]">
          <Delete onClick={()=>deleteProject()}/>
        </Button>
    </span>
  )
}
