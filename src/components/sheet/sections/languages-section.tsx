import { ItemList } from "@/components/sheet/item-list";

export function LanguagesSection() {
  return (
    <ItemList
      name="languages"
      placeholder="Jazyk nebo zdatnost"
      tip="Jazyk, kterým postava mluví, nebo zdatnost (např. s nástrojem či zbraní), kterou ovládá"
      addLabel="+ Přidat jazyk"
      deleteLabel="Smazat jazyk"
    />
  );
}
