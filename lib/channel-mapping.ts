// Map of channel IDs to channel names
export const channelIdToName: Record<string, string> = {
  "UC9cn0TuPq4dnbTY-CBsm8XA": "a16z",
  "UCPjNBjflYl0-HQtUvOx0Ibw": "Greg Isenberg",
  UCSHZKyawb77ixDdsGog4iWA: "Lex Fridman",
  "UCctXZhXmG-kf3tlIXgVZUlw": "GaryVee",
  "UCGq-a57w-aPwyi3pW7XLiHw": "The Diary Of A CEO",
  UCt7iTIYltv1G0ycH0UVxDiA: "Elevation Capital",
  UCXfzpliAfdjParawJljHo2g: "John Lee Dumas",
  UCtz8s6nPLvrVQ4YhOJz6DSg: "Young and Profiting",
  UCznv7Vf9nBdJYvBagFdAHWw: "Tim Ferriss",
  UCyaN6mg5u8Cjy2ZI4ikWaug: "My First Million",
  UCGk1LitxAZVnqQn0_nt5qxw: "Pat Flynn",
  "UCA-mWX9CvCTVFWRMb9bKc9w": "Dan Martell",
  UCp8mr0kjVyVAmvexLDqB60A: "Chase Jarvis",
  UChhw6DlKKTQ9mYSpTfXUYqA: "Starter Story",
}

// Export channelIdToName as channelMapping for backward compatibility
export const channelMapping = channelIdToName

// Get channel name from ID with fallback to original name
export function getChannelName(channelId: string, fallbackName?: string): string {
  return channelIdToName[channelId] || fallbackName || channelId
}
