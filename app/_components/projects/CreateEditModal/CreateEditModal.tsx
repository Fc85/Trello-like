import { Button } from "@/components/ui";
import { Project } from "@/types";
import {X as Close} from 'lucide-react'
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

export default function CreateEditModal ({close, project, updateList}: {close: () => void, project?: Project,  updateList: () => void } ) {
  const [name, setName] = useState<string>(project?.name || '')
  const [description, setDescription] = useState<string>(project?.description || '')

  const closeModal = ():void => {
    setName('')
    setDescription('')
    close()
  }
 
  const handleSubmit = (): void => {
    if(name && description){
      const projectsList: string = window.localStorage.getItem('projects') || ''
      const formattedProjectsList: Project[] = projectsList ? JSON.parse(projectsList) : []

      if(!project?._id){
        const newProject: Project = {
          _id: uuidv4(),
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        formattedProjectsList.push(newProject)
      }else{
        const projectIndex = formattedProjectsList.findIndex((item: Project)=>item._id === project?._id)

        if(projectIndex !== -1){
          formattedProjectsList[projectIndex] = {
            ...formattedProjectsList[projectIndex],
            name,
            description,
            updatedAt: new Date()
          }
        }
      }
        
      window.localStorage.setItem('projects', JSON.stringify(formattedProjectsList))
      closeModal()
      updateList()
    }
  }
  
  return (
    <div className="bg-black/40 w-full h-full absolute top-0 flex justify-center items-center cursor-pointer z-9999" onClick={()=>closeModal()}>
      <div className="bg-white p-5 w-[500px] rounded-xl cursor-auto" onClick={(event)=>event.stopPropagation()}>
        <span className="flex justify-between items-center mb-5">
          <p>{project ? 'Modifier un projet' : 'Créer un projet'}</p>
          <Close cursor='pointer' width={20} height={20} onClick={()=>closeModal()} />
        </span>
        <form className="flex flex-col gap-2">
          <input className="border-1 px-2 py-1 rounded-xl" type="text" placeholder="Nom du projet" value={name} onChange={(e)=>setName(e.target.value)}/>
          <textarea className="border-1 px-2 py-1 rounded-xl mb-4" placeholder="Description du projet" value={description} onChange={(e)=>setDescription(e.target.value)}/>
          <Button onClick={handleSubmit}>{project ? 'Modifier' : 'Créer'}</Button>
        </form>
      </div>
    </div>
  )
}
