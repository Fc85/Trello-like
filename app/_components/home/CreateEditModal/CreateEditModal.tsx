import { CreateProject, editProject } from "@/app/db";
import { Button } from "@/components/ui";
import { Project } from "@/types";
import {X as Close} from 'lucide-react'
import { useState } from "react";
export default function CreateEditModal ({close, project, updateList}: {close: () => void, project?: Project,  updateList: () => void } ) {
  const [name, setName] = useState<string>(project?.name || '')
  const [description, setDescription] = useState<string>(project?.description || '')

  const closeModal = () => {
    setName('')
    setDescription('')
    close()
  }
 
  const handleSubmit = () => {
    if(name && description){
      if(!project?._id){
        CreateProject({name, description}, () => {
          closeModal();
          updateList();
        })
      }else{
        const updatedData = {
          ...(name ? {name} : {}),
          ...(description ? {description} : {}),
        }


        editProject(project._id, updatedData, () => {
          closeModal();
          updateList();
        })
      }
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
