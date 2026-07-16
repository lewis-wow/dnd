import { ItemList } from "@/components/sheet/item-list";

export function FeaturesSection() {
  return (
    <div>
      <div className="mt-0 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">Schopnosti a rysy</div>
      <ItemList
        name="features"
        placeholder="Schopnost nebo rys"
        tip="Schopnost nebo rys, který postava získala povoláním, rasou, zázemím nebo jinak"
        addLabel="+ Přidat schopnost"
        deleteLabel="Smazat schopnost"
      />

      <div className="mt-3.5 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">Vybavení</div>
      <ItemList
        name="equipment"
        placeholder="Předmět"
        tip="Kus vybavení, který postava nosí u sebe (zbraň, zbroj, nástroj, batoh…)"
        addLabel="+ Přidat předmět"
        deleteLabel="Smazat předmět"
      />

      <div className="mt-3.5 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">
        Jazyky a ostatní zdatnosti
      </div>
      <ItemList
        name="languages"
        placeholder="Jazyk nebo zdatnost"
        tip="Jazyk, kterým postava mluví, nebo zdatnost (např. s nástrojem či zbraní), kterou ovládá"
        addLabel="+ Přidat jazyk"
        deleteLabel="Smazat jazyk"
      />
    </div>
  );
}
