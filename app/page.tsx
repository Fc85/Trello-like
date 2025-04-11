import { Project } from "@/dataSchemas";
import { ProjectCard } from "./_components/projects";
import { Button } from "../components/ui"

const dummy: Project ={
  _id: 'exampleId',
  name: 'Nom du projet',
  description: "Description du projet",
  createdAt: new Date(),
  updatedAt: new Date,
}


export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Accueil</h1>
      <section>
        <div className="projects-list-header">
          <h2>Liste des projets</h2>
          <Button>Nouveau projet</Button>
        </div>
        <hr/>
        <div className="projects-list">
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
          <ProjectCard {...dummy} />
        </div>
      </section>
    </div>
  );
}
