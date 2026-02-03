import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: session.accessToken });

    const gmail = google.gmail({ version: "v1", auth: oauth2Client });

    // Get unread count
    const unreadRes = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread in:inbox",
      maxResults: 1,
    });
    const unread = unreadRes.data.resultSizeEstimate || 0;

    // Get recent emails
    const messagesRes = await gmail.users.messages.list({
      userId: "me",
      maxResults: 10,
      q: "in:inbox",
    });

    const emails = await Promise.all(
      (messagesRes.data.messages || []).slice(0, 5).map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers || [];
        const from = headers.find((h) => h.name === "From")?.value || "";
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";

        return {
          id: msg.id,
          from: from.replace(/<.*>/, "").trim(),
          subject,
          snippet: detail.data.snippet || "",
          time: new Date(date).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          starred: detail.data.labelIds?.includes("STARRED") || false,
          unread: detail.data.labelIds?.includes("UNREAD") || false,
        };
      })
    );

    return NextResponse.json({ unread, emails, sent: 0, drafts: 0 });
  } catch (error) {
    console.error("Gmail API error:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}
