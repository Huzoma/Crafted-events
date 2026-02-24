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

export async function verifyTicket(qrCodeId) {
  try {
    // 1. Look up the registration using the secure QR payload
    const registration = await db.registration.findUnique({
      where: { qrCodeId },
      include: { user: true } // We include the user to display their name on the scanner screen
    });

    // 2. Scenario A: Fake or completely invalid code
    if (!registration) {
      return { success: false, status: "INVALID", message: "Invalid QR Code. No record found in the database." };
    }

    // 3. Scenario B: Legitimate code, but someone already used it
    if (registration.status === "CHECKED_IN") {
      const time = registration.checkedInAt ? new Date(registration.checkedInAt).toLocaleTimeString() : "earlier";
      return { 
        success: false, 
        status: "ALREADY_USED", 
        message: `Already scanned at ${time}.`, 
        name: registration.user.name 
      };
    }

    // 4. Scenario C: Valid code, first time scanning. Let them in!
    const updatedRegistration = await db.registration.update({
      where: { id: registration.id },
      data: {
        status: "CHECKED_IN",
        checkedInAt: new Date()
      }
    });

    return { 
      success: true, 
      status: "VALID", 
      message: "Successfully checked in!", 
      name: registration.user.name 
    };

  } catch (error) {
    console.error("Verification error:", error);
    return { success: false, status: "ERROR", message: "System error. Please try scanning again." };
  }
}