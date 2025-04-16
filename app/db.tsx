import { Column, Project, Task } from "@/types"
import { v4 as uuidv4 } from 'uuid';

export function getProjects(): Project[] {
  const fromLS: string = window.localStorage.getItem('projects') || ''
  const parsed: Project[] = JSON.parse(fromLS) || []

  return parsed
}

export function getOneProject<T extends {populateColumns: boolean} = {populateColumns: false}>(id: string, options?: T): Project<T> | null {
  const projectsList = getProjects()
  const matchingProject: Project | undefined = projectsList.find((item: Project)=>item._id === id)

  if(matchingProject){
    if(options?.populateColumns){
      const columns = getColumns()
      const filteredColumns = columns.filter((item:Column)=> matchingProject.columns?.includes(item._id))
      const newProjectData: Project<T> = {...matchingProject, columns: filteredColumns} as Project<T>

      return newProjectData
    }

    return matchingProject as  Project<T>
  }
  return null
}

export function CreateProject(data: {name:string, description:string}, onFinish: ()=>void = ()=>{}) {
  const projectsList = getProjects()

  const newProject: Project = {
    _id: uuidv4(),
    name: data.name,
    description: data.description,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  projectsList.push(newProject)
  window.localStorage.setItem('projects', JSON.stringify(projectsList))
  onFinish()
}

export function editProject(id: string, data: {name?:string, description?:string, columns?:string[]} ,onFinish: ()=>void = ()=>{}) {
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)

  if(projectIndex !== -1){
    projectsList[projectIndex] = {
      ...projectsList[projectIndex],
      ...(data.name ? {name: data.name} : {}),
      ...(data.description ? {description: data.description} : {}),
      ...(data.columns ? {columns: data.columns} : {}),
      updatedAt: new Date()
    }

    window.localStorage.setItem('projects', JSON.stringify(projectsList))
    onFinish()
  }
}

export function toggleStarredProject(id:string, onFinish: ()=>void = ()=>{}){
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)

  if(projectIndex !== -1){
    projectsList[projectIndex].starred = !projectsList[projectIndex].starred

    window.localStorage.setItem('projects', JSON.stringify(projectsList))
    onFinish()
  }

}

export function deleteProject(id:string, onFinish: ()=>void = () => {}) {
  const projectsList = getProjects()
  const projectIndex: number = projectsList.findIndex((item: Project)=>item._id === id)
  
  if(projectIndex !== -1){
    if(projectsList[projectIndex].columns?.length){
      for(let index = 0; index < projectsList[projectIndex].columns.length; index++){
        deleteColumn(projectsList[projectIndex].columns[index])
      }
    }

    projectsList.splice(projectIndex, 1)

    window.localStorage.setItem('projects', JSON.stringify(projectsList))
    onFinish()
  }
}

export function getColumns(): Column[] {
  const fromLS: string = window.localStorage.getItem('columns') || ''
  const parsed: Column[] = JSON.parse(fromLS) || []

  return parsed
}

export function getOneColumn() {

}

export function CreateColumn(projectId:string, data: {name:string, description:string, color?:string}, onFinish: ()=>void = ()=>{}) {
  const columnsList = getColumns()
  const project = getOneProject(projectId)

  if(project){
    const newColumn: Column = {
      _id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(data.color ? {color: data.color} : {})
    }

    columnsList.push(newColumn)
    window.localStorage.setItem('columns', JSON.stringify(columnsList))

    const newColumnsList: string[] = [...(project.columns || []), newColumn._id]
    
    editProject(projectId, {columns: newColumnsList}, ()=>onFinish())
  }

}

export function editColumn(columnId: string, data:{name?:string, description?:string, color?:string}, onFinish: ()=>void = ()=>{}) {
  const columnsList = getColumns()
  const columnIndex: number = columnsList.findIndex((item: Project)=>item._id === columnId)

  if(columnIndex !== -1){
    columnsList[columnIndex] = {
      ...columnsList[columnIndex],
      ...(data.name ? {name: data.name} : {}),
      ...(data.description ? {description: data.description} : {}),
      ...(data.color ? {color: data.color} : {}),
      updatedAt: new Date()
    }

    window.localStorage.setItem('columns', JSON.stringify(columnsList))
    onFinish()
  }
}

export function deleteColumn(columnId: string, onFinish: () => void = () => {}) {
  const columns = getColumns()
  const columnIndex: number = columns.findIndex((item:Column)=> item._id === columnId)

  
  if(columnIndex !== -1){
    columns.splice(columnIndex, 1)

    window.localStorage.setItem('columns', JSON.stringify(columns))
    onFinish()
  }

}

export function getTasks(): Task[] {
  const fromLS: string = window.localStorage.getItem('tasks') || ''
  const parsed: Task[] = JSON.parse(fromLS) || []

  return parsed
}

export function getOneTask() {

}

export function CreateTask() {

}

export function editTask() {

}

export function deleteTask() {

}
