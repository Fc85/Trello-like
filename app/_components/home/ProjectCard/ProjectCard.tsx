import { Project } from "@/types";
import { Star, Pencil as Edit, Trash2 as Delete } from 'lucide-react';
import { Button } from "../../../../components/ui";
import { useState } from "react";
import CreateEditModal from "../CreateEditModal";
import { createPortal } from "react-dom";
import Link from "next/link";
import { deleteProject, toggleStarredProject } from "@/app/db";


export default function ProjectCard ({project, updateList}: {project: Project, updateList: ()=>void}) {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<{isOpen: boolean, project?: Project}>({isOpen: false})
  
  return (
    <span className="border-1 border-black rounded-2xl p-[20px] bg-white">
      {isProjectModalOpen.isOpen && createPortal(<CreateEditModal close={()=>setIsProjectModalOpen({isOpen:false})} updateList={updateList}  {...(isProjectModalOpen.isOpen ? {project: isProjectModalOpen.project} : {})} />, document.body)}
      <span className="flex justify-between items-center mb-[20px]">
        {project.name}
        <Star cursor='pointer' width={20} height={20} fill={project.starred ? "gold" : "none"} onClick={()=>toggleStarredProject(project._id, ()=>updateList())} />
      </span>
        <p>{project.description}</p>
        <Link href={`/${project._id}`}><Button className="float-right mt-[20px]">Accéder</Button></Link>
        <Button className="mr-3 float-right mt-[20px]" onClick={()=>setIsProjectModalOpen({isOpen: true, project: project})}>
          <Edit/>
        </Button>
        <Button className="mr-3 float-right mt-[20px]">
          <Delete onClick={()=>deleteProject(project._id, ()=> updateList())}/>
        </Button>
    </span>
  )
}
