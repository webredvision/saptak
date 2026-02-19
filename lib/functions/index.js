import { unstable_noStore as noStore } from "next/cache";

import AboutUsModel from "@/lib/models/AboutUsModel";
import AmcsLogoModel from "@/lib/models/AmcsLogos";
import ArnModel from "@/lib/models/ArnModel";
import AwardModel from "@/lib/models/AwardsModel";
import BlogsModel from "@/lib/models/BlogModel";
import FaqModel from "@/lib/models/FaqsModel";
import MissionVisionModel from "@/lib/models/MissionVissionModel";
import SiteSettingsModel from "@/lib/models/SiteSetting";
import SocialMediaModel from "@/lib/models/SocialMedia";
import TeamModel from "@/lib/models/TeamModel";
import TestimonialModel from "@/lib/models/TestimonialModel";
import VideoModel from "@/lib/models/VideoModel";
import AdminModel from "@/lib/models/AdminModel";
import bcrypt from "bcryptjs";
import AdminServiceModel from "@/lib/models/AdminServiceModel";
import BotLeadsModel from "@/lib/models/Botlead";
import RiskUsersModel from "@/lib/models/RiskUsersModel";
import LeadsModel from "@/lib/models/LeadsModel";
import FinancialHealthUsersModel from "@/lib/models/FinancialHealthUsersModel";
import RoboModel from "@/lib/models/RoboModel";
import LoginGroupModel from "@/lib/models/LoginModel";
import fs from "fs";
import path from "path";
import StatsModel from "@/lib/models/StatModel";
import AnalyticsModel from "@/lib/models/AnalyticsModel";
import { ConnectDB } from "@/lib/db/ConnectDB";
import { fileTypeFromBuffer } from "file-type";
import UserModel from "@/lib/models/UserModel";
import { sendMail } from "@/lib/mail";
import CategoryModel from "@/lib/models/CategoryModel";
import WebpopupsModel from "@/lib/models/PopupsModel";

