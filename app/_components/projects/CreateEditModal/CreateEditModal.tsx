import { Button } from "@/components/ui";
import { Project } from "@/dataSchemas";
import {X as Close} from 'lucide-react'


export default function CreateEditModal (data: {close: () => void, project?: Project} ) {
  
  return (
    <div className="bg-black/40 w-full h-full absolute top-0 flex justify-center items-center cursor-pointer" onClick={()=>data.close()}>
      <div className="bg-white p-5 w-[500px] rounded-xl cursor-auto" onClick={(event)=>event.stopPropagation()}>
        <span className="flex justify-between items-center mb-5">
          <p>{data.project ? 'Modifier un projet' : 'Créer un projet'}</p>
          <Close cursor='pointer' width={20} height={20} onClick={()=>data.close()} />
        </span>
        <form className="flex flex-col gap-2">
          <input className="border-1 px-2 py-1 rounded-xl" type="text" placeholder="Nom du projet"/>
          <textarea className="border-1 px-2 py-1 rounded-xl mb-4" placeholder="Description du projet"/>
          <Button>{data.project ? 'Modifier' : 'Créer'}</Button>
        </form>
      </div>
    </div>
  )
}
