export type CombatStyle = "melee" | "ranged" | "magic";

export type DamageLoadout = {
  style: CombatStyle;
  weaponDamage: number;
  attribute: number;
  otherBonus: number;
  critChance: number;
  critMultiplier: number;
  weakPointMultiplier: number;
  actionMultiplier: number;
  attackSeconds: number;
  targetMultiplier: number;
};

export type DamageResult = {
  regularHit: number;
  criticalHit: number;
  averageHit: number;
  estimatedDps: number;
  nextAttributeDpsGain: number;
  totalDamageBonus: number;
};

export const loadoutA: DamageLoadout = {
  style: "melee",
  weaponDamage: 100,
  attribute: 10,
  otherBonus: 10,
  critChance: 5,
  critMultiplier: 150,
  weakPointMultiplier: 100,
  actionMultiplier: 100,
  attackSeconds: 1,
  targetMultiplier: 100,
};

export const loadoutB: DamageLoadout = {
  style: "ranged",
  weaponDamage: 90,
  attribute: 10,
  otherBonus: 20,
  critChance: 15,
  critMultiplier: 160,
  weakPointMultiplier: 120,
  actionMultiplier: 100,
  attackSeconds: 0.8,
  targetMultiplier: 100,
};

const limits: Record<keyof Omit<DamageLoadout, "style">, [number, number]> = {
  weaponDamage: [0, 10000],
  attribute: [0, 100],
  otherBonus: [-100, 1000],
  critChance: [0, 100],
  critMultiplier: [0, 1000],
  weakPointMultiplier: [0, 1000],
  actionMultiplier: [0, 1000],
  attackSeconds: [0.05, 60],
  targetMultiplier: [0, 1000],
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

export function normalizeLoadout(value: DamageLoadout): DamageLoadout {
  const style: CombatStyle = ["melee", "ranged", "magic"].includes(value.style) ? value.style : "melee";
  return Object.fromEntries(
    Object.entries({ ...value, style }).map(([key, entry]) => {
      if (key === "style") return [key, entry];
      const [min, max] = limits[key as keyof typeof limits];
      return [key, clamp(Number(entry), min, max)];
    }),
  ) as DamageLoadout;
}

export function calculateDamage(input: DamageLoadout): DamageResult {
  const value = normalizeLoadout(input);
  const totalDamageBonus = value.attribute * 5 + value.otherBonus;
  const additiveMultiplier = Math.max(0, 1 + totalDamageBonus / 100);
  const situationalMultiplier =
    (value.weakPointMultiplier / 100) *
    (value.actionMultiplier / 100) *
    (value.targetMultiplier / 100);
  const regularHit = value.weaponDamage * additiveMultiplier * situationalMultiplier;
  const criticalHit = regularHit * (value.critMultiplier / 100);
  const critProbability = value.critChance / 100;
  const averageHit = regularHit * (1 - critProbability) + criticalHit * critProbability;
  const estimatedDps = averageHit / value.attackSeconds;
  const expectedCritMultiplier = 1 - critProbability + (value.critMultiplier / 100) * critProbability;
  const nextAttributeDpsGain =
    (value.weaponDamage * 0.05 * situationalMultiplier * expectedCritMultiplier) /
    value.attackSeconds;

  return { regularHit, criticalHit, averageHit, estimatedDps, nextAttributeDpsGain, totalDamageBonus };
}

export function serializeLoadout(input: DamageLoadout) {
  const value = normalizeLoadout(input);
  return [
    value.style,
    value.weaponDamage,
    value.attribute,
    value.otherBonus,
    value.critChance,
    value.critMultiplier,
    value.weakPointMultiplier,
    value.actionMultiplier,
    value.attackSeconds,
    value.targetMultiplier,
  ].join(",");
}

export function parseLoadout(serialized: string | undefined, fallback: DamageLoadout) {
  if (!serialized) return fallback;
  const [style, ...numbers] = serialized.split(",");
  if (numbers.length !== 9 || !["melee", "ranged", "magic"].includes(style)) return fallback;
  const parsed = numbers.map(Number);
  if (parsed.some((value) => !Number.isFinite(value))) return fallback;
  return normalizeLoadout({
    style: style as CombatStyle,
    weaponDamage: parsed[0],
    attribute: parsed[1],
    otherBonus: parsed[2],
    critChance: parsed[3],
    critMultiplier: parsed[4],
    weakPointMultiplier: parsed[5],
    actionMultiplier: parsed[6],
    attackSeconds: parsed[7],
    targetMultiplier: parsed[8],
  });
}

export function attributeName(style: CombatStyle) {
  if (style === "melee") return "Strength";
  if (style === "ranged") return "Dexterity";
  return "Intelligence";
}
