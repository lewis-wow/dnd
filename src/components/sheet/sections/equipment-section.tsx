import { ItemList } from "@/components/sheet/item-list";

export function EquipmentSection() {
  return (
    <ItemList
      name="equipment"
      placeholder="Předmět"
      tip="Kus vybavení, který postava nosí u sebe (zbraň, zbroj, nástroj, batoh…)"
      addLabel="+ Přidat předmět"
      deleteLabel="Smazat předmět"
    />
  );
}
