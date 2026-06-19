import { BibleVerse, RadioProgram, PrayerRequest } from '../types';

export const BIBLE_VERSES: BibleVerse[] = [
  {
    id: 1,
    text: "The thief does not come except to steal, and to kill, and to destroy. I have come that they may have life, and that they may have it more abundantly.",
    reference: "John 10:10",
    category: "salvation"
  },
  {
    id: 2,
    text: "I am the way, the truth, and the life. No one comes to the Father except through Me.",
    reference: "John 14:6",
    category: "salvation"
  },
  {
    id: 3,
    text: "But those who wait on the Lord shall renew their strength; they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.",
    reference: "Isaiah 40:31",
    category: "strength"
  },
  {
    id: 4,
    text: "Cast your burden on the Lord, and He shall sustain you; He shall never permit the righteous to be moved.",
    reference: "Psalm 55:22",
    category: "strength"
  },
  {
    id: 5,
    text: "I can do all things through Christ who strengthens me.",
    reference: "Philippians 4:13",
    category: "strength"
  },
  {
    id: 6,
    text: "He who believes in Me, as the Scripture has said, out of his heart will flow rivers of living water.",
    reference: "John 7:38",
    category: "faith"
  },
  {
    id: 7,
    text: "He Himself bore our sins in His own body on the tree, that we, having died to sins, might live for righteousness—by whose stripes you were healed.",
    reference: "1 Peter 2:24",
    category: "healing"
  },
  {
    id: 8,
    text: "And my God shall supply all your need according to His riches in glory by Christ Jesus.",
    reference: "Philippians 4:19",
    category: "praise"
  },
  {
    id: 9,
    text: "Praise the Lord! Oh, give thanks to the Lord, for He is good! For His mercy endures forever.",
    reference: "Psalm 106:1",
    category: "praise"
  },
  {
    id: 10,
    text: "Be strong and of good courage, do not fear nor be afraid of them; for the Lord your God, He is the One who goes with you. He will not leave you nor forsake you.",
    reference: "Deuteronomy 31:6",
    category: "strength"
  },
  {
    id: 11,
    text: "Peace I leave with you, My peace I give to you; not as the world gives do I give to you. Let not your heart be troubled, neither let it be afraid.",
    reference: "John 14:27",
    category: "faith"
  },
  {
    id: 12,
    text: "For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.",
    reference: "John 3:16",
    category: "salvation"
  }
];

export const RADIO_SCHEDULE: RadioProgram[] = [
  {
    id: 1,
    name: "Morning Devotional & Prayer Hour",
    time: "05:00 AM - 07:00 AM",
    host: "Pastor Joseph Obote",
    description: "Start your morning with spiritual warfare, thanksgiving prayers, and apostolic guidance."
  },
  {
    id: 2,
    name: "The Living Word (Bible Study)",
    time: "09:00 AM - 11:00 AM",
    host: "Evangelist Mary Grace",
    description: "Deep doctrinal exposition of God's Word, unpacking Biblical truths for everyday victories."
  },
  {
    id: 3,
    name: "Hour of Joy & Celestial Praise",
    time: "01:00 PM - 03:00 PM",
    host: "Brother Isaac & Choir",
    description: "Uplifting praise, gospel beats from East Africa and the globe, and joyous testimonies."
  },
  {
    id: 4,
    name: "Moment of Deliverance & Divine Healing",
    time: "06:00 PM - 08:00 PM",
    host: "Pastor Joseph Obote",
    description: "Live laying on of hands in spirit, taking callers' prayer lists, and witnessing miracles."
  },
  {
    id: 5,
    name: "Overnight Sanctuary Praise & Cry",
    time: "10:00 PM - 02:00 AM",
    host: "Voice of Jesus Team",
    description: "Calm, deep meditative session with hymns, worship instrumentalists, and personal intercession."
  }
];

export const INITIAL_PRAYER_REQUESTS: PrayerRequest[] = [
  {
    id: "p1",
    name: "Sarah Akello",
    location: "Lira, Uganda",
    request: "Pray for my husband who is suffering from severe chest-pain. I believe in Jesus, our Ultimate Healer.",
    amens: 42,
    timestamp: "2 hours ago"
  },
  {
    id: "p2",
    name: "Emmanuel Okello",
    location: "Lira, Uganda",
    request: "I am requesting prayer for divine breakthrough in my newly launched agricultural shop. Let God's favor reign.",
    amens: 28,
    timestamp: "5 hours ago"
  },
  {
    id: "p3",
    name: "Grace Birungi",
    location: "Kampala, Uganda",
    request: "I thank God for the healing of my daughter from malaria. Please pray for her to grow in God's wisdom.",
    amens: 57,
    timestamp: "1 day ago"
  }
];
