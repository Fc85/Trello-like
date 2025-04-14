export default async function Projet({params}: {params: Promise<{id: string}>}) {
  const {id} = await params

  return (
    <div>
    {id}
    </div>
  );
}
