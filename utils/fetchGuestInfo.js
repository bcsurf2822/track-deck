import { connectMongo } from "@/lib/mongoose";
import User from "@/models/User";

export const fetchGuestInfo = async (guestId) => {
  try {
    await connectMongo();
    const user = await User.findOne({ _id: guestId, isGuest: true }).lean();
    return user || null;
  } catch (error) {
    console.error("[fetchGuestInfo] Failed to fetch guest user:", error.message);
    return null;
  }
};