const toPlain = (data) => JSON.parse(JSON.stringify(data || null));
async function connectDBSafely() {
  try {
    await ConnectDB();
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
}

export async function getSiteData() {
  noStore();
  try {
    await connectDBSafely();
    const data = await SiteSettingsModel.findOne().lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getMissionVission() {
  noStore();
  try {
    await connectDBSafely();
    const data = await MissionVisionModel.findOne().lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getAboutusteams() {
  noStore();

  try {
    await connectDBSafely();
    const data = await TeamModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getSocialMedia() {
  noStore();
  try {
    await connectDBSafely();
    const defaults = [
      { title: "Facebook", url: "https://www.facebook.com" },
      { title: "Instagram", url: "https://www.instagram.com" },
      { title: "LinkedIn", url: "https://www.linkedin.com" },
      { title: "Twitter (X)", url: "https://x.com" },
      { title: "WhatsApp", url: "https://www.whatsapp.com" },
      { title: "YouTube", url: "https://www.youtube.com" },
    ];

    const escapeRegex = (value) =>
      String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    await SocialMediaModel.bulkWrite(
      defaults.map((item) => ({
        updateOne: {
          filter: { title: new RegExp(`^${escapeRegex(item.title)}$`, "i") },
          update: { $setOnInsert: { ...item, isHidden: false } },
          upsert: true,
        },
      })),
      { ordered: false },
    );

    const data = await SocialMediaModel.find().sort({ createdAt: 1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getArn() {
  noStore();
  try {
    await connectDBSafely();
    const data = await ArnModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getServiceData() {
  noStore();
  try {
    await connectDBSafely();
    const data = await AdminServiceModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getServiceDataBySlug(slug) {
  noStore();
  try {
    await connectDBSafely();
    const data = await AdminServiceModel.findOne({ link: slug }).lean();
    return toPlain(data || {});
  } catch (error) {
    return toPlain({});
  }
}

export async function getTestimonials() {
  noStore();
  try {
    await connectDBSafely();
    const data = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAwards() {
  noStore();
  try {
    await connectDBSafely();
    const data = await AwardModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getTeams() {
  noStore();

  try {
    await connectDBSafely();
    const data = await TeamModel.find().sort({ createdAt: -1 }).lean();

    return JSON.parse(JSON.stringify(data || []));
  } catch (error) {
    console.error("getTeams error:", error);
    return [];
  }
}

export async function getAboutus() {
  noStore();
  try {
    await connectDBSafely();
    const data = await AboutUsModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAllStats() {
  noStore();
  try {
    await connectDBSafely();
    const data = await StatsModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return toPlain([]);
  }
}

export async function getLatestBlogs() {
  noStore();
  try {
    await connectDBSafely();
    const blogs = await BlogsModel.find({})
      .populate("category")
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    return toPlain(blogs || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAddisLogos() {
  noStore();
  try {
    await connectDBSafely();
    const logos = await AmcsLogoModel.find({ addisstatus: true }).lean();
    return toPlain(logos || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getBlogs() {
  noStore();
  try {
    await connectDBSafely();
    const data = await BlogsModel.find()
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getActiveServicesCount() {
  noStore();
  try {
    await connectDBSafely();
    const count = await AdminServiceModel.countDocuments({ status: true });
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getBlogsCount() {
  noStore();
  try {
    await connectDBSafely();
    const count = await BlogsModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getTestimonialsCount() {
  noStore();
  try {
    await connectDBSafely();
    const count = await TestimonialModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getFaqsCount() {
  noStore();

  try {
    await connectDBSafely();
    const count = await FaqModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getAwardsCount() {
  noStore();
  try {
    await connectDBSafely();
    const count = await AwardModel.countDocuments();
    return count || 0;
  } catch (error) {
    return 0;
  }
}

export async function getStatsData() {
  noStore();
  try {
    await connectDBSafely();
    const stats = await StatsModel.find({}).sort({ createdAt: -1 }).lean();
    return toPlain(stats || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getAllLeadsCount() {
  noStore();
  try {
    await connectDBSafely();
    const [bot, risk, leads, health] = await Promise.all([
      BotLeadsModel.countDocuments(),
      RiskUsersModel.countDocuments(),
      LeadsModel.countDocuments(),
      FinancialHealthUsersModel.countDocuments(),
    ]);
    return bot + risk + leads + health;
  } catch (error) {
    return 0;
  }
}

export async function getVidios() {
  noStore();
  try {
    await connectDBSafely();
    const data = await VideoModel.find().sort({ createdAt: -1 }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getActiveLogindesk() {
  noStore();
  try {
    await connectDBSafely();

    const groups = await LoginGroupModel.find({
      "loginitems.isstatus": true,
    })
      .select("-loginitems._id")
      .lean();

    const filteredGroups = groups
      .map((group) => ({
        id: group._id.toString(),
        name: group.name,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt,
        loginitems: group.loginitems.filter(
          (item) => item.isstatus === true
        ),
      }))
      .filter((group) => group.loginitems.length > 0);

    return filteredGroups;
  } catch (error) {
    console.error("getActiveLogindesk error:", error);
    return [];
  }
}


export async function getRoboUser() {
  noStore();
  try {
    await connectDBSafely();
    const roboUser = await RoboModel.findOne({
      roboUser: true,
      softwareUser: true,
    })
      .sort({ createdAt: -1 })
      .lean();
    return toPlain(roboUser || null);
  } catch (error) {
    return null;
  }
}

export async function getAnalytics() {
  noStore();
  try {
    await connectDBSafely();

    // Fetch the latest Analytics document (you only have one)
    const analyticsData = await AnalyticsModel.findOne()
      .sort({ createdAt: -1 })
      .lean();

    return toPlain(analyticsData || null); // return plain object or null if none
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}

export async function getBlogBySlug(slug) {
  noStore();
  try {
    await connectDBSafely();
    const blog = await BlogsModel.findOne({ slug }).populate("category").lean();
    return toPlain(blog || {});
  } catch (error) {
    return toPlain({});
  }
}

export function slugify(text) {
  noStore();
  try {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  } catch (error) {
    console.error("slugify error:", error.message);
    return "";
  }
}

export async function getFaqs() {
  noStore();
  try {
    await connectDBSafely();
    const data = await FaqModel.find().lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function getWebPopups() {
  noStore();
  try {
    await connectDBSafely();
    const data = await WebpopupsModel.find({ status: true }).lean();
    return toPlain(data || []);
  } catch (error) {
    return toPlain([]);
  }
}

export async function loginUser({ username, password }) {
  noStore();
  try {
    if (!username || !password) return null;
    const user = await AdminModel.findOne({ username }).lean();
    if (!user) return null;
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
    return {
      id: String(user._id),
      name: user.username,
      role: user.role || "normaladmin",
    };
  } catch (error) {
    console.error("loginUser error:", error.message);
    return null;
  }
}

export async function DevLogin({ username, password }) {
  noStore();
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_DATA_API}/api/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id || data._id,
      name: data.username || data.name,
      role: data.role || "devadmin",
    };
  } catch (error) {
    console.error("DevLogin error:", error.message);
    return null;
  }
}

export async function userForgetToken(requestId) {
  noStore();
  try {
    await ConnectDB();

    if (!requestId) {
      return { error: "RequestId  is required" };
    }

    // Find user with the token
    const user = await UserModel.findOne({
      resetPasswordRequestId: requestId,
      resetPasswordExpiry: { $gt: new Date() },
    }).select("_id");

    if (!user) {
      return { error: "Invalid or expired reset link" };
    }

    // Token valid
    return { user };
  } catch (err) {
    console.error("userForgetToken error:", err);
    return { error: "Internal server error" };
  }
}

// Allowed real image MIME types
const allowedMime = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/avif",
  "image/webp",
  "image/gif",
  // "image/svg"
];

// Allowed image extensions (recommended check alongside MIME checking)
const allowedExtensions = [
  ".png",
  ".jpg",
  ".jpeg",
  ".avif",
  ".webp",
  ".gif",
  // Note: ".svg" intentionally omitted here by default for maximum safety.
  // If you want to allow SVG, add ".svg" and keep the SVG sanitization below.
];

// Dangerous or malware-prone extensions to block
const forbiddenExtensions = [
  // Script & source
  ".js",
  ".mjs",
  ".ts",
  ".jsx",
  ".tsx",
  ".php",
  ".phtml",
  ".py",
  ".rb",
  ".pl",
  ".sh",
  ".bash",
  ".ps1",
  ".cmd",
  ".bat",

  // Executables & system
  ".exe",
  ".msi",
  ".apk",
  ".bin",
  ".dll",
  ".so",
  ".dylib",
  ".com",
  ".scr",

  // HTML / web payloads
  ".html",
  ".htm",
  ".xhtml",

  // Documents (macros / embedded code)
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".rtf",
  ".odt",

  // Archives (can contain nested malware)
  ".zip",
  ".rar",
  ".7z",
  ".gz",
  ".tar",
  ".tgz",
  ".bz2",
  ".xz",
  ".iso",
  ".dmg",

  // Data / structured formats that can be abused
  ".json",
  ".xml",
  ".yaml",
  ".yml",
  ".csv",

  // Media containers that can carry payloads
  ".mp4",
  ".mp3",
  ".mov",
  ".avi",
  ".mkv",

  // Other suspicious
  ".torrent",
  ".lnk",
  ".reg",
  ".tz",
  ".dat",
];

export async function saveImageToLocal(section, file) {
  try {
    // 2️⃣ Block large files (limit: 1MB)
    if (file.size > 500 * 1024) {
      return { error: "File too large", status: 400 };
    }

    const originalName = String(file.name || "").toLowerCase();

    // 3️⃣ Block forbidden extensions (including double-extension tricks)
    // Build a regex that matches any forbidden extension either at end or followed by another dot
    const forbiddenPattern = new RegExp(
      "(" +
      forbiddenExtensions.map((e) => e.replace(".", "\\.")).join("|") +
      ")(?:$|\\.)",
      "i",
    );

    if (forbiddenPattern.test(originalName)) {
      return { error: "Malicious file type blocked", status: 400 };
    }

    // 4️⃣ Read buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // 4.b️⃣ Scan buffer with NodeClam

    // 5️⃣ Detect real MIME by file header
    // Assumes fileTypeFromBuffer is available in scope (e.g. import { fileTypeFromBuffer } from 'file-type')
    const detected = await fileTypeFromBuffer(buffer); // returns { ext, mime } or undefined

    // Helper: get extension from detected or filename
    const extFromFilename = (() => {
      const idx = originalName.lastIndexOf(".");
      return idx !== -1 ? originalName.slice(idx) : "";
    })();

    const detectedMime = detected?.mime || null;
    const detectedExt = detected?.ext ? "." + detected.ext.toLowerCase() : null;

    // If we detected a binary image MIME, ensure it's allowed
    if (detectedMime) {
      if (!allowedMime.includes(detectedMime)) {
        return {
          error: "Invalid or unsafe file. Only real images allowed.",
          status: 400,
        };
      }
      // Further ensure the detected extension is a permitted image extension
      if (
        detectedExt &&
        !allowedExtensions.includes(detectedExt) &&
        detectedExt !== ".svg"
      ) {
        // if detectedExt is svg we'll handle below; otherwise reject
        return { error: "Image format not allowed.", status: 400 };
      }
    } else {
      // detected MIME is undefined (some formats like SVG may not be detected by magic bytes)
      // If filename extension is not an allowed image extension, reject
      if (
        !allowedExtensions.includes(extFromFilename) &&
        extFromFilename !== ".svg"
      ) {
        return {
          error: "Invalid or unsafe file. Only real images allowed.",
          status: 400,
        };
      }
    }

    // 5.b️⃣ Special handling & sanitization for SVGs (text-based and can contain scripts)
    const isSvgByName = extFromFilename === ".svg";
    const isSvgByDetected =
      detectedMime === "image/svg+xml" || detectedExt === ".svg";
    if (isSvgByName || isSvgByDetected) {
      // If you prefer to block SVG entirely, uncomment the line below:
      // return NextResponse.json({ error: "SVG not allowed for security reasons." }, { status: 400 });

      // Basic SVG sanitization: look for obvious JS payloads / event handlers
      const text = buffer.toString("utf8").toLowerCase();

      // Reject if it does not contain an <svg tag
      if (!text.includes("<svg")) {
        return { error: "Invalid SVG file.", status: 400 };
      }

      // Patterns that commonly indicate embedded scripts or XSS vectors
      const dangerousSvgPatterns = [
        /<script\b/i,
        /on\w+\s*=/i, // onload=, onclick=, etc.
        /javascript:/i,
        /xlink:href\s*=\s*['"]?javascript:/i,
        /<!\[CDATA\[/i,
      ];

      for (const pat of dangerousSvgPatterns) {
        if (pat.test(text)) {
          return { error: "Unsafe SVG content blocked.", status: 400 };
        }
      }

      // If we reach here, SVG passed basic heuristics. Proceed but continue with caution.
      // (For stronger security, run a proper SVG sanitizer library server-side.)
    }

    // 6️⃣ Safe filename: allow only a limited charset and collapse sequential underscores
    // Keep original extension (from filename) but normalize
    const safeBase = originalName
      .replace(/[^a-z0-9.-]/g, "_") // replace bad chars
      .replace(/_+/g, "_") // collapse multiple underscores
      .replace(/(^_+|_+$)/g, ""); // trim leading/trailing underscores

    const filename = `${Date.now()}-${safeBase}`;

    // 7️⃣ Ensure upload directory exists
    const uploadDir = path.join(
      process.cwd(),
      process.env.UPLOAD_URL || "uploads",
      section,
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // 8️⃣ Save file
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    return {
      filename,
      url: `/api/uploads?section=${encodeURIComponent(section)}&filename=${encodeURIComponent(filename)}`,
      status: 200,
    };
  } catch (err) {
    console.error("Upload Error:", err);
    return { error: "Internal Server Error", status: 500 };
  }
}

export async function savePdfToLocal(section, file) {
  try {
    // 1️⃣ Only allow PDF MIME
    if (file.type !== "application/pdf") {
      return { error: "Only PDF files are allowed", status: 400 };
    }

    // 2️⃣ Block large files (e.g., 5MB limit for PDFs)
    if (file.size > 2 * 1024 * 1024) {
      return { error: "File too large", status: 400 };
    }

    const originalName = String(file.name || "").toLowerCase();

    // 3️⃣ Block dangerous extensions (just in case someone renames a malicious file to .pdf)
    const forbiddenExtensions = [
      ".js",
      ".exe",
      ".php",
      ".sh",
      ".bat",
      ".cmd",
      ".mjs",
      ".ts",
      ".py",
    ];
    const forbiddenPattern = new RegExp(
      "(" +
      forbiddenExtensions.map((e) => e.replace(".", "\\.")).join("|") +
      ")(?:$|\\.)",
      "i",
    );
    if (forbiddenPattern.test(originalName)) {
      return { error: "Malicious file type blocked", status: 400 };
    }

    // 4️⃣ Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // 6️⃣ Safe filename
    const safeBase = originalName
      .replace(/[^a-z0-9.-]/g, "_")
      .replace(/_+/g, "_")
      .replace(/(^_+|_+$)/g, "");
    const filename = `${Date.now()}-${safeBase}`;

    // 7️⃣ Ensure upload directory exists
    const uploadDir = path.join(
      process.cwd(),
      process.env.UPLOAD_URL || "uploads",
      section,
    );
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    // 8️⃣ Save file
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);

    // 9️⃣ Return uploaded file info
    return {
      filename,
      url: `/api/uploads?section=${encodeURIComponent(section)}&filename=${encodeURIComponent(filename)}`,
      status: 200,
    };
  } catch (err) {
    console.error("PDF Upload Error:", err);
    return { error: "Internal Server Error", status: 500 };
  }
}

export async function sendOtpEmail({ otp, user, sitedata }) {
  await sendMail({
    to: user.email,
    subject: "Admin Login OTP",
    html: `
      <p><strong>Admin Login OTP</strong></p>

      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><th>Field</th><th>Details</th></tr>
        <tr><td>User Name</td><td>${user.username}</td></tr>
        <tr><td>Email</td><td>${user.email}</td></tr>
        <tr><td>OTP</td><td><strong>${otp}</strong></td></tr>
        <tr><td>Valid For</td><td>1 Minute</td></tr>
      </table>

      <p>Please do not share this OTP with anyone.</p>
      <p><strong>${sitedata.websiteName} Team</strong></p>
    `,
  });
}

export async function sendCredentialsEmail({ user, password, sitedata }) {
  await sendMail({
    to: user.email,
    subject: "Your Admin Account Credentials",
    html: `
      <p><strong>Your Admin Account Has Been Created</strong></p>

      <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%;">
        <tr><th>Field</th><th>Details</th></tr>
        <tr><td>Username</td><td>${user.username}</td></tr>
        <tr><td>Email</td><td>${user.email}</td></tr>
        <tr><td>Password</td><td><strong>${password}</strong></td></tr>
        <tr><td>Role</td><td>${user.role}</td></tr>
      </table>

      <p>Please login and change your password after first login.</p>
      <p><strong>${sitedata.websiteName} Team</strong></p>
    `,
  });
}

export function deleteFileIfExists(section, filename) {
  try {
    const filePath = path.join(
      process.cwd(),
      process.env.UPLOAD_URL,
      section,
      filename,
    );
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("deleteFileIfExists error:", error.message);
    return false;
  }
}

const TOKEN_MAX_AGE = 30 * 60 * 1000; // 30 minutes

export async function validateUserTokenLogic({ id, deviceId, tokenVersion }) {
  if (!id || !deviceId || tokenVersion === undefined) {
    return { valid: false, message: "Missing id, deviceId, or tokenVersion" };
  }

  await ConnectDB();

  const user = await UserModel.findById(id);
  if (!user) {
    return { valid: false, message: "User not found" };
  }

  const deviceData = user.sessionsversion.get(deviceId);
  if (!deviceData) {
    return { valid: false, message: "Device not found or logged out" };
  }

  const { version, createdAt } = deviceData;

  if (version !== tokenVersion) {
    return { valid: false, message: "Token invalidated (logged out)" };
  }

  const now = Date.now();
  if (createdAt + TOKEN_MAX_AGE < now) {
    user.sessionsversion.delete(deviceId);
    await user.save();
    return { valid: false, message: "Token expired" };
  }

  return {
    valid: true,
    user: { id: user._id.toString(), role: user.role, deviceId, tokenVersion },
  };
}
