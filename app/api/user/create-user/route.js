import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ConnectDB } from "@/lib/db/ConnectDB";
import UserModel from "@/lib/models/UserModel";
import { getSiteData, sendCredentialsEmail } from "@/lib/functions";

export async function POST(req) {
  try {
    const sitedata = await getSiteData();
    await ConnectDB();

    const { username, email, password, role } = await req.json();

    // 🔎 Validation
    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["ADMIN", "DEVADMIN"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

    // 🔐 Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 12 characters long, contain 1 uppercase, 1 lowercase, 1 number, and 1 special character",
        },
        { status: 400 }
      );
    }

    // 🔐 Check existing user
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Username or Email already exists" },
        { status: 409 }
      );
    }

    // 🔑 Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 👤 Create user
    const user = await UserModel.create({
      username,
      email,
      passwordHash,
      role,
    });

    // 📧 Send credentials email
    await sendCredentialsEmail({
      user,
      password, // plain password only for email
      sitedata,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created & credentials sent to email",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create User Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
