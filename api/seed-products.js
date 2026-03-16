import redis from "./redis.js";

export default async function handler(req, res) {


  const products = {
  netflix: [
    { id: 1, name: 'Basic 720p', price: 22, images: ['images/NetflixBigLogo.png'], description: '1 user subscription of Netflix for 1 month', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 2, name: 'Standard 1080p', price: 29, originalPrice: 34, images: ['images/NetflixBigLogo.png'], description: '2 users subscription of Netflix for 1 month', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 3, name: 'premium 4K + HDR', price: 40, images: ['images/NetflixBigLogo.png'], description: '6 user subscription of Netflix for 1 month', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 4, name: 'part of premium (shared)', price: 15, images: ['images/NetflixBigLogo.png'], description: '1 user subscription of Netflix for 1 month (shared account)', rating: 4.9, popular: false, recommended: true, inStock: true }
  ],
  spotify: [
    { id: 10, name: 'Spotify Étudiants', price: 17, images: ['images/spotify-1.png'], description: '1 user subscription of Spotify for 1 month', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 11, name: 'Spotify Personnel', price: 23, images: ['images/spotify-1.png'], description: '1 user subscription of Spotify for 1 month', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 12, name: 'Spotify Duo', price: 27, images: ['images/spotify-1.png'], description: 'Six months unlimited streaming', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 13, name: 'Spotify Famille', price: 32, images: ['images/spotify-1.png'], description: 'Full year premium subscription', rating: 4.9, popular: false, recommended: false, inStock: true },
    { id: 14, name: 'part of premium (shared)', price: 13, images: ['images/spotify-1.png'], description: 'Full year premium subscription', rating: 4.9, popular: false, recommended: false, inStock: true }
  ],
  canva: [
    { id: 20, name: 'Canva Pro', price: 200, images: ['images/canva-icon.png'], description: 'One year canva pro for 1 person', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 21, name: 'Canva business', price: 300, images: ['images/canva-icon.png'], description: 'One year canva business for 1 person', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  shahid: [
    { id: 30, name: 'Shahid VIP Mobile', price: 20, images: ['images/Shahid_Logo.png'], description: 'Epic Shahid Originals, exclusive series, movie premieres & Live TV.', rating: 4.6, popular: false, recommended: false, inStock: true },
    { id: 31, name: 'Shahid VIP', price: 23, images: ['images/Shahid_Logo.png'], description: 'Epic Shahid Originals, exclusive series, movie premieres, Live TV & more!', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 32, name: 'Shahid VIP | BigTime', price: 40, images: ['images/Shahid_Logo.png'], description: 'Riyadh & Jeddah Seasons: Live concerts, thrilling events, plus all VIP perks.', rating: 4.7, popular: false, recommended: false, inStock: true },
    { id: 33, name: 'Shahid VIP | Sport', price: 42, images: ['images/Shahid_Logo.png'], description: 'International qualifiers, global tournaments, and showdowns, plus all VIP perks.', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 34, name: 'Shahid Ultimate', price: 60, images: ['images/Shahid_Logo.png'], description: 'The best of all worlds: VIP access, Riyadh & Jeddah Seasons, sports & more!', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  console: [
    { id: 60, name: 'PlayStation Store Card 50 TND', price: 50, images: ['images/playstation.png'], description: 'Digital gift card for PlayStation Store', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 61, name: 'PlayStation Store Card 100 TND', price: 100, images: ['images/playstation.png'], description: 'Digital gift card for PlayStation Store', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 62, name: 'Xbox Gift Card 50 TND', price: 50, images: ['images/xbox.png'], description: 'Digital gift card for Xbox games', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  mobile: [
    { id: 70, name: 'Google Play Gift Card 20 TND', price: 20, images: ['images/google-play.png'], description: 'Digital gift card for Google Play Store apps and games', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 71, name: 'Google Play Gift Card 50 TND', price: 50, images: ['images/google-play.png'], description: 'Digital gift card for Google Play Store apps and games', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 72, name: 'App Store Gift Card 20 TND', price: 20, images: ['images/app-store.png'], description: 'Digital gift card for Apple App Store', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  programming: [
    { id: 80, name: 'Udemy subscription', price: 80, images: ['images/Udemy.png'], description: 'Complete programming course bundle', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 81, name: 'Coursera Single learning program', price: 100, images: ['images/Coursera.png'], description: 'Learn a single topic or skill and earn a credential with coursera', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 82, name: 'Coursera Plus Annual', price: 600, images: ['images/Coursera.png'], description: 'Combine flexibility and savings with long-term learning goals using coursera pro annual', rating: 4.9, popular: true, recommended: true, inStock: true },
    { id: 83, name: 'Codecademy Plus Subscription', price: 60, images: ['images/Codecademy.png'], description: 'Build in-demand technical skills for work or a personal project', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 84, name: 'Codecademy Pro Subscription', price: 80, images: ['images/Codecademy.png'], description: 'Develop the experience to land a job and move up in your career', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  design: [
    { id: 90, name: 'Adobe Creative Cloud Student', price: 100, images: ['images/creativecloud.png'], description: 'Get 20+ creative apps, including Photoshop and Acrobat Pro, plus Adobe Firefly creative AI for images, video, and audio.', rating: 4.9, popular: true, recommended: false, inStock: true },
    { id: 91, name: 'Figma Professional Full Seat Subscription', price: 100, images: ['images/Figmapro.png'], description: 'Professional design and prototyping tools', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 92, name: 'Sketch Standard License', price: 65, images: ['images/sketch.png'], description: 'Vector graphics editor for UI/UX design', rating: 4.6, popular: false, recommended: true, inStock: true },
    { id: 40, name: 'Capcut 1 month', price: 40, images: ['images/logo-capcut.png'], description: 'CapCut Pro offers advanced AI tools that can automatically remove background noise and sharpen video details', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 41, name: 'Capcut 1 year', price: 160, images: ['images/logo-capcut.png'], description: 'CapCut Pro offers advanced AI tools that can automatically remove background noise and sharpen video details', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 42, name: 'Capcut teams (two people)', price: 50, images: ['images/logo-capcut.png'], description: 'Edit YouTube and Instagram videos with CapCut teams, team up to create creativeness', rating: 4.7, popular: false, recommended: true, inStock: true }

  ],
  business: [
    { id: 110, name: 'LinkedIn Learning Subscription', price: 100, images: ['images/LinkedInLearning.png'], description: 'Professional development and business courses', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 111, name: 'QuickBooks Online Simple Start', price: 30, images: ['images/quickbooks.png'], description: '1 user Plus access for your accountant', rating: 4.7, popular: false, recommended: false, inStock: true },
    { id: 112, name: 'QuickBooks Online Essentials', price: 35, images: ['images/quickbooks.png'], description: '3 users Plus access for your accountant', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 113, name: 'QuickBooks Online Plus', price: 40, images: ['images/quickbooks.png'], description: '5 users Plus access for your accountant', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 114, name: 'QuickBooks Online Advanced', price: 50, images: ['images/quickbooks.png'], description: '25 users Plus access for your accountant', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  software: [
    { id: 130, name: 'Microsoft 365 Personal', price: 45, images: ['images/365.png'], description: 'Complete Microsoft Office suite subscription', rating: 4.9, popular: true, recommended: false, inStock: true },
    { id: 131, name: 'Norton AntiVirus Plus', price: 20, images: ['images/norton.png'], description: 'Comprehensive security software package', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 132, name: 'Adobe Premiere Pro', price: 45, images: ['images/adobe.png'], description: 'Professional video editing suite', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  steam: [
    { id: 150, name: 'Steam Gift Card $5', price: 25, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 151, name: 'Steam Gift Card $10', price: 40, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 152, name: 'Steam Gift Card $25', price: 100, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 153, name: 'Steam Gift Card $50', price: 180, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 154, name: 'Steam Gift Card $100', price: 350, images: ['images/steam1.png'], description: 'Digital gift card for Steam games and software', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  epic_games: [
    { id: 160, name: 'Epic Games Card $5', price: 25, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 161, name: 'Epic Games Card $10', price: 40, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 162, name: 'Epic Games Card $25', price: 100, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: false, recommended: true, inStock: true },
    { id: 163, name: 'Epic Games Card $50', price: 180, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 164, name: 'Epic Games Card $100', price: 350, images: ['images/epic-games1.png'], description: 'Digital gift card for Epic Games Store', rating: 4.7, popular: false, recommended: true, inStock: true }
  ],
  ea_games: [
    { id: 170, name: 'EA Play 1 Month', price: 50, images: ['images/ea-logo.png'], description: 'Get unlimited access to top EA titles for 1 month', rating: 4.6, popular: true, recommended: false, inStock: true },
    { id: 171, name: 'EA Play Pro 1 Months', price: 100, images: ['images/ea-logo.png'], description: 'Get unlimited access to premium editions for 3 months', rating: 4.7, popular: true, recommended: true, inStock: true },
    { id: 172, name: 'EA Play 1 Year', price: 150, images: ['images/ea-logo.png'], description: 'Get unlimited access to top EA titles for 1 year', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 173, name: 'EA Play Pro 1 Year', price: 350, images: ['images/ea-logo.png'], description: 'Get unlimited access to premium editions for 1 year', rating: 4.8, popular: false, recommended: true, inStock: true }
  ],
  xbox_pc: [
    { id: 180, name: 'Xbox Game Pass PC Essential', price: 40, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 50+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.7, popular: true, recommended: false, inStock: true },
    { id: 181, name: 'Xbox Game Pass PC Premium', price: 60, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 200+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 182, name: 'Xbox Game Pass PC Ultimate', price: 110, images: ['images/xbox-game-pass.png'], description: 'Access to Xbox Game Pass PC, 500+ games on Xbox console, PC, and supported devices for 1 month', rating: 4.9, popular: false, recommended: true, inStock: true }
  ],
  pc: [
    { id: 500, name: 'ARC Raiders Steam Account', price: 95, images: ['images/arc-raiders.png','images/Arc_Raiders2.png','images/Arc_Raiders3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 501, name: 'FC 26 Standard Edition Steam Account', price: 45, images: ['images/fc-26.png','images/fc-26s.png','images/fc-26-2.png'], description: 'Digital gift card for Steam games and software fifa', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 502, name: 'GTA V Standard Edition Steam Account', price: 50, images: ['images/gta5.png','images/gta5-2.png','images/gta5-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 503, name: 'RUST Steam Account', price: 35, images: ['images/rust.png','images/rust-2.png','images/rust-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: true, inStock: true },
    { id: 504, name: 'Elden Ring Steam Account', price: 80, images: ['images/elden-ring.png','images/elden-ring-2.png','images/elden-ring-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 505, name: 'HELLDIVERS 2 Steam Account', price: 95, images: ['images/helldivers-2-2.png','images/helldivers-2-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 506, name: 'Nioh 3 Steam Account', price: 140, images: ['images/nioh-3.png','images/nioh-3-2.png','images/nioh-3-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
    { id: 507, name: 'REANIMAL Steam CD Key', price: 60, images: ['images/REANIMAL.png','images/REANIMAL-2.png','images/REANIMAL-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 508, name: "No Man's Sky Steam Account", price: 35, images: ['images/no-man-s-sky.png','images/no-man-s-sky-2.png','images/no-man-s-sky-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: true, inStock: true },
    { id: 509, name: 'Cyberpunk 2077 Steam Account', price: 45, images: ['images/Cyberpunk2077.png','images/Cyberpunk2077-2.png','images/Cyberpunk2077-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
    { id: 510, name: 'ARC Raiders Steam CD Key', price: 110, images: ['images/arc-raiders.png','images/Arc_Raiders2.png','images/Arc_Raiders3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: true, recommended: false, inStock: true },
    { id: 511, name: 'Nioh 3 Steam CD Key', price: 170, images: ['images/nioh-3.png','images/nioh-3-2.png','images/nioh-3-3.png'], description: 'Digital gift card for Steam games and software', rating: 4.8, popular: false, recommended: false, inStock: true },
    { id: 512, name: 'Minecraft Microsoft Account', price: 40, images: ['images/minecraft-java-and-bedrock-edition-pc-mac-cover.jpg','images/mc2.png','images/mc3.png'], description: 'Digital gift card for Steam games and software Mineraft', rating: 4.8, popular: true, recommended: false, inStock: true },
  
  
  ]
};

  await redis.set("products", JSON.stringify(products));

  res.json({
    success: true,
    message: "Products saved to Redis"
  });
}