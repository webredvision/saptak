
import { connectDB } from "./db";
import Setting from "./models/settings";

export async function getThemeConfig() {
  await connectDB();
  const doc = await Setting.findOne({ key: "theme" }).lean();
  return { base_theme: doc?.value?.base_theme || "theme1" };
}

export async function setBaseTheme(theme) {
  await connectDB();
  const doc = await Setting.findOneAndUpdate(
    { key: "theme" },
    { value: { base_theme: theme } },
    { upsert: true, new: true }
  );
  return doc;
}
