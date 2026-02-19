import { ConnectDB } from "@/lib/db/ConnectDB";
import Permissions from "@/lib/models/Permissions";
import RoboModel from "@/lib/models/RoboModel";
import { menuGroups, logoGroups } from "@/data/menu";

export async function GET() {
  try {
    await ConnectDB();

    // Get Robo user
    const robo = await RoboModel.findOne().lean();

    // Fetch all permissions from database
    let dbPermissions = await Permissions.find({}).lean();
    const dbPermMap = new Map(dbPermissions.map(p => [p.permission, p]));

    // Static permissions from data/menu.js
    const staticPermissions = [];
    menuGroups.forEach(group => {
      group.menuItems.forEach(item => {
        if (item.permission) staticPermissions.push(item.permission);
        if (item.children) {
          item.children.forEach(child => {
            if (child.permission) staticPermissions.push(child.permission);
          });
        }
      });
    });
    logoGroups.forEach(group => {
      group.logotems.forEach(item => {
        if (item.permission) staticPermissions.push(item.permission);
      });
    });

    // Ensure all static permissions exist in DB
    for (const perm of staticPermissions) {
      if (!dbPermMap.has(perm)) {
        const newPerm = await Permissions.create({ permission: perm, enabled: true });
        dbPermissions.push(newPerm);
      }
    }

    // Map permissions and force risk_questions = false if softwareUser is true
    const formattedPermissions = dbPermissions.map(p => {
      if (p.permission === "risk_questions" && robo?.softwareUser) {
        return { permission: p.permission, enabled: false, __v: p.__v };
      }
      return { permission: p.permission, enabled: p.enabled, __v: p.__v };
    });

    return new Response(JSON.stringify(formattedPermissions), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Failed" }), { status: 500 });
  }
}
export async function PATCH(req) {
  try {
    await ConnectDB();
    const { permission, enabled } = await req.json();

    const robo = await RoboModel.findOne();

    // Force disable risk_questions if softwareUser is true
    let newEnabled = enabled;
    if (permission === "risk_questions" && robo?.softwareUser) {
      newEnabled = false;
    }

    await Permissions.updateOne(
      { permission },
      { $set: { enabled: newEnabled } },
      { upsert: true }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, error: "Failed" }), { status: 500 });
  }
}
