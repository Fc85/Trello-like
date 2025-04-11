import { Project } from "@/dataSchemas";
import { Star } from 'lucide-react';
import { Button } from "../../../../components/ui";


export default function ProjectCard (data: Project) {
  return (
    <span className="project-card-container">
      <span className="project-card-header">
        {data.name}
        <Star cursor='pointer' width={20} height={20} fill={data.starred ? "gold" : "none"} />
      </span>
        <p>{data.description}</p>
        <Button>Accéder</Button>
    </span>
  )
}
