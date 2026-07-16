import { ItemList } from "@/components/sheet/item-list";

export function FeaturesSection() {
  return (
    <ItemList
      name="features"
      placeholder="Schopnost nebo rys"
      tip="Schopnost nebo rys, který postava získala povoláním, rasou, zázemím nebo jinak"
      addLabel="+ Přidat schopnost"
      deleteLabel="Smazat schopnost"
    />
  );
}
