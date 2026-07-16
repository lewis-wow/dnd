import type { SectionId } from "@/lib/data/sheet";
import { BASIC_FIELDS, COMBAT_FIELDS, PERSONALITY_FIELDS, APPEARANCE_FIELDS, BACKSTORY_FIELDS } from "@/lib/data/sheet";
import { FieldGridSection } from "@/components/sheet/field-grid-section";
import { AbilityScoresSection } from "@/components/sheet/sections/ability-scores-section";
import { SavingThrowsSection } from "@/components/sheet/sections/saving-throws-section";
import { SkillsSection } from "@/components/sheet/sections/skills-section";
import { AttacksSection } from "@/components/sheet/sections/attacks-section";
import { FeaturesSection } from "@/components/sheet/sections/features-section";
import { EquipmentSection } from "@/components/sheet/sections/equipment-section";
import { LanguagesSection } from "@/components/sheet/sections/languages-section";
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
    case "abilityScores":
      return <AbilityScoresSection />;
    case "savingThrows":
      return <SavingThrowsSection onRoll={onRoll} />;
    case "skills":
      return <SkillsSection onRoll={onRoll} />;
    case "attacks":
      return <AttacksSection />;
    case "personality":
      return <FieldGridSection sectionKey="personality" fields={PERSONALITY_FIELDS} />;
    case "features":
      return <FeaturesSection />;
    case "equipment":
      return <EquipmentSection />;
    case "languages":
      return <LanguagesSection />;
    case "appearance":
      return <FieldGridSection sectionKey="appearance" fields={APPEARANCE_FIELDS} />;
    case "backstory":
      return <FieldGridSection sectionKey="backstory" fields={BACKSTORY_FIELDS} />;
    case "spells":
      return <SpellsSection />;
  }
}
