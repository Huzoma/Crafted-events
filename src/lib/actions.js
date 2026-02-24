"use server"; 

import { cookies } from "next/headers";
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

export async function verifyScannerPin(pin) {
  try {
    // 1. Check if the PIN exists and hasn't been deactivated by the Host
    const validPin = await db.scannerPin.findFirst({
      where: { 
        pin: pin,
        isActive: true 
      }
    });

    if (!validPin) {
      return { success: false, error: "Invalid or deactivated PIN." };
    }

    // 2. Generate the secure cookie
    // In Next.js 15, cookies() is asynchronous, so we must await it!
    const cookieStore = await cookies();
    
    // We set an 'httpOnly' cookie. 
    // Why? It prevents malicious browser extensions from stealing the session!
    cookieStore.set("scanner_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12, // Automatically expires in 12 hours
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("PIN Verification Error:", error);
    return { success: false, error: "System error. Please try again." };
  }
}

export async function verifyHostLogin(email, loginCode) {
  try {
    // 1. Look up the Admin by email
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    // 2. Verify the login code matches
    if (!admin || admin.loginCode !== loginCode) {
      return { success: false, error: "Invalid email or login code." };
    }

    // 3. Issue the secure Host cookie
    const cookieStore = await cookies();
    cookieStore.set("host_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours for the host
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Host Login Error:", error);
    return { success: false, error: "System error. Please try again." };
  }
}