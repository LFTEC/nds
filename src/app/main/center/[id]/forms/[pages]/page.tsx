export default async function Page(props: { params: Promise<{ pages: number, id: string }> }) {
  const categoryId = (await props.params).pages;
  const id = (await props.params).id;

  return (
    <>
    <div>{categoryId}</div>
    <div>{id}</div>
    </>
  )
}
