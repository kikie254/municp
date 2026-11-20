import {
  Compass, Trash2, Leaf, Trees, TrafficCone, Store, Users, FileText,
  ShieldCheck, MapPinned, Sparkles, Scale,
} from "lucide-react";

const map = {
  planning: Compass,
  waste: Trash2,
  environment: Leaf,
  spaces: Trees,
  infrastructure: TrafficCone,
  trade: Store,
  community: Users,
  information: FileText,
  governance: Scale,
  mandate: ShieldCheck,
  location: MapPinned,
} as const;

export type IconKey = keyof typeof map;

export function ServiceIcon({ name, className = "h-5 w-5" }: { name: IconKey | string; className?: string }) {
  const Cmp = map[name as IconKey] ?? Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}
