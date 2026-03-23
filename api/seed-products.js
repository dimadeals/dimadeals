import { getRedis } from "./redis.js";

/**
 * PRODUCT SEED SCRIPT
 * Loads a predefined set of products into Redis
 * Run with: node api/seed-products.js
 */

const PRODUCTS = [
  {
    id: 1,
    name: "Basic 720p",
    category: "netflix",
    price: 22,
    images: ["images/NetflixBigLogo.png"],
    description: "Enjoy Netflix Basic with standard definition (SD) streaming quality. Perfect for a single user who wants access to thousands of movies and TV shows. Stream on one screen at a time and enjoy unlimited entertainment on the world's largest streaming platform.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 2,
    name: "Standard 1080p",
    category: "netflix",
    price: 29,
    originalPrice: 34,
    images: ["images/NetflixBigLogo.png"],
    description: "Upgrade to Netflix Standard and enjoy full HD (1080p) streaming quality. Perfect for households with 2 users. Watch on two screens simultaneously and access our complete library of entertainment including exclusive originals, blockbuster films, and award-winning series.",
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 3,
    name: "premium 4K + HDR",
    category: "netflix",
    price: 40,
    images: ["images/NetflixBigLogo.png"],
    description: "Experience Netflix Premium with stunning 4K Ultra HD and HDR streaming quality. Perfect for families and groups of up to six users on separate screens. Enjoy the highest quality video and audio available on our platform, binge all your favorite shows and movies.",
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 4,
    name: "part of premium (shared)",
    category: "netflix",
    price: 15,
    images: ["images/NetflixBigLogo.png"],
    description: "Access Netflix Premium through a shared account with high-quality 4K streaming. Enjoy one of the world's best entertainment platforms with access to thousands of movies, series, and documentaries. Perfect if you want premium features at a fraction of the individual subscription cost.",
    rating: 4.9,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 5,
    name: "Spotify Étudiants",
    category: "spotify",
    price: 17,
    images: ["images/spotify-1.png"],
    description: "Étudiants subscription for students with special pricing. Get unlimited streaming of over 100 million songs with zero ads. Create and share playlists, discover new music with personalized recommendations, and enjoy high-quality audio all in the perfect plan for students.",
    rating: 4.7,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 6,
    name: "Spotify Personal",
    category: "spotify",
    price: 23,
    images: ["images/spotify-1.png"],
    description: "Spotify Personal plan for individual users who want the best music experience. Enjoy ad-free listening of over 100 million songs, download tracks for offline listening, and get high-quality audio. Create unlimited playlists and get personalized recommendations based on your taste.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 7,
    name: "Spotify Duo",
    category: "spotify",
    price: 27,
    images: ["images/spotify-1.png"],
    description: "Spotify Duo plan giving 2 users separate accounts at one price. Both you and a friend or family member get unlimited ad-free streaming of over 100 million songs. Each account has independent personalization and recommendations. Perfect for couples or roommates.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 8,
    name: "Spotify Family",
    category: "spotify",
    price: 32,
    images: ["images/spotify-1.png"],
    description: "Spotify Famille plan for up to 6 family members in one household. Each person gets their own separate account with unique personalization and parental controls. Premium features include unlimited ad-free streaming, offline listening, and access to 100+ million songs and podcasts.",
    rating: 4.9,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 9,
    name: "part of premium (shared)",
    category: "spotify",
    price: 13,
    images: ["images/spotify-1.png"],
    description: "Share a premium Spotify account with others at a discounted rate. Get unlimited ad-free streaming of millions of songs, create and share playlists, and enjoy offline listening. Perfect for anyone looking to access premium features affordably.",
    rating: 4.9,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 10,
    name: "Canva Pro",
    category: "canva",
    price: 200,
    images: ["images/canva-icon.png"],
    description: "Canva Pro membership with thousands of professional templates for social media, presentations, and more. Access millions of premium images, icons, and fonts. Create stunning designs even without experience using Canva's intuitive drag-and-drop editor. Perfect for content creators and small business owners.",
    rating: 4.7,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 11,
    name: "Canva business",
    category: "canva",
    price: 300,
    images: ["images/canva-icon.png"],
    description: "Canva Business includes all Pro features plus brand management tools for teams. Create consistent designs with custom templates, manage team members' access, and maintain brand guidelines. Perfect for businesses and agencies maintaining a professional visual identity across all marketing materials.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 12,
    name: "Shahid VIP Mobile",
    category: "shahid",
    price: 20,
    images: ["images/Shahid_Logo.png"],
    description: "Shahid VIP Mobile subscription for premium Arabic entertainment on mobile devices. Access exclusive Shahid originals, latest movie premieres, live TV channels, and entertainment classics. High-quality streaming optimized for mobile with offline download capabilities. Best for on-the-go viewing.",
    rating: 4.6,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 13,
    name: "Shahid VIP",
    category: "shahid",
    price: 23,
    images: ["images/Shahid_Logo.png"],
    description: "Shahid VIP membership unlocking exclusive Arabic entertainment content unavailable elsewhere. Stream original productions, new movie premieres, live sporting events, and a vast library of classic films. Premium quality streaming across all devices with personalized recommendations and unlimited access.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 14,
    name: "Shahid VIP | BigTime",
    category: "shahid",
    price: 40,
    images: ["images/Shahid_Logo.png"],
    description: "Shahid VIP BigTime brings you exclusive live events from Riyadh and Jeddah seasons. Access premium original content, latest releases, and special entertainment events. Experience high-quality streaming of concerts and exclusive gatherings plus all standard VIP features for complete entertainment.",
    rating: 4.7,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 15,
    name: "Shahid VIP | Sport",
    category: "shahid",
    price: 42,
    images: ["images/Shahid_Logo.png"],
    description: "Shahid VIP Sport subscription for sports enthusiasts covering international tournaments and competitions. Stream live sporting events from around the world including football, basketball, and more. Get exclusive coverage plus all regular VIP entertainment content on premium quality.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 16,
    name: "Shahid Ultimate",
    category: "shahid",
    price: 60,
    images: ["images/Shahid_Logo.png"],
    description: "Shahid Ultimate is the premium tier combining all entertainment categories. Access exclusive originals, live events from Riyadh and Jeddah, sporting events, latest releases, and classic content. Premium quality streaming with personalized recommendations and unlimited access to comprehensive Arabic entertainment.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 17,
    name: "PlayStation Store Card 50 TND",
    category: "console",
    price: 50,
    images: ["images/playstation.png"],
    description: "PlayStation Store 50 TND gift card loaded with credit for purchasing digital games, DLC, and add-ons. Redeem instantly on any PlayStation console. Access thousands of games from indie titles to AAA blockbusters. Perfect gift for gaming enthusiasts or personal gaming library expansion.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 18,
    name: "PlayStation Store Card 100 TND",
    category: "console",
    price: 100,
    images: ["images/playstation.png"],
    description: "PlayStation Store 100 TND gift card giving you substantial credit for the digital entertainment library. Purchase premium games, season passes, DLC content, and exclusive features. Instant redemption on PS4 and PS5 consoles. Great value for serious gamers.",
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 19,
    name: "Xbox Gift Card 50 TND",
    category: "console",
    price: 50,
    images: ["images/xbox.png"],
    description: "Xbox Gift Card 50 TND provides digital credit for Xbox Store and Game Pass. Download games, DLC, add-ons, and entertainment content directly to your console. Instant delivery and easy redemption. Expanding your gaming library has never been easier.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 20,
    name: "Google Play Gift Card 20 TND",
    category: "mobile",
    price: 20,
    images: ["images/google-play.png"],
    description: "Google Play Gift Card 20 TND for purchasing apps, games, movies, music, and books. Instant digital delivery via email. Access millions of applications and games on Android devices. Perfect for someone who wants to explore new entertainment options.",
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 21,
    name: "Google Play Gift Card 50 TND",
    category: "mobile",
    price: 50,
    images: ["images/google-play.png"],
    description: "Google Play Gift Card 50 TND unlocking substantial options for Android entertainment. Download premium apps, games, ebooks, music, and movies. Instant email delivery makes it a perfect last-minute gift. Greater selection with more purchasing power for tech enthusiasts.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 22,
    name: "App Store Gift Card 20 TND",
    category: "mobile",
    price: 20,
    images: ["images/app-store.png"],
    description: "Apple App Store Gift Card 20 TND for iPhone, iPad, and Mac purchases. Buy apps, games, in-app purchases, subscriptions, and digital content. Instant digital delivery via email. Perfect for Apple device users who want premium applications and gaming content.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 23,
    name: "Udemy subscription",
    category: "programming",
    price: 80,
    images: ["images/Udemy.png"],
    description: "Udemy annual subscription providing access to thousands of programming courses covering everything from Python to web development. Learn at your own pace with lifetime access to course materials. Perfect for beginners and experienced developers upgrading their skills with affordable quality education.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 24,
    name: "Coursera Single learning program",
    category: "programming",
    price: 100,
    images: ["images/Coursera.png"],
    description: "Coursera specialization program allowing you to master a specific skill through structured courses from top universities. Earn recognized credentials and certificates upon completion. Includes hands-on projects and peer-reviewed assignments. Perfect for career advancement and professional development.",
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 25,
    name: "Coursera Plus Annual",
    category: "programming",
    price: 600,
    images: ["images/Coursera.png"],
    description: "Coursera Plus annual subscription unlocking unlimited access to thousands of courses from universities worldwide. Learn programming, data science, business, and more. Earn certificates and credentials for career growth. Premium learning experience at excellent value for dedicated learners.",
    rating: 4.9,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 26,
    name: "Codecademy Plus Subscription",
    category: "programming",
    price: 60,
    images: ["images/Codecademy.png"],
    description: "Codecademy Plus subscription with interactive coding lessons in multiple programming languages. Build practical projects while learning from industry experts. Get career paths, skill assessments, and mentorship. Perfect for aspiring developers and tech professionals starting their coding journey.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 27,
    name: "Codecademy Pro Subscription",
    category: "programming",
    price: 80,
    images: ["images/Codecademy.png"],
    description: "Codecademy Pro tier with everything in Plus plus portfolio-building projects and job preparation resources. Interview prep, resume guidance, and career support included. Hands-on experience with real-world projects. Best for career changers aiming for junior developer positions.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 28,
    name: "Adobe Creative Cloud Student",
    category: "design",
    price: 100,
    images: ["images/creativecloud.png"],
    description: "Adobe Creative Cloud Student membership including 20+ professional design applications. Access Photoshop, Premiere Pro, Illustrator, InDesign, and more. Includes Adobe Firefly AI tools for advanced creative work. Perfect for students and educators with special pricing and complete design suite access.",
    rating: 4.9,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 29,
    name: "Figma Professional Full Seat Subscription",
    category: "design",
    price: 100,
    images: ["images/Figmapro.png"],
    description: "Figma Professional subscription enabling collaborative UI/UX design and prototyping in the cloud. Real-time team collaboration on design projects from any device. Professional-grade tools for creating modern web and app interfaces. Essential for designers and product teams.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 30,
    name: "Sketch Standard License",
    category: "design",
    price: 65,
    images: ["images/sketch.png"],
    description: "Sketch Standard License providing professional vector design tools for interface and graphic design. Create beautiful designs with powerful features and extensive symbol libraries. Cloud collaboration and sharing. Industry standard for UI/UX designers.",
    rating: 4.6,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 31,
    name: "Capcut 1 month",
    category: "capcut",
    price: 40,
    images: ["images/logo-capcut.png"],
    description: "CapCut Pro monthly subscription with advanced AI-powered video editing tools. Automatic background removal, noise reduction, video sharpening, and effects. Create professional-quality content without experience. Perfect for content creators, YouTubers, and social media enthusiasts.",
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 32,
    name: "Capcut 1 year",
    category: "capcut",
    price: 160,
    images: ["images/logo-capcut.png"],
    description: "CapCut Pro annual subscription for serious video creators. Year-long access to premium features including AI effects, transitions, audio tools, and templates. Create stunning videos with professional quality. Excellent value for content creators and video enthusiasts.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 33,
    name: "Capcut teams (two people)",
    category: "capcut",
    price: 50,
    images: ["images/logo-capcut.png"],
    description: "CapCut Teams plan allowing two people to collaborate on video projects simultaneously. Share assets, edit together in real-time, and create professional content as a team. Perfect for content teams, creators, and production companies needing collaborative editing.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 34,
    name: "LinkedIn Learning Subscription",
    category: "business",
    price: 100,
    images: ["images/LinkedInLearning.png"],
    description: "LinkedIn Learning subscription with thousands of business and professional development courses. Learn management, marketing, software development, and more from industry experts. Career advancement paths and skill certifications. Perfect for professionals investing in their career growth.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 35,
    name: "QuickBooks Online Simple Start",
    category: "business",
    price: 30,
    images: ["images/quickbooks.png"],
    description: "QuickBooks Online Simple Start ideal for small businesses just starting accounting. Single user access, basic invoicing, and expense tracking. Plus access for your accountant. Perfect entry point for entrepreneurs managing their first business finances.",
    rating: 4.7,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 36,
    name: "QuickBooks Online Essentials",
    category: "business",
    price: 35,
    images: ["images/quickbooks.png"],
    description: "QuickBooks Online Essentials for growing small businesses with three user seats. Invoicing, expense tracking, financial reporting, and accountant access included. More features than Simple Start for expanding operations. Growing businesses needing multiple team access.",
    rating: 4.7,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 37,
    name: "QuickBooks Online Plus",
    category: "business",
    price: 40,
    images: ["images/quickbooks.png"],
    description: "QuickBooks Online Plus with five user seats for medium-sized businesses. Advanced features including project tracking, inventory management, and professional reporting. Full accountant access and integrations. Perfect for scaling businesses with team management needs.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 38,
    name: "QuickBooks Online Advanced",
    category: "business",
    price: 50,
    images: ["images/quickbooks.png"],
    description: "QuickBooks Online Advanced supporting 25 users for larger businesses and enterprises. Premium feature set including advanced automation, workflow customization, and strategic reporting. Full accountant access and premium support. Enterprise-level accounting solution.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 39,
    name: "Microsoft 365 Personal",
    category: "software",
    price: 45,
    images: ["images/365.png"],
    description: "Microsoft 365 Personal subscription with the complete Office suite including Word, Excel, PowerPoint, Outlook, and more. Cloud storage and premium support included. Works across Windows and Mac devices. Essential productivity tools for professionals and students.",
    rating: 4.9,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 40,
    name: "Norton AntiVirus Plus",
    category: "software",
    price: 20,
    images: ["images/norton.png"],
    description: "Norton AntiVirus Plus comprehensive security protection against viruses, malware, and ransomware. Real-time protection, secure browsing, and identity monitoring. Works on multiple devices with one subscription. Industry-leading security for personal computer protection.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 41,
    name: "Adobe Premiere Pro",
    category: "software",
    price: 45,
    images: ["images/adobe.png"],
    description: "Adobe Premiere Pro subscription for professional video editing and production. Create movie-quality content with advanced color grading, effects, and audio tools. Cloud collaboration and team sharing features. Industry standard for filmmakers and video professionals.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 42,
    name: "Steam Gift Card $5",
    category: "steam",
    price: 25,
    images: ["images/steam1.png"],
    description: "Steam Gift Card $5 providing credit for the world's largest gaming platform. Purchase from thousands of games, software, and addons. Instant digital delivery. Entry-level gift for gamers or sampling new titles.",
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 43,
    name: "Steam Gift Card $10",
    category: "steam",
    price: 40,
    images: ["images/steam1.png"],
    description: "Steam Gift Card $10 offering solid purchasing power on the platform. Access thousands of games, DLC, and software. Perfect gift for gamers. Instant delivery via email for immediate enjoyment.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 44,
    name: "Steam Gift Card $25",
    category: "steam",
    price: 100,
    images: ["images/steam1.png"],
    description: "Steam Gift Card $25 providing excellent value for game purchases. Enough credit for one premium AAA title or multiple indie games. Instant email delivery. Great for serious gamers expanding their library.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 45,
    name: "Steam Gift Card $50",
    category: "steam",
    price: 180,
    images: ["images/steam1.png"],
    description: "Steam Gift Card $50 offering substantial credit for gaming purchases. Enough for multiple premium games or comprehensive DLC. Instant digital delivery. Perfect for enthusiast gamers or building a diverse game collection.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 46,
    name: "Steam Gift Card $100",
    category: "steam",
    price: 350,
    images: ["images/steam1.png"],
    description: "Steam Gift Card $100 providing maximum purchasing power for serious gamers. Access to the entire Steam catalog with hundreds of dollars in games. Perfect for collectors and gaming enthusiasts. Premium gift choice.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 47,
    name: "Epic Games Card $5",
    category: "epic_games",
    price: 25,
    images: ["images/epic-games1.png"],
    description: "Epic Games Card $5 with credit for the Epic Games Store with exclusive titles. Purchase games and cosmetics unavailable elsewhere. Free games every week. Instant digital delivery.",
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 48,
    name: "Epic Games Card $10",
    category: "epic_games",
    price: 40,
    images: ["images/epic-games1.png"],
    description: "Epic Games Card $10 providing good purchasing value for Fortnite cosmetics and exclusive games. Access unique titles and seasonal content. Instant email delivery for immediate use.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 49,
    name: "Epic Games Card $10",
    category: "epic_games",
    price: 40,
    images: ["images/epic-games1.png"],
    description: "Epic Games Card $25 allowing purchase of premium games and cosmetics on the Epic platform. Access exclusive AAA titles and seasonal content. Perfect for Fortnite players and gaming enthusiasts.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 50,
    name: "Epic Games Card $50",
    category: "epic_games",
    price: 180,
    images: ["images/epic-games1.png"],
    description: "Epic Games Card $50 for substantial gaming purchases on the Epic platform. Premium cosmetics, multiple games, and exclusive content. Great value for regular players. Instant delivery.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 51,
    name: "Epic Games Card $100",
    category: "epic_games",
    price: 350,
    images: ["images/epic-games1.png"],
    description: "Epic Games Card $100 providing maximum purchasing power on Epic's platform. Premium games, extensive cosmetics, and season passes. Perfect for dedicated gaming enthusiasts and Fortnite collectors.",
    rating: 4.7,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 52,
    name: "EA Play 1 Month",
    category: "ea_games",
    price: 50,
    images: ["images/ea-logo.png"],
    description: "EA Play one-month subscription unlocking access to the EA games library. Play premium titles like FIFA, Madden, and Battlefield. Great for trying premium games. Perfect entry-level subscription for EA gaming.",
    rating: 4.6,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 53,
    name: "EA Play Pro 1 Months",
    category: "ea_games",
    price: 100,
    images: ["images/ea-logo.png"],
    description: "EA Play Pro three-month subscription with premium editions of existing games included. Extended access to the full EA catalog with upgraded content. Perfect for serious players wanting longer commitment.",
    rating: 4.7,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 54,
    name: "EA Play 1 Year",
    category: "ea_games",
    price: 150,
    images: ["images/ea-logo.png"],
    description: "EA Play annual subscription giving year-long access to premium EA games including sports titles. Constantly updated library with new releases. Excellent value for annual gaming commitment. Perfect for EA sports game fans.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 55,
    name: "EA Play Pro 1 Year",
    category: "ea_games",
    price: 350,
    images: ["images/ea-logo.png"],
    description: "EA Play Pro annual subscription with full year unlimited access including premium editions. Latest game releases and seasonal content. Best value for dedicated EA gaming enthusiasts. Maximum savings with year-long commitment.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 56,
    name: "Xbox Game Pass PC Essential",
    category: "xbox_pc",
    price: 40,
    images: ["images/xbox-game-pass.png"],
    description: "Xbox Game Pass for PC Essential tier with one month access to 50+ games including day-one releases. Play on Windows PC with Game Pass library. Perfect entry for PC gamers. Instant game library access.",
    rating: 4.7,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 57,
    name: "Xbox Game Pass PC Premium",
    category: "xbox_pc",
    price: 60,
    images: ["images/xbox-game-pass.png"],
    description: "Xbox Game Pass for PC Premium tier with one month of 200+ games including AAA titles. Day-one releases and cloud gaming across devices. Better value with expanded game library. Premium PC gaming experience.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 58,
    name: "Xbox Game Pass PC Ultimate",
    category: "xbox_pc",
    price: 110,
    images: ["images/xbox-game-pass.png"],
    description: "Xbox Game Pass for PC Ultimate tier with one month of 500+ games on PC and Xbox. Ultimate game library with newest AAA titles and cloud gaming. Premium tier with maximum gaming options available.",
    rating: 4.9,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 59,
    name: "ARC Raiders Steam Account",
    category: "pc",
    price: 95,
    images: ["images/arc-raiders.png", "images/Arc_Raiders2.png", "images/Arc_Raiders3.png"],
    description: "ARC Raiders Steam Account offering access to this free-to-play cooperative shooter game. Team up with friends for tactical multiplayer combat. Regular content updates and seasonal events included. Perfect for tactical gaming fans.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 60,
    name: "FC 26 Standard Edition Steam Account",
    category: "pc",
    price: 45,
    images: ["images/fc-26.png", "images/fc-26s.png", "images/fc-26-2.png"],
    description: "FC 26 Standard Edition Steam Account with the latest football gaming experience. Build ultimate teams, compete online, and manage career modes. Enhanced graphics and gameplay improvements. Essential for football gaming enthusiasts.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 61,
    name: "GTA V Standard Edition Steam Account",
    category: "pc",
    price: 50,
    images: ["images/gta5.png", "images/gta5-2.png", "images/gta5-3.png"],
    description: "GTA V Standard Edition Steam Account for the iconic action-adventure masterpiece. Explore massive open worlds, engage in epic missions, and online multiplayer. One of gaming's greatest achievements. Timeless entertainment.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 62,
    name: "RUST Steam Account",
    category: "pc",
    price: 35,
    images: ["images/rust.png", "images/rust-2.png", "images/rust-3.png"],
    description: "RUST Steam Account for the intense multiplayer survival experience. Form alliances, gather resources, and survive against other players. Constant updates with new content. For hardcore survival game enthusiasts.",
    rating: 4.8,
    popular: true,
    recommended: true,
    inStock: true
  },
  {
    id: 63,
    name: "Elden Ring Steam Account",
    category: "pc",
    price: 80,
    images: ["images/elden-ring.png", "images/elden-ring-2.png", "images/elden-ring-3.png"],
    description: "Elden Ring Steam Account featuring FromSoftware's visionary open-world action-RPG. Epic boss battles, sprawling environments, and rich lore. Award-winning masterpiece. Essential for challenging action game fans.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 64,
    name: "HELLDIVERS 2 Steam Account",
    category: "pc",
    price: 95,
    images: ["images/helldivers-2-2.png", "images/helldivers-2-3.png"],
    description: "HELLDIVERS 2 Steam Account for intense cooperative third-person shooter combat. Fight alien hordes with friends in dynamic battles. Strategic teamwork required. Outstanding multiplayer action experience.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 65,
    name: "Nioh 3 Steam Account",
    category: "pc",
    price: 140,
    images: ["images/nioh-3.png", "images/nioh-3-2.png", "images/nioh-3-3.png"],
    description: "Nioh 3 Steam Account is a challenging soulslike set in Japan combining samurai action with supernatural elements. Complex combat mechanics and deep character customization. Demanding action-RPG for experienced players.",
    rating: 4.8,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 66,
    name: "REANIMAL Steam CD Key",
    category: "pc",
    price: 60,
    images: ["images/REANIMAL.png", "images/REANIMAL-2.png", "images/REANIMAL-3.png"],
    description: "REANIMAL Steam CD Key for the survival action game with atmospheric gameplay. Explore mysterious environments and solve puzzles while staying alive. Unique indie experience. For adventure and mystery lovers.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 67,
    name: "No Man's Sky Steam Account",
    category: "pc",
    price: 35,
    images: ["images/no-man-s-sky.png", "images/no-man-s-sky-2.png", "images/no-man-s-sky-3.png"],
    description: "No Man's Sky Steam Account for the endless space exploration and survival adventure. Discover billions of planets, engage in trading and combat, and build bases. Constantly updated with new content. Sci-fi exploration paradise.",
    rating: 4.8,
    popular: false,
    recommended: true,
    inStock: true
  },
  {
    id: 68,
    name: "Cyberpunk 2077 Steam Account",
    category: "pc",
    price: 45,
    images: ["images/Cyberpunk2077.png", "images/Cyberpunk2077-2.png", "images/Cyberpunk2077-3.png"],
    description: "Cyberpunk 2077 Steam Account for this futuristic action RPG in Night City. Immersive storytelling, deep character customization, and cybernetic enhancements. Expansive open world to explore. Epic sci-fi adventure.",
    rating: 4.8,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 69,
    name: "ARC Raiders Steam CD Key",
    category: "pc",
    price: 110,
    images: ["images/arc-raiders.png", "images/Arc_Raiders2.png", "images/Arc_Raiders3.png"],
    description: "ARC Raiders Steam CD Key for the cooperative tactical shooter with team-based gameplay. Strategic missions requiring communication and coordination with teammates. Regular seasonal updates. Perfect for squad-based action.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  },
  {
    id: 70,
    name: "Nioh 3 Steam CD Key",
    category: "pc",
    price: 170,
    images: ["images/nioh-3.png", "images/nioh-3-2.png", "images/nioh-3-3.png"],
    description: "Nioh 3 Steam CD Key delivering supreme challenge through this demanding soulslike action-RPG. Samurai combat combined with supernatural abilities and intricate level design. Lasting difficulty and depth. For hardcore action lovers.",
    rating: 4.8,
    popular: false,
    recommended: false,
    inStock: true
  },
  {
    id: 71,
    name: "Minecraft Microsoft Account",
    category: "pc",
    price: 40,
    images: ["images/minecraft-java-and-bedrock-edition-pc-mac-cover.jpg", "images/mc2.png", "images/mc3.png"],
    description: "Minecraft Microsoft Account for unlimited creative and survival gaming possibilities. Build incredible structures, explore generated worlds, and play with friends online. Timeless sandbox gaming. Perfect for players of all ages.",
    rating: 4.8,
    popular: true,
    recommended: false,
    inStock: true
  }
];

(async () => {
  try {
    const redis = await getRedis();
    console.log("📦 Starting product seed...");

    let created = 0;
    let failed = 0;

    for (const product of PRODUCTS) {
      try {
        await redis.set(`product:${product.id}`, JSON.stringify(product));
        console.log(`✅ Created: ${product.name} (ID: ${product.id})`);
        created++;
      } catch (error) {
        console.error(`❌ Failed to create ${product.name}:`, error.message);
        failed++;
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Successfully created: ${created}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`ℹ️  Total products: ${PRODUCTS.length}`);

    if (created === PRODUCTS.length) {
      console.log("\n✨ All products loaded successfully!");
      console.log("🚀 You can now:");
      console.log("   1. Refresh your admin dashboard to see all products");
      console.log("   2. Edit/delete any product");
      console.log("   3. Add to cart and checkout will use local products");
    }

    process.exit(failed > 0 ? 1 : 0);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
})();
