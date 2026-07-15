import { ItemList } from "@/components/sheet/item-list";

export function FeaturesSection() {
  return (
    <div>
      <div className="mt-0 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">Schopnosti a rysy</div>
      <ItemList
        name="features"
        placeholder="Schopnost nebo rys"
        addLabel="+ Přidat schopnost"
        deleteLabel="Smazat schopnost"
      />

      <div className="mt-3.5 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">Vybavení</div>
      <ItemList name="equipment" placeholder="Předmět" addLabel="+ Přidat předmět" deleteLabel="Smazat předmět" />

      <div className="mt-3.5 mb-1.5 text-[0.68rem] tracking-wide text-text-dim uppercase">
        Jazyky a ostatní zdatnosti
      </div>
      <ItemList name="languages" placeholder="Jazyk nebo zdatnost" addLabel="+ Přidat jazyk" deleteLabel="Smazat jazyk" />
    </div>
  );
}
