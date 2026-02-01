import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectMongo();

    const uniqueId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const guestName = `guest${uniqueId.slice(-4)}`;
    const guestEmail = `${guestName}@trackdeck.com`;

    const guestUser = await User.create({
      name: guestName,
      isGuest: true,
      email: guestEmail,
    });

    const response = NextResponse.json({
      message: "Guest user created successfully",
      guest: {
        id: guestUser._id.toString(),
        name: guestUser.name,
        isGuest: true,
      },
    });

    const guestIdValue = guestUser._id.toString();

    response.cookies.set({
      name: "guestId",
      value: guestIdValue,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.headers.set("Guest-ID", guestIdValue);

    return response;
  } catch (error) {
    console.error("[guest-route-POST]", error.message);

    return NextResponse.json(
      { error: "Unable to create guest user", details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectMongo();
    const body = await req.json();
    const { guestId } = body;

    if (!guestId) {
      return NextResponse.json(
        { error: "Guest ID is required" },
        { status: 400 }
      );
    }

    const guestUser = await User.findById(guestId);
    if (!guestUser || !guestUser.isGuest) {
      return NextResponse.json(
        { error: "Guest user not found or invalid" },
        { status: 404 }
      );
    }

    await User.deleteOne({ _id: guestId });

    const response = NextResponse.json({
      message: "Guest user deleted successfully",
      guest: {
        id: guestUser._id,
        name: guestUser.name,
      },
    });

    response.cookies.set("guestId", "", {
      maxAge: 0,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      httpOnly: true,
    });

    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("[guest-route-DELETE]", error.message);

    return NextResponse.json(
      {
        error: "Unable to delete guest user",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
