export interface StationGroup {
  line: string;
  color: string;
  stations: string[];
}

export const STATION_GROUPS: StationGroup[] = [
  {
    line: "BTS Sukhumvit Line",
    color: "#34D399",
    stations: [
      "Khu Khot", "Yaek Kor Por Aor", "Royal Thai Air Force Museum", "Bhumibol Adulyadej Hospital",
      "Saphan Mai", "Sai Yud", "Phahon Yothin 59", "Wat Phra Sri Mahathat", "11th Infantry Regiment",
      "Bang Bua", "Royal Forest Department", "Kasetsart University", "Sena Nikhom", "Ratchayothin",
      "Phahon Yothin 24", "Ha Yaek Lat Phrao", "Mo Chit", "Saphan Khwai", "Sena Ruam", "Ari",
      "Sanam Pao", "Victory Monument", "Phaya Thai", "Ratchathewi", "National Stadium", "Siam",
      "Chit Lom", "Phloen Chit", "Nana", "Asok", "Phrom Phong", "Thong Lo", "Ekkamai",
      "Phra Khanong", "On Nut", "Bang Chak", "Punnawithi", "Udom Suk", "Bang Na", "Bearing",
      "Samrong", "Pu Chao", "Chang Erawan", "Royal Thai Naval Academy", "Pak Nam",
      "Srinagarindra", "Phraek Sa", "Sai Luat", "Kheha",
    ],
  },
  {
    line: "BTS Silom Line",
    color: "#60A5FA",
    stations: [
      "National Stadium", "Siam", "Ratchadamri", "Sala Daeng", "Chong Nonsi", "Saint Louis",
      "Surasak", "Saphan Taksin", "Krung Thon Buri", "Wongwian Yai", "Pho Nimit",
      "Talat Phlu", "Wutthakat", "Bang Wa",
    ],
  },
  {
    line: "BTS Gold Line",
    color: "#FBBF24",
    stations: ["Krung Thon Buri", "Charoen Nakhon", "Khlong San"],
  },
  {
    line: "MRT Blue Line",
    color: "#818CF8",
    stations: [
      "Tha Phra", "Charan 13", "Fai Chai", "Bang Khun Non", "Bang Yi Khan", "Sirindhorn",
      "Bang Phlat", "Bang O", "Bang Pho", "Tao Poon", "Bang Sue", "Kamphaeng Phet",
      "Chatuchak Park", "Phahon Yothin", "Lat Phrao", "Ratchadaphisek", "Sutthisan",
      "Huai Khwang", "Thailand Cultural Centre", "Phra Ram 9", "Phetchaburi", "Sukhumvit",
      "Queen Sirikit National Convention Centre", "Khlong Toei", "Lumphini", "Si Lom",
      "Sam Yan", "Hua Lamphong", "Wat Mangkon", "Sam Yot", "Sanam Chai", "Itsaraphap",
      "Bang Phai", "Bang Wa", "Phetkasem 48", "Phasi Charoen", "Bang Khae", "Lak Song",
    ],
  },
  {
    line: "MRT Purple Line",
    color: "#C084FC",
    stations: [
      "Tao Poon", "Bang Son", "Wong Sawang", "Yaek Tiwanon", "Ministry of Public Health",
      "Nonthaburi Civic Center", "Bang Krasor", "Yaek Nonthaburi 1", "Phra Nang Klao Bridge",
      "Sai Ma", "Bang Rak Noi Tha It", "Bang Rak Yai", "Bang Phlu", "Sam Yaek Bang Yai",
      "Talad Bang Yai", "Khlong Bang Phai",
    ],
  },
  {
    line: "MRT Yellow Line",
    color: "#FDE68A",
    stations: [
      "Lat Phrao", "Phawana", "Chok Chai 4", "Lat Phrao 71", "Lat Phrao 83", "Mahat Thai",
      "Lat Phrao 101", "Bang Kapi", "Yaek Lam Sali", "Si Kritha", "Hua Mak", "Kalantan",
      "Si Nut", "Srinagarindra 38", "Suan Luang Rama IX", "Si Udom", "Si Iam", "Si La Salle",
      "Si Bearing", "Si Dan", "Si Thepha", "Thipphawan", "Samrong",
    ],
  },
  {
    line: "MRT Pink Line",
    color: "#F9A8D4",
    stations: [
      "Nonthaburi Civic Center", "Khae Rai", "Sanambin Nam", "Samakkhi",
      "Royal Irrigation Department", "Yaek Pak Kret", "Pak Kret Bypass",
      "Chaeng Watthana - Pak Kret 28", "Si Rat", "Muang Thong Thani", "Chaeng Watthana 14",
      "Government Complex", "National Telecom", "Lak Si", "Rajabhat Phranakhon",
      "Wat Phra Sri Mahathat", "Ram Inthra 3", "Lat Pla Khao", "Ram Inthra Kor Mor 4",
      "Maiyalap", "Vacharaphol", "Ram Inthra Kor Mor 6", "Khu Bon", "Ram Inthra Kor Mor 9",
      "Outer Ring Road - Ram Inthra", "Nopparat", "Bang Chan", "Setthabutbamphen",
      "Min Buri Market", "Min Buri", "Impact Muang Thong Thani", "Lake Muang Thong Thani",
    ],
  },
  {
    line: "Airport Rail Link",
    color: "#F97316",
    stations: [
      "Phaya Thai", "Ratchaprarop", "Makkasan", "Ramkhamhaeng",
      "Hua Mak", "Ban Thap Chang", "Lat Krabang", "Suvarnabhumi",
    ],
  },
];

// Flat deduplicated list for simple searching
export const ALL_STATIONS: string[] = Array.from(
  new Set(STATION_GROUPS.flatMap((g) => g.stations)),
).sort();

export const BANGKOK_ZONES = [
  "Asok", "Ari", "Bang Bon", "Bang Kapi", "Bang Khae", "Bang Na", "Bang Phlat",
  "Bang Rak", "Bang Sue", "Bang Wa", "Bearing", "Chatuchak", "Chit Lom",
  "Chong Nonsi", "Don Mueang", "Ekkamai", "Huai Khwang", "Khlong San",
  "Khlong Toei", "Lat Krabang", "Lat Phrao", "Lad Prao", "Lumpini",
  "Min Buri", "Mo Chit", "Nana", "Nonthaburi", "On Nut", "Pathum Wan",
  "Phahon Yothin", "Phaya Thai", "Phloen Chit", "Pho Nimit", "Phra Khanong",
  "Phra Nakhon", "Phra Ram 9", "Phrom Phong", "Prawet", "Ratchada",
  "Ratchadaphisek", "Ratchathewi", "Riverside", "Sathon", "Saladaeng",
  "Samrong", "Saphan Taksin", "Siam", "Silom", "Sukhumvit", "Surasak",
  "Talat Phlu", "Thon Buri", "Thong Lo", "Udom Suk", "Victory Monument",
  "Wongwian Yai", "Yan Nawa", "Other",
].sort();
