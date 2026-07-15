import type { SectionId } from "@/lib/data/sheet";
import { BASIC_FIELDS, COMBAT_FIELDS, PERSONALITY_FIELDS, APPEARANCE_FIELDS, BACKSTORY_FIELDS } from "@/lib/data/sheet";
import { FieldGridSection } from "@/components/sheet/field-grid-section";
import { AbilitiesSection } from "@/components/sheet/sections/abilities-section";
import { AttacksSection } from "@/components/sheet/sections/attacks-section";
import { FeaturesSection } from "@/components/sheet/sections/features-section";
import { SpellsSection } from "@/components/sheet/sections/spells-section";

export function SheetSectionContent({
  id,
  onRoll,
}: {
  id: SectionId;
  onRoll: (bonus: number, label: string) => void;
}) {
  switch (id) {
    case "basic":
      return <FieldGridSection sectionKey="basic" fields={BASIC_FIELDS} />;
    case "combat":
      return <FieldGridSection sectionKey="combat" fields={COMBAT_FIELDS} />;
    case "abilities":
      return <AbilitiesSection onRoll={onRoll} />;
    case "attacks":
      return <AttacksSection />;
    case "personality":
      return <FieldGridSection sectionKey="personality" fields={PERSONALITY_FIELDS} />;
    case "features":
      return <FeaturesSection />;
    case "appearance":
      return <FieldGridSection sectionKey="appearance" fields={APPEARANCE_FIELDS} />;
    case "backstory":
      return <FieldGridSection sectionKey="backstory" fields={BACKSTORY_FIELDS} />;
    case "spells":
      return <SpellsSection />;
  }
}
