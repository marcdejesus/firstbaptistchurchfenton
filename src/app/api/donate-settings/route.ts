import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const donateSettings = await prisma.donateSettings.findFirst({
      where: {
        isActive: true,
      },
      select: {
        donateUrl: true,
        description: true,
      }
    });

    if (!donateSettings) {
      return NextResponse.json({ 
        donateUrl: "https://www.paypal.com/donate?token=6-wnb_Sj_MupmasvWZnxJSDO899HjDQcX5bp4X63zwZrAL0QI_VKxgXHkGaWENDHRxbNG4Yw5txQpqKA",
        description: "We want giving to be simple, secure, and impactful. Your generosity helps us continue our mission of making disciples and serving our community."
      });
    }

    return NextResponse.json(donateSettings);
  } catch (error) {
    console.error('Error fetching donate settings:', error);
    // Return fallback values if there's an error
    return NextResponse.json({ 
      donateUrl: "https://www.paypal.com/donate?token=6-wnb_Sj_MupmasvWZnxJSDO899HjDQcX5bp4X63zwZrAL0QI_VKxgXHkGaWENDHRxbNG4Yw5txQpqKA",
      description: "We want giving to be simple, secure, and impactful. Your generosity helps us continue our mission of making disciples and serving our community."
    });
  }
}
