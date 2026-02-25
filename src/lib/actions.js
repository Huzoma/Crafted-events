"use server";

import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { db } from "./db"; // Ensure this matches your actual Prisma database import path!

// ==========================================
// REGISTRATION & EMAIL LOGIC
// ==========================================
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

    // The Capacity Block Check
    if (ticketType === "PHYSICAL") {
      const currentPhysicalCount = await db.registration.count({
        where: { eventId: event.id, ticketType: "PHYSICAL" }
      });

      if (currentPhysicalCount >= event.physicalLimit) {
        return { 
          success: false, 
          error: "We're sorry, physical seats are completely sold out! Please register for a Virtual Pass instead." 
        };
      }
    }

    const user = await db.user.upsert({
      where: { email },
      update: { name, phone }, 
      create: { email, name, phone }
    });

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const registration = await db.registration.upsert({
      where: { eventId_userId: { eventId: event.id, userId: user.id } },
      update: {}, 
      create: { eventId: event.id, userId: user.id, ticketType, accessCode }
    });

    // Send the QR Code Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${registration.qrCodeId}`;

    const mailOptions = {
      from: `"Crafted Excellence" <${process.env.EMAIL_USER}>`,
      to: email, 
      subject: "Your Ticket: Crafted for Excellence 2026",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 12px;">
          <h2 style="color: #0f172a;">You're in, ${name}!</h2>
          <p style="color: #475569; line-height: 1.6;">Your physical seat for <strong>Crafted for Excellence</strong> is officially secured. Please present the QR code below to the volunteers at the entrance for scanning.</p>
          
          <div style="text-align: center; margin: 40px 0; padding: 20px; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
            <img src="${qrImageUrl}" alt="Your Ticket QR Code" style="width: 200px; height: 200px; border-radius: 8px;" />
            <p style="color: #94a3b8; font-size: 12px; font-family: monospace; margin-top: 16px; letter-spacing: 2px;">${registration.qrCodeId}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px;">We look forward to seeing you there!</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return { success: true, accessCode: registration.accessCode, qrCodeId: registration.qrCodeId };

  } catch (error) {
    console.error("Database or Email Error:", error);
    return { success: false, error: "Failed to process registration. Please try again." };
  }
}

// ==========================================
// SCANNER & HOST AUTHENTICATION
// ==========================================
export async function verifyScannerPin(pin) {
  try {
    const validPin = await db.scannerPin.findFirst({
      where: { pin: pin, isActive: true }
    });

    if (!validPin) return { success: false, error: "Invalid or deactivated PIN." };

    const cookieStore = await cookies();
    cookieStore.set("scanner_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 12, 
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
    const admin = await db.admin.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!admin || admin.loginCode !== loginCode) {
      return { success: false, error: "Invalid email or login code." };
    }

    const cookieStore = await cookies();
    cookieStore.set("host_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, 
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Host Login Error:", error);
    return { success: false, error: "System error. Please try again." };
  }
}

// ==========================================
// HOST DASHBOARD ANALYTICS & PIN MANAGEMENT
// ==========================================
export async function getDashboardStats() {
  try {
    const totalPhysical = await db.registration.count({ where: { ticketType: "PHYSICAL" } });
    const totalVirtual = await db.registration.count({ where: { ticketType: "VIRTUAL" } });
    const totalCheckedIn = await db.registration.count({ where: { status: "CHECKED_IN" } });
    
    return { success: true, stats: { totalPhysical, totalVirtual, totalCheckedIn } };
  } catch (error) {
    return { success: false, error: "Failed to load stats." };
  }
}

export async function getScannerPins() {
  try {
    const pins = await db.scannerPin.findMany({ orderBy: { createdAt: 'desc' } });
    return { success: true, pins };
  } catch (error) {
    return { success: false, error: "Failed to load PINs." };
  }
}

export async function generateScannerPin(label) {
  try {
    const newPin = Math.floor(1000 + Math.random() * 9000).toString();
    await db.scannerPin.create({ data: { pin: newPin, label: label } });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to generate PIN." };
  }
}

export async function revokeScannerPin(id, currentStatus) {
  try {
    await db.scannerPin.update({
      where: { id },
      data: { isActive: !currentStatus }
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update PIN status." };
  }
}