"use server"; 

import { db } from "./db";

export async function registerAttendee(formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const ticketType = formData.get("ticketType"); 
  const phone = formData.get("phone") || null; 

  try {
    const event = await db.event.upsert({
      where: { slug: "crafted-excellence-2026" },
      update: {}, 
      create: {
        slug: "crafted-excellence-2026",
        name: "Crafted for Excellence",
        date: new Date("2026-10-24T09:00:00Z"),
        physicalLimit: 150
      }
    });

    const user = await db.user.upsert({
      where: { email },
      update: { name, phone }, 
      create: { email, name, phone }
    });

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const registration = await db.registration.upsert({
      where: {
        eventId_userId: { eventId: event.id, userId: user.id }
      },
      update: {}, 
      create: {
        eventId: event.id,
        userId: user.id,
        ticketType,
        accessCode
      }
    });

    // We are now explicitly returning BOTH codes to the frontend
    return { 
      success: true, 
      accessCode: registration.accessCode,
      qrCodeId: registration.qrCodeId 
    };

  } catch (error) {
    console.error("Database Error:", error);
    return { success: false, error: "Failed to register. Please try again." };
  }
}