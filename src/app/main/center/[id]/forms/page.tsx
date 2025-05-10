import { getCorrespondingCategories } from "@/services/centerService";
import { RedirectPage } from "@/ui/center/redirect";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  const correspondingCategories = await getCorrespondingCategories(id);
  correspondingCategories.sort((a, b) => {
    return a.serialNo - b.serialNo;
  });



  return <RedirectPage path={`category-${correspondingCategories[0].categoryId}`} />
}
