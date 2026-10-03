import { JOE_ICON_PATH } from "./joe-icon";

// Registers Joe's own icon set so the sidebar can show "energy-joe:joe".
// Loaded by Home Assistant as an extra frontend module, independent of the panel.
interface CustomIcon {
  path: string;
  viewBox?: string;
}

interface CustomIconset {
  getIcon(name: string): Promise<CustomIcon | undefined>;
  getIconList(): Promise<{ name: string }[]>;
}

const ICONS: Record<string, CustomIcon> = {
  joe: { path: JOE_ICON_PATH, viewBox: "0 0 24 24" },
};

const target = window as unknown as { customIcons?: Record<string, CustomIconset> };
target.customIcons = target.customIcons ?? {};
target.customIcons["energy-joe"] = {
  getIcon: async (name) => ICONS[name],
  getIconList: async () => Object.keys(ICONS).map((name) => ({ name })),
};
