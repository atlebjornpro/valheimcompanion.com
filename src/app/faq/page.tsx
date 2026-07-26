const questions = [
  ["What version does this site target?", "Enshrouded v0.9.1.2. The current-version page records the review date and links to official release information."],
  ["Is Enshrouded still in Early Access?", "Yes. Keen Games has announced the 1.0 launch for October 15, 2026."],
  ["What is the current maximum level?", "The current character level cap is 45. A fully progressed character can spend up to 184 skill points."],
  ["Can I choose a class?", "There are no locked classes. Any connected route through the skill tree is available, so weapons, armor, food, and selected nodes define the build."],
  ["Why can’t I enter red Shroud?", "Red deadly Shroud is above your current passage level. Strengthen the Flame at an Altar, then return."],
  ["Do Shroud Roots and Elixir Wells keep giving points after a reset?", "No. They respawn with the world, but each character receives their skill-point reward only once."],
  ["Does Comfort make Rested stronger?", "Comfort extends Rested duration. Character level controls the stamina and regeneration bonuses."],
  ["Where is checklist data stored?", "The Adventure Checklist and Flame Planner use browser storage on this device. They do not require an account or send your progress to a server."],
];

export const metadata = { title: "FAQ", description: "Common questions about Enshrouded progression and Companion tools." };

export default function FAQPage() {
  return <div className="mx-auto max-w-4xl py-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Quick answers</p><h1 className="mt-2 text-4xl font-black tracking-tight text-stone-100">Frequently Asked Questions</h1><div className="mt-8 space-y-3">{questions.map(([question, answer]) => <details key={question} className="group rounded-2xl border border-stone-800 bg-stone-900/45 p-5 open:border-amber-400/20"><summary className="cursor-pointer list-none font-bold text-stone-100 marker:hidden">{question}<span className="float-right text-amber-400 transition group-open:rotate-45">+</span></summary><p className="mt-3 max-w-3xl text-sm leading-6 text-stone-400">{answer}</p></details>)}</div></div>;
}
