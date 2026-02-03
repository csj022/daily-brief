import { NextResponse } from "next/server";

// Fetch from Hacker News API (free, no key needed)
async function fetchHackerNews() {
  try {
    const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
    const ids = await res.json();
    const stories = await Promise.all(
      ids.slice(0, 8).map(async (id: number) => {
        const story = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json());
        return {
          id: story.id.toString(),
          title: story.title,
          source: story.by || "Hacker News",
          time: new Date(story.time * 1000).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
          url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        };
      })
    );
    return stories;
  } catch { return []; }
}

// Mock business news
const businessNews = [
  { id: "b1", title: "Fed Signals Potential Rate Cuts in Early 2024", source: "Reuters", time: "2h ago", url: "#" },
  { id: "b2", title: "Tesla Deliveries Beat Estimates in Q4", source: "Bloomberg", time: "3h ago", url: "#" },
  { id: "b3", title: "Oil Prices Surge Amid Middle East Tensions", source: "WSJ", time: "4h ago", url: "#" },
];

// Mock headlines
const headlines = [
  { id: "h1", title: "Congress Passes Major Infrastructure Bill", source: "AP News", time: "1h ago", url: "#" },
  { id: "h2", title: "Scientists Announce Breakthrough in Fusion Energy", source: "NYT", time: "2h ago", url: "#" },
  { id: "h3", title: "Global Climate Summit Reaches Historic Agreement", source: "BBC", time: "3h ago", url: "#" },
];

export async function GET() {
  const tech = await fetchHackerNews();
  return NextResponse.json({ tech, business: businessNews, headlines });
}
