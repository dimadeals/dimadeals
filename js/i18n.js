/* ============================================================================
   DIMA Deals — centralized i18n runtime
   ----------------------------------------------------------------------------
   Classic script so both the storefront ES modules and the admin dashboard can
   share one translation layer. English source text is the message id; missing
   translations fall back to English safely.
   ========================================================================== */
(function (global) {
  'use strict';

  const SUPPORTED_LANGUAGES = ['en', 'fr', 'ar'];
  const DEFAULT_LANGUAGE = 'en';
  const LANGUAGE_LOCALES = { en: 'en-GB', fr: 'fr-FR', ar: 'ar-TN-u-nu-latn' };

  // Embedded EN/FR/AR message dictionaries and product translations. The
  // English source text is the message id; missing entries fall back safely.
  const MESSAGES = {
    fr: {
  "DIMA Deals home": "Accueil DIMA Deals",
  "Main navigation": "Navigation principale",
  "Subscriptions": "Abonnements",
  "All subscriptions": "Tous les abonnements",
  "Games": "Jeux",
  "All games": "Tous les jeux",
  "PC games": "Jeux PC",
  "Console games": "Jeux console",
  "Mobile games": "Jeux mobiles",
  "Courses": "Formations",
  "All courses": "Toutes les formations",
  "Programming": "Programmation",
  "Design": "Design",
  "Business": "Business",
  "Apps": "Applications",
  "All apps": "Toutes les applications",
  "Mobile apps": "Applications mobiles",
  "Software": "Logiciels",
  "All products": "Tous les produits",
  "Search products": "Rechercher des produits",
  "Search": "Rechercher",
  "Shopping cart": "Panier",
  "Language": "Langue",
  "Toggle dark mode": "Activer ou désactiver le mode sombre",
  "Toggle menu": "Ouvrir ou fermer le menu",
  "Digital games, subscriptions and software for Tunisia, with clear prices and real local support.": "Jeux, abonnements et logiciels numériques pour la Tunisie, avec des prix clairs et un vrai support local.",
  "Shop": "Boutique",
  "Apps & software": "Applications et logiciels",
  "Support": "Assistance",
  "FAQ": "FAQ",
  "Help center": "Centre d’aide",
  "Contact": "Contact",
  "Terms of service": "Conditions d’utilisation",
  "Privacy policy": "Politique de confidentialité",
  "Tunisia": "Tunisie",
  "© 2026 DIMA Deals. All rights reserved.": "© 2026 DIMA Deals. Tous droits réservés.",
  "Instant delivery": "Livraison instantanée",
  "Secure checkout": "Paiement sécurisé",
  "Local support": "Support local",
  "Chat on WhatsApp": "Discuter sur WhatsApp",
  "Chat with us": "Discutez avec nous",
  "About Us - DIMA Deals": "À propos - DIMA Deals",
  "About DIMA Deals - Your trusted digital subscription provider in Tunisia.": "À propos de DIMA Deals - Votre fournisseur de confiance d’abonnements numériques en Tunisie.",
  "About DIMA Deals": "À propos de DIMA Deals",
  "Your trusted source for premium digital subscriptions at unbeatable prices": "Votre source de confiance pour des abonnements numériques premium à des prix imbattables",
  "Who We Are": "Qui sommes-nous",
  "DIMA Deals is your premier destination for affordable digital subscriptions in Tunisia. We believe that quality digital services should be accessible to everyone, which is why we've made it our mission to offer premium subscriptions at prices that don't break the bank.": "DIMA Deals est votre destination de référence pour des abonnements numériques abordables en Tunisie. Nous sommes convaincus que des services numériques de qualité doivent être accessibles à tous ; c’est pourquoi nous nous sommes donné pour mission de proposer des abonnements premium à des prix qui ne pèsent pas sur le budget.",
  "With over 1000+ happy customers, we've become the most trusted digital subscription provider in Tunisia, known for our reliability, fast delivery, and exceptional customer service.": "Avec plus de 1000 clients satisfaits, nous sommes devenus le fournisseur d’abonnements numériques le plus fiable de Tunisie, reconnu pour sa fiabilité, sa livraison rapide et un service client exceptionnel.",
  "What We Sell": "Ce que nous proposons",
  "We provide instant access to premium digital services including:": "Nous offrons un accès immédiat à des services numériques premium, notamment :",
  "Streaming Services (Netflix, Spotify, Shahid)": "Services de streaming (Netflix, Spotify, Shahid)",
  "Design Tools (Canva Pro, Adobe Creative Suite)": "Outils de design (Canva Pro, Adobe Creative Suite)",
  "Online Courses (Programming, Design, Business)": "Cours en ligne (Programmation, Design, Business)",
  "Games (PC, Console, Mobile)": "Jeux (PC, console, mobile)",
  "Software & Apps": "Logiciels et applications",
  "Our Mission": "Notre mission",
  "Make premium digital products affordable and instantly accessible to Tunisians.": "Rendre les produits numériques premium abordables et immédiatement accessibles aux Tunisiens.",
  "We're committed to:": "Nous nous engageons à :",
  "Offering the lowest prices in Tunisia": "Proposer les prix les plus bas de Tunisie",
  "Delivering subscriptions instantly (within minutes)": "Livrer les abonnements instantanément (en quelques minutes)",
  "Providing 24/7 customer support": "Assurer une assistance client 24h/24 et 7j/7",
  "Ensuring 100% safe and secure transactions": "Garantir des transactions sûres et sécurisées à 100 %",
  "Why Choose DIMA Deals?": "Pourquoi choisir DIMA Deals ?",
  "Instant Delivery:": "Livraison instantanée :",
  "Get access within minutes of purchase": "Accédez à votre abonnement quelques minutes après l’achat",
  "Lowest Prices:": "Prix les plus bas :",
  "We guarantee the best rates in Tunisia": "Nous garantissons les meilleurs tarifs en Tunisie",
  "100% Safe:": "100 % sûr :",
  "Secure payment processing & encrypted data": "Paiement sécurisé et données chiffrées",
  "Customer Support:": "Assistance client :",
  "Friendly team ready to help": "Une équipe sympathique prête à vous aider",
  "Trusted:": "De confiance :",
  "1000+ satisfied customers": "Plus de 1000 clients satisfaits",
  "How It Works": "Comment ça marche",
  "Browse": "Parcourir",
  "Explore our catalog of premium digital subscriptions and products": "Explorez notre catalogue d’abonnements et de produits numériques premium",
  "Purchase": "Acheter",
  "Add items to cart and securely complete checkout": "Ajoutez des articles au panier et finalisez votre commande en toute sécurité",
  "Deliver": "Recevoir",
  "Receive your access credentials instantly via email": "Recevez immédiatement vos identifiants d’accès par e-mail",
  "Enjoy": "Profiter",
  "Start using your subscription immediately!": "Commencez à utiliser votre abonnement dès maintenant !",
  "Contact Us - DIMA Deals": "Contact - DIMA Deals",
  "Contact DIMA Deals - Get in touch with our customer support team.": "Contact DIMA Deals - Prenez contact avec notre équipe d’assistance client.",
  "Contact Us": "Contactez-nous",
  "Have a question? We'd love to hear from you. Get in touch with our team anytime!": "Une question ? Nous serions ravis de vous lire. Contactez notre équipe à tout moment !",
  "Message sent successfully! We'll respond soon.": "Message envoyé avec succès ! Nous vous répondrons rapidement.",
  "Please fill in all fields": "Veuillez remplir tous les champs",
  "Sending...": "Envoi en cours…",
  "Failed to send message": "Échec de l’envoi du message",
  "Error sending message. Please try again.": "Erreur lors de l’envoi du message. Veuillez réessayer.",
  "Your Name *": "Votre nom *",
  "John Doe": "Jean Dupont",
  "Email Address *": "Adresse e-mail *",
  "your@email.com": "votre@email.com",
  "Your Message *": "Votre message *",
  "Tell us how we can help...": "Dites-nous comment nous pouvons vous aider…",
  "Send Message": "Envoyer le message",
  "Email": "E-mail",
  "Phone": "Téléphone",
  "Location": "Localisation",
  "FAQ - DIMA Deals": "FAQ - DIMA Deals",
  "Frequently asked questions about DIMA Deals.": "Questions fréquentes sur DIMA Deals.",
  "Frequently Asked Questions": "Questions fréquentes",
  "Find answers to common questions about DIMA Deals": "Trouvez les réponses aux questions les plus fréquentes sur DIMA Deals",
  "How does instant delivery work?": "Comment fonctionne la livraison instantanée ?",
  "Once you complete your purchase and payment is verified, we immediately send you your access credentials via email. You can typically start using your subscription within 5-10 minutes of purchase. No waiting periods, no delays!": "Dès que votre achat est finalisé et le paiement vérifié, nous vous envoyons immédiatement vos identifiants d’accès par e-mail. Vous pouvez généralement commencer à utiliser votre abonnement dans les 5 à 10 minutes suivant l’achat. Aucune attente, aucun retard !",
  "What payment methods do you accept?": "Quels moyens de paiement acceptez-vous ?",
  "We accept manual payments through:": "Nous acceptons les paiements manuels par :",
  "Bank transfer": "Virement bancaire",
  "Orange Money (Tunisian mobile money)": "Orange Money (paiement mobile tunisien)",
  "Attijari Bank payments": "Paiements Attijari Bank",
  "WhatsApp direct contact for special arrangements": "Contact direct via WhatsApp pour des arrangements particuliers",
  "Our team will guide you through the payment process when you checkout.": "Notre équipe vous guidera tout au long du processus de paiement lors de votre commande.",
  "What is your refund policy?": "Quelle est votre politique de remboursement ?",
  "30-Day Money Back Guarantee:": "Garantie satisfait ou remboursé de 30 jours :",
  "If you're not satisfied with your purchase for any reason, you can request a full refund within 30 days. We want you to be completely happy with DIMA Deals.": "Si votre achat ne vous satisfait pas, quelle qu’en soit la raison, vous pouvez demander un remboursement intégral dans les 30 jours. Nous voulons que vous soyez entièrement satisfait de DIMA Deals.",
  "Instant Access Refunds:": "Remboursements liés à l’accès instantané :",
  "Since our products are delivered instantly, refunds are only available if the product doesn't work as advertised or you have technical issues we can't resolve.": "Comme nos produits sont livrés instantanément, les remboursements ne sont possibles que si le produit ne fonctionne pas comme annoncé ou en cas de problème technique que nous ne parvenons pas à résoudre.",
  "Is my account safe with DIMA Deals?": "Mon compte est-il en sécurité avec DIMA Deals ?",
  "Yes! We take security very seriously:": "Oui ! La sécurité est pour nous une priorité absolue :",
  "All transactions are encrypted and secure": "Toutes les transactions sont chiffrées et sécurisées",
  "Your personal data is never shared with third parties": "Vos données personnelles ne sont jamais partagées avec des tiers",
  "We use industry-standard security protocols": "Nous utilisons des protocoles de sécurité conformes aux standards du secteur",
  "Your email and phone are only used for order confirmations and support": "Votre e-mail et votre téléphone ne servent qu’aux confirmations de commande et à l’assistance",
  "We comply with international data protection standards": "Nous respectons les normes internationales de protection des données",
  "Can I use the same product on multiple accounts?": "Puis-je utiliser le même produit sur plusieurs comptes ?",
  "This depends on the specific product. Most subscriptions allow 1-4 simultaneous streams or logins. Please check the product description for specific details about account sharing limits.": "Cela dépend du produit concerné. La plupart des abonnements autorisent 1 à 4 flux ou connexions simultanés. Consultez la description du produit pour connaître les limites de partage de compte.",
  "Note:": "Remarque :",
  "Some services may detect and block simultaneous logins from different geographic locations.": "Certains services peuvent détecter et bloquer les connexions simultanées depuis des zones géographiques différentes.",
  "What if I don't receive my credentials?": "Que faire si je ne reçois pas mes identifiants ?",
  "If you don't receive your access credentials within 15 minutes:": "Si vous ne recevez pas vos identifiants d’accès dans les 15 minutes :",
  "Check your spam/junk email folder": "Vérifiez votre dossier de courriers indésirables (spam)",
  "Contact us immediately via WhatsApp or email": "Contactez-nous immédiatement par WhatsApp ou par e-mail",
  "We'll resend your credentials right away": "Nous vous renverrons vos identifiants sans délai",
  "If there's an issue, we'll offer a full refund": "En cas de problème, nous vous proposerons un remboursement intégral",
  "Our support team is available 24/7 to assist you.": "Notre équipe d’assistance est disponible 24h/24 et 7j/7 pour vous aider.",
  "Are you officially affiliated with these services?": "Êtes-vous officiellement affilié à ces services ?",
  "DIMA Deals is an authorized reseller of digital products and subscriptions. All products we sell are legitimate and official. We work directly with service providers to ensure the best rates and instant delivery for our customers.": "DIMA Deals est un revendeur agréé de produits et d’abonnements numériques. Tous les produits que nous vendons sont légitimes et officiels. Nous travaillons directement avec les fournisseurs de services afin de garantir les meilleurs tarifs et une livraison instantanée à nos clients.",
  "Do you offer bulk/discounts for multiple purchases?": "Proposez-vous des tarifs de gros ou des remises pour les achats multiples ?",
  "Yes! We offer special pricing for bulk orders. Contact our team via WhatsApp or email with your requirements, and we'll provide you with a customized quote.": "Oui ! Nous proposons des tarifs spéciaux pour les commandes en gros. Contactez notre équipe par WhatsApp ou par e-mail en précisant vos besoins, et nous vous établirons un devis personnalisé.",
  "For businesses, schools, or organizations looking to purchase in bulk, we can arrange special rates.": "Pour les entreprises, les écoles ou les organisations souhaitant acheter en gros, nous pouvons mettre en place des tarifs spéciaux.",
  "Help Center - DIMA Deals": "Centre d’aide - DIMA Deals",
  "Help Center and guides for DIMA Deals.": "Centre d’aide et guides pour DIMA Deals.",
  "Help Center": "Centre d’aide",
  "Learn how to get the most out of DIMA Deals": "Découvrez comment profiter au mieux de DIMA Deals",
  "How to Order": "Comment commander",
  "Get started with your first purchase in just a few clicks": "Passez votre première commande en quelques clics",
  "Browse our catalog": "Parcourez notre catalogue",
  "Add items to cart": "Ajoutez des articles au panier",
  "Receiving Your Product": "Recevoir votre produit",
  "We'll send everything you need via email": "Nous vous envoyons tout ce dont vous avez besoin par e-mail",
  "Check your email": "Consultez votre e-mail",
  "Look in spam folder": "Vérifiez le dossier spam",
  "Save credentials": "Enregistrez vos identifiants",
  "Start using now": "Commencez à l’utiliser dès maintenant",
  "Troubleshooting": "Dépannage",
  "Having issues? We're here to help": "Un problème ? Nous sommes là pour vous aider",
  "Verify your email": "Vérifiez votre adresse e-mail",
  "Check credentials": "Vérifiez vos identifiants",
  "Contact support": "Contactez l’assistance",
  "Fast resolution": "Résolution rapide",
  "Step-by-Step: How to Order": "Étape par étape : comment commander",
  "Create Account:": "Créer un compte :",
  "Sign up or log in to your DIMA Deals account": "Inscrivez-vous ou connectez-vous à votre compte DIMA Deals",
  "Browse Products:": "Parcourir les produits :",
  "Explore our catalog of digital products and subscriptions": "Explorez notre catalogue de produits et d’abonnements numériques",
  "Select Product:": "Sélectionner un produit :",
  "Click on the product you want and view details": "Cliquez sur le produit souhaité et consultez ses détails",
  "Add to Cart:": "Ajouter au panier :",
  "Click the \"Get Access Now\" button to add to your cart": "Cliquez sur le bouton « Obtenir l’accès maintenant » pour l’ajouter à votre panier",
  "Checkout:": "Validation de la commande :",
  "Review your cart and proceed to checkout": "Vérifiez votre panier et passez à la validation de la commande",
  "Payment:": "Paiement :",
  "Make payment using our secure payment method": "Effectuez le paiement au moyen de notre méthode de paiement sécurisée",
  "Receive Credentials:": "Recevoir vos identifiants :",
  "Check your email for instant access details": "Consultez votre e-mail pour obtenir vos accès instantanés",
  "Start Using:": "Commencer à utiliser :",
  "Use your credentials to access the service immediately": "Utilisez vos identifiants pour accéder immédiatement au service",
  "Where to Find Your Product": "Où trouver votre produit",
  "Check Your Email:": "Consultez votre e-mail :",
  "Within 5-10 minutes of purchase, you'll receive an email with your access details": "Dans les 5 à 10 minutes suivant l’achat, vous recevrez un e-mail contenant vos détails d’accès",
  "Check Spam Folder:": "Vérifiez le dossier spam :",
  "Sometimes emails wind up in spam - check there if you don't see it in your inbox": "Il arrive que les e-mails arrivent dans le dossier spam : vérifiez-le si vous ne le voyez pas dans votre boîte de réception",
  "Contact Us:": "Contactez-nous :",
  "If you don't receive your order, reach out to us on WhatsApp or email and we'llresend immediately": "Si vous ne recevez pas votre commande, contactez-nous via WhatsApp ou par e-mail et nous vous la renverrons immédiatement",
  "Save Your Credentials:": "Enregistrez vos identifiants :",
  "Save your username and password securely for future access": "Conservez votre nom d’utilisateur et votre mot de passe en lieu sûr pour vos prochains accès",
  "Common Issues & Solutions": "Problèmes courants et solutions",
  "Didn't receive email?": "Vous n’avez pas reçu d’e-mail ?",
  "Wait 15 minutes, check spam folder, then contact us": "Attendez 15 minutes, vérifiez le dossier spam, puis contactez-nous",
  "Credentials don't work?": "Vos identifiants ne fonctionnent pas ?",
  "Copy-paste carefully, try different browser, contact support": "Copiez-collez avec précaution, essayez un autre navigateur, contactez l’assistance",
  "Account locked?": "Compte bloqué ?",
  "Too many failed attempts - wait 30 minutes or contact us": "Trop de tentatives échouées : attendez 30 minutes ou contactez-nous",
  "Need a refund?": "Besoin d’un remboursement ?",
  "Contact us within 30 days for a full refund": "Contactez-nous dans les 30 jours pour un remboursement intégral",
  "Want to cancel?": "Vous souhaitez résilier ?",
  "No hidden fees - manage your subscription directly with the provider": "Aucuns frais cachés : gérez votre abonnement directement auprès du fournisseur",
  "Still Need Help?": "Besoin d’aide supplémentaire ?",
  "Our friendly support team is available 24/7 to assist you:": "Notre équipe d’assistance, toujours disponible, est là pour vous aider 24h/24 et 7j/7 :",
  "Email:": "E-mail :",
  "WhatsApp:": "WhatsApp :",
  "Response Time:": "Délai de réponse :",
  "We typically respond within 2 hours": "Nous répondons généralement dans les 2 heures",
  "Privacy Policy - DIMA Deals": "Politique de confidentialité - DIMA Deals",
  "Privacy Policy for DIMA Deals. Learn how we handle your data.": "Politique de confidentialité de DIMA Deals. Découvrez comment nous traitons vos données.",
  "Privacy Policy": "Politique de confidentialité",
  "Your privacy is important to us. Learn how we handle your information.": "Votre vie privée nous tient à cœur. Découvrez comment nous traitons vos informations.",
  "1. What Information We Collect": "1. Informations que nous collectons",
  "When you use DIMA Deals, we collect:": "Lorsque vous utilisez DIMA Deals, nous collectons :",
  "Email Address:": "Adresse e-mail :",
  "Used for account creation and order confirmations": "Utilisée pour la création du compte et les confirmations de commande",
  "Phone Number:": "Numéro de téléphone :",
  "For WhatsApp messages and order support": "Pour les messages WhatsApp et l’assistance liée aux commandes",
  "Payment Information:": "Informations de paiement :",
  "Bank transfer details or payment method (processed securely)": "Coordonnées de virement bancaire ou moyen de paiement (traitées en toute sécurité)",
  "Usage Data:": "Données d’utilisation :",
  "Pages visited, products viewed, searches performed": "Pages consultées, produits consultés, recherches effectuées",
  "Device Information:": "Informations sur l’appareil :",
  "Browser type, IP address, operating system": "Type de navigateur, adresse IP, système d’exploitation",
  "Order History:": "Historique des commandes :",
  "Products purchased and delivery status": "Produits achetés et statut de livraison",
  "2. How We Use Your Information": "2. Utilisation de vos informations",
  "We use collected information to:": "Nous utilisons les informations collectées pour :",
  "Deliver your purchased subscriptions and products": "Livrer les abonnements et produits que vous avez achetés",
  "Process payments and handle refunds": "Traiter les paiements et gérer les remboursements",
  "Provide customer support": "Assurer l’assistance client",
  "Send order confirmations and updates": "Envoyer les confirmations de commande et les mises à jour",
  "Personalize your experience": "Personnaliser votre expérience",
  "Improve our services and prevent fraud": "Améliorer nos services et prévenir la fraude",
  "Send promotional content (if you opt in)": "Envoyer du contenu promotionnel (si vous y consentez)",
  "3. Data Sharing & Third Parties": "3. Partage des données et tiers",
  "We Do NOT Share Your Data": "Nous ne partageons PAS vos données",
  "We do not sell, share, or disclose your personal information to third parties for marketing or any other purpose without your explicit consent.": "Nous ne vendons, ne partageons et ne divulguons pas vos informations personnelles à des tiers à des fins marketing ou pour tout autre motif sans votre consentement explicite.",
  "The only exceptions:": "Les seules exceptions :",
  "Third-party payment processors (encrypted and secure)": "Prestataires de paiement tiers (chiffrés et sécurisés)",
  "Essential service providers (hosting, analytics)": "Prestataires de services essentiels (hébergement, analyses)",
  "Legal requirements (government orders, law enforcement)": "Obligations légales (décisions gouvernementales, autorités judiciaires)",
  "4. Data Security": "4. Sécurité des données",
  "We protect your information through:": "Nous protégeons vos informations grâce à :",
  "Encryption:": "Chiffrement :",
  "All sensitive data encrypted in transit and at rest": "Toutes les données sensibles sont chiffrées en transit et au repos",
  "Secure Servers:": "Serveurs sécurisés :",
  "Enterprise-level hosting with security measures": "Hébergement de niveau entreprise avec des mesures de sécurité",
  "Access Control:": "Contrôle d’accès :",
  "Only authorized personnel access data": "Seul le personnel autorisé accède aux données",
  "Regular Audits:": "Audits réguliers :",
  "Security assessments and updates": "Évaluations de sécurité et mises à jour",
  "SSL Certificate:": "Certificat SSL :",
  "HTTPS encryption for all website traffic": "Chiffrement HTTPS pour l’ensemble du trafic du site",
  "However, no method of transmission is 100% secure. We work to maintain appropriate security but cannot guarantee absolute security.": "Toutefois, aucune méthode de transmission n’est sûre à 100 %. Nous nous efforçons de maintenir un niveau de sécurité approprié, sans pouvoir garantir une sécurité absolue.",
  "5. Cookies & Tracking": "5. Cookies et suivi",
  "What are Cookies?": "Que sont les cookies ?",
  "Small text files stored on your device to remember your preferences.": "De petits fichiers texte enregistrés sur votre appareil pour mémoriser vos préférences.",
  "How we use them:": "Comment nous les utilisons :",
  "Remember your logged-in status": "Mémoriser votre état de connexion",
  "Store shopping cart contents": "Conserver le contenu de votre panier",
  "Track site usage (analytics)": "Suivre l’utilisation du site (analyses)",
  "Remember dark mode preference": "Mémoriser votre préférence pour le mode sombre",
  "Provide personalized recommendations": "Proposer des recommandations personnalisées",
  "You can control cookies through your browser settings. Disabling cookies may affect your experience.": "Vous pouvez gérer les cookies dans les paramètres de votre navigateur. La désactivation des cookies peut affecter votre expérience.",
  "6. Your Privacy Rights": "6. Vos droits en matière de vie privée",
  "GDPR Compliance (EU Users)": "Conformité au RGPD (utilisateurs de l’UE)",
  "If you're in the EU, you have rights regarding your data:": "Si vous résidez dans l’UE, vous disposez de droits sur vos données :",
  "Right to Access:": "Droit d’accès :",
  "Request a copy of your data": "Demander une copie de vos données",
  "Right to Rectification:": "Droit de rectification :",
  "Correct inaccurate information": "Corriger les informations inexactes",
  "Right to Erasure:": "Droit à l’effacement :",
  "Request deletion of your data": "Demander la suppression de vos données",
  "Right to Restriction:": "Droit à la limitation :",
  "Limit processing of your data": "Limiter le traitement de vos données",
  "Right to Portability:": "Droit à la portabilité :",
  "Download your data in portable format": "Télécharger vos données dans un format portable",
  "Right to Object:": "Droit d’opposition :",
  "Opt out of marketing communications": "Refuser les communications marketing",
  "To exercise these rights:": "Pour exercer ces droits :",
  "with your request.": "avec votre demande.",
  "All Users": "Tous les utilisateurs",
  "You can:": "Vous pouvez :",
  "Update your account information anytime": "Mettre à jour les informations de votre compte à tout moment",
  "Opt out of marketing emails (unsubscribe link in all emails)": "Refuser les e-mails marketing (lien de désinscription dans chaque e-mail)",
  "Request data deletion or correction": "Demander la suppression ou la correction de vos données",
  "Contact us with privacy concerns": "Nous contacter pour toute question de confidentialité",
  "7. Data Retention": "7. Conservation des données",
  "We keep your information:": "Nous conservons vos informations :",
  "Account Data:": "Données du compte :",
  "As long as your account is active": "Aussi longtemps que votre compte est actif",
  "For at least 7 years (legal requirement)": "Pendant au moins 7 ans (obligation légale)",
  "Email Lists:": "Listes de diffusion :",
  "Until you unsubscribe": "Jusqu’à votre désinscription",
  "Cookies:": "Cookies :",
  "Typically 1 year (configurable)": "Généralement 1 an (configurable)",
  "Upon account deletion, we remove personal data within 30 days (except where legally required to keep).": "En cas de suppression du compte, nous effaçons les données personnelles sous 30 jours (sauf obligation légale de conservation).",
  "8. Children's Privacy": "8. Confidentialité des enfants",
  "DIMA Deals is not intended for children under 18. We do not knowingly collect information from minors. If we discover a child's data was collected, we'll delete it immediately.": "DIMA Deals ne s’adresse pas aux enfants de moins de 18 ans. Nous ne collectons pas sciemment de données concernant des mineurs. Si nous découvrons que les données d’un enfant ont été collectées, nous les supprimons immédiatement.",
  "9. International Data Transfer": "9. Transfert international de données",
  "Your data may be stored on servers outside Tunisia. By using DIMA Deals, you consent to data transfer. We ensure transfers comply with GDPR and other privacy laws.": "Vos données peuvent être stockées sur des serveurs situés hors de Tunisie. En utilisant DIMA Deals, vous consentez à ce transfert. Nous veillons à ce que ces transferts respectent le RGPD et les autres lois sur la protection des données.",
  "10. Updates to This Policy": "10. Mises à jour de cette politique",
  "We may update this Privacy Policy occasionally. Changes become effective 30 days after posting. Your continued use means acceptance. We'll notify you of material changes via email.": "Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Les modifications prennent effet 30 jours après leur publication. La poursuite de votre utilisation vaut acceptation. Nous vous informerons des changements importants par e-mail.",
  "11. Contact Us": "11. Nous contacter",
  "Questions about privacy? We're here to help:": "Des questions sur la confidentialité ? Nous sommes là pour vous aider :",
  "Address:": "Adresse :",
  "Data Protection Officer": "Délégué à la protection des données",
  "For GDPR or privacy concerns, contact our Data Protection team at": "Pour toute question relative au RGPD ou à la confidentialité, contactez notre équipe de protection des données à l’adresse",
  "Last updated:": "Dernière mise à jour :",
  "Terms of Service - DIMA Deals": "Conditions d’utilisation - DIMA Deals",
  "Terms of Service for DIMA Deals.": "Conditions d’utilisation de DIMA Deals.",
  "Terms of Service": "Conditions d’utilisation",
  "Please read carefully before using DIMA Deals": "Veuillez lire attentivement avant d’utiliser DIMA Deals",
  "1. Service Usage": "1. Utilisation du service",
  "By using DIMA Deals, you agree to our Terms of Service. You must:": "En utilisant DIMA Deals, vous acceptez nos conditions d’utilisation. Vous devez :",
  "Be at least 18 years old (or have parental consent)": "Avoir au moins 18 ans (ou disposer du consentement parental)",
  "Provide accurate information during registration": "Fournir des informations exactes lors de l’inscription",
  "Use the service only for personal use": "Utiliser le service à des fins strictement personnelles",
  "Not resell or redistribute credentials": "Ne pas revendre ni redistribuer les identifiants",
  "Comply with all applicable laws": "Respecter toutes les lois applicables",
  "Not attempt unauthorized access to our systems": "Ne pas tenter d’accéder sans autorisation à nos systèmes",
  "2. Payments & Billing": "2. Paiements et facturation",
  "Price & Payment Terms": "Tarifs et conditions de paiement",
  "All prices are in Tunisian Dinars (TND). Prices may change without notice but changes won't affect existing orders. Payment is required before access to products is granted.": "Tous les prix sont en dinars tunisiens (TND). Les prix peuvent changer sans préavis, mais ces changements n’affectent pas les commandes déjà passées. Le paiement est requis avant tout accès aux produits.",
  "Payment Methods": "Moyens de paiement",
  "Direct WhatsApp payment arrangements": "Ententes de paiement directes via WhatsApp",
  "Billing Disputes": "Litiges de facturation",
  "If you have a billing dispute, contact us within 30 days with proof. We'll investigate and resolve promptly.": "En cas de litige de facturation, contactez-nous dans les 30 jours en fournissant une preuve. Nous examinerons la situation et la résoudrons rapidement.",
  "3. Refund & Return Policy": "3. Politique de remboursement et de retour",
  "If you're unsatisfied with your purchase, you can request a full refund within 30 days of purchase.": "Si votre achat ne vous satisfait pas, vous pouvez demander un remboursement intégral dans les 30 jours suivant l’achat.",
  "Refund Eligibility": "Conditions d’éligibilité au remboursement",
  "Request must be made within 30 days": "La demande doit être faite dans les 30 jours",
  "Product must not work as advertised": "Le produit ne doit pas fonctionner comme annoncé",
  "Technical issues must be unresolvable": "Les problèmes techniques doivent être insolubles",
  "No refund for changed mind (we can't take back digital access)": "Aucun remboursement en cas de changement d’avis (l’accès numérique ne peut pas être repris)",
  "Refund Process": "Processus de remboursement",
  "Approved refunds are processed within 5-7 business days to your original payment method.": "Les remboursements approuvés sont traités sous 5 à 7 jours ouvrés sur votre moyen de paiement d’origine.",
  "4. Product Warranties": "4. Garanties sur les produits",
  "DIMA Deals provides credentials and access to third-party services. We warrant that:": "DIMA Deals fournit des identifiants et un accès à des services tiers. Nous garantissons que :",
  "Credentials will be delivered as promised": "Les identifiants seront livrés comme promis",
  "Access will be instant upon purchase": "L’accès sera instantané dès l’achat",
  "Credentials will be valid and functional": "Les identifiants seront valides et fonctionnels",
  "However, DIMA Deals is not responsible for service outages, policy changes, or issues with the third-party service provider.": "Toutefois, DIMA Deals n’est pas responsable des interruptions de service, des changements de politique ni des problèmes liés au fournisseur de services tiers.",
  "5. Limitation of Liability": "5. Limitation de responsabilité",
  "DIMA Deals is provided \"as-is\" without warranties. We're not liable for:": "DIMA Deals est fourni « en l’état », sans garantie. Nous ne saurions être tenus responsables de :",
  "Indirect or consequential damages": "Dommages indirects ou consécutifs",
  "Loss of data or profits": "Perte de données ou de bénéfices",
  "Third-party service changes or outages": "Changements ou interruptions de services tiers",
  "Unauthorized account access": "Accès non autorisé au compte",
  "Any damages exceeding the purchase price": "Tout dommage dépassant le prix d’achat",
  "6. Account Responsibility": "6. Responsabilité du compte",
  "You are responsible for:": "Vous êtes responsable de :",
  "Keeping your login credentials secure": "La confidentialité de vos identifiants de connexion",
  "All activity using your account": "Toute activité effectuée avec votre compte",
  "Notifying us of unauthorized access": "Nous signaler tout accès non autorisé",
  "Service terms of the third-party provider": "Le respect des conditions de service du fournisseur tiers",
  "7. Intellectual Property": "7. Propriété intellectuelle",
  "DIMA Deals name, logo, and content are protected intellectual property. You may not:": "Le nom, le logo et le contenu de DIMA Deals sont des éléments de propriété intellectuelle protégés. Vous ne pouvez pas :",
  "Copy or reproduce without permission": "Copier ou reproduire sans autorisation",
  "Create derivative works": "Créer des œuvres dérivées",
  "Use for commercial purposes": "Utiliser à des fins commerciales",
  "Remove copyright notices": "Supprimer les mentions de droits d’auteur",
  "8. Changes to Terms": "8. Modifications des conditions",
  "We may update these terms anytime. We'll notify users of material changes. Your continued use means acceptance of new terms.": "Nous pouvons modifier ces conditions à tout moment. Nous informerons les utilisateurs des changements importants. La poursuite de votre utilisation vaut acceptation des nouvelles conditions.",
  "9. Termination": "9. Résiliation",
  "We may terminate your account if you violate these terms or any applicable laws. Termination is without refund unless required by law.": "Nous pouvons résilier votre compte si vous enfreignez ces conditions ou toute loi applicable. La résiliation n’ouvre pas droit à remboursement, sauf obligation légale.",
  "10. Governing Law": "10. Droit applicable",
  "These terms are governed by the laws of Tunisia. Any disputes will be resolved in Tunisian courts.": "Ces conditions sont régies par le droit tunisien. Tout litige sera tranché par les tribunaux tunisiens.",
  "For questions about these terms, contact us:": "Pour toute question concernant ces conditions, contactez-nous :",
  "DIMA Deals — Admin Dashboard": "DIMA Deals — Tableau de bord administrateur",
  "Admin Dashboard": "Tableau de bord administrateur",
  "DIMA Deals Control Panel": "Panneau de contrôle DIMA Deals",
  "Admin Key": "Clé d’administration",
  "Enter your admin key": "Saisissez votre clé d’administration",
  "Sign In": "Se connecter",
  "Overview": "Aperçu",
  "Orders": "Commandes",
  "Categories": "Catégories",
  "Products": "Produits",
  "Messages": "Messages",
  "Logout": "Déconnexion",
  "Refresh": "Actualiser",
  "Total Orders": "Total des commandes",
  "All time": "Depuis le début",
  "Total Revenue": "Chiffre d’affaires",
  "Pending": "En attente",
  "Awaiting action": "En attente d’action",
  "Today": "Aujourd’hui",
  "New orders": "Nouvelles commandes",
  "Revenue — Last 7 Days": "Chiffre d’affaires — 7 derniers jours",
  "Daily revenue trend (TND)": "Tendance quotidienne du chiffre d’affaires (TND)",
  "Order Status": "Statut des commandes",
  "Current distribution": "Répartition actuelle",
  "Recent Orders": "Commandes récentes",
  "View All": "Tout afficher",
  "Order ID": "N° de commande",
  "Customer": "Client",
  "Items": "Articles",
  "Total": "Total",
  "Status": "Statut",
  "Date": "Date",
  "Loading…": "Chargement…",
  "Loading messages…": "Chargement des messages…",
  "Search by ID, email, or name…": "Rechercher par ID, e-mail ou nom…",
  "All Statuses": "Tous les statuts",
  "Processing": "En cours",
  "Completed": "Terminée",
  "Delivered": "Livrée",
  "Cancelled": "Annulée",
  "Date (Newest)": "Date (plus récentes)",
  "Date (Oldest)": "Date (plus anciennes)",
  "Total High→Low": "Total décroissant",
  "Total Low→High": "Total croissant",
  "Export CSV": "Exporter en CSV",
  "All Orders": "Toutes les commandes",
  "Payment": "Paiement",
  "Showing {start}–{end} of {total}": "Affichage de {start}–{end} sur {total}",
  "Add Main Category": "Ajouter une catégorie principale",
  "Add Subcategory": "Ajouter une sous-catégorie",
  "Add Product": "Ajouter un produit",
  "All Products": "Tous les produits",
  "Search products…": "Rechercher des produits…",
  "All Categories": "Toutes les catégories",
  "Sort by…": "Trier par…",
  "ID ↑": "ID ↑",
  "ID ↓": "ID ↓",
  "Name A→Z": "Nom A→Z",
  "Name Z→A": "Nom Z→A",
  "Price Low→High": "Prix croissant",
  "Price High→Low": "Prix décroissant",
  "Category": "Catégorie",
  "ID": "ID",
  "Name": "Nom",
  "Price": "Prix",
  "Stock": "Stock",
  "Search messages…": "Rechercher des messages…",
  "Contact Messages": "Messages de contact",
  "Message": "Message",
  "No messages yet": "Aucun message pour le moment",
  "Order Details": "Détails de la commande",
  "Save Status": "Enregistrer le statut",
  "Delete": "Supprimer",
  "Order Info": "Informations sur la commande",
  "Created At": "Créée le",
  "Full Name": "Nom complet",
  "Country": "Pays",
  "Totals": "Totaux",
  "Subtotal": "Sous-total",
  "No items": "Aucun article",
  "Product ID": "ID du produit",
  "Enter product ID": "Saisir l’ID du produit",
  "Product name": "Nom du produit",
  "Select Category": "Sélectionner une catégorie",
  "Main Categories": "Catégories principales",
  "Auto-selected from subcategory if left empty": "Sélectionnées automatiquement d’après la sous-catégorie si laissées vides",
  "Price (TND)": "Prix (TND)",
  "Original Price (optional)": "Prix d’origine (facultatif)",
  "Description": "Description",
  "Product description": "Description du produit",
  "Image URLs": "URL des images",
  "(one per line, up to 10)": "(une par ligne, 10 maximum)",
  "Rating (0-5)": "Note (0-5)",
  "Popular": "Populaire",
  "Recommended": "Recommandé",
  "In Stock": "En stock",
  "Cancel": "Annuler",
  "Save Product": "Enregistrer le produit",
  "Main Category Name": "Nom de la catégorie principale",
  "e.g., Subscriptions": "ex. : Abonnements",
  "Save": "Enregistrer",
  "Main Category": "Catégorie principale",
  "Subcategory Name": "Nom de la sous-catégorie",
  "e.g., Netflix": "ex. : Netflix",
  "Confirm": "Confirmer",
  "Are you sure?": "Êtes-vous sûr ?",
  "Edit Product": "Modifier le produit",
  "Logged out due to 10 minutes of inactivity": "Déconnexion automatique après 10 minutes d’inactivité",
  "Failed to load orders": "Impossible de charger les commandes",
  "Refreshed": "Actualisé",
  "Refresh failed": "Échec de l’actualisation",
  "Verifying…": "Vérification…",
  "Refreshing...": "Actualisation...",
  "Invalid admin key. Please try again.": "Clé d’administration invalide. Veuillez réessayer.",
  "Invalid JSON response": "Réponse JSON invalide",
  "Invalid JSON from server": "JSON invalide reçu du serveur",
  "Unauthorized": "Non autorisé",
  "bad key": "clé invalide",
  "Request failed ({status})": "Échec de la requête ({status})",
  "Failed to load categories": "Impossible de charger les catégories",
  "Category name is required": "Le nom de la catégorie est obligatoire",
  "Main category created": "Catégorie principale créée",
  "Failed to create category": "Impossible de créer la catégorie",
  "Subcategory name is required": "Le nom de la sous-catégorie est obligatoire",
  "Subcategory added": "Sous-catégorie ajoutée",
  "Failed to add": "Échec de l’ajout",
  "Subcategory updated": "Sous-catégorie mise à jour",
  "Failed to update": "Échec de la mise à jour",
  "Failed to save": "Échec de l’enregistrement",
  "Delete Subcategory": "Supprimer la sous-catégorie",
  "Delete \"{subcat}\"? This cannot be undone. Products using this category must be moved or deleted first.": "Supprimer « {subcat} » ? Cette action est irréversible. Les produits utilisant cette catégorie doivent d’abord être déplacés ou supprimés.",
  "Subcategory deleted": "Sous-catégorie supprimée",
  "Failed to load products": "Impossible de charger les produits",
  "No orders yet": "Aucune commande pour le moment",
  "No orders found": "Aucune commande trouvée",
  "{count} order(s)": "{count} commande(s)",
  "No categories found": "Aucune catégorie trouvée",
  "No products found": "Aucun produit trouvé",
  "{count} product(s)": "{count} produit(s)",
  "Product not found": "Produit introuvable",
  "Please fill all required fields": "Veuillez remplir tous les champs obligatoires",
  "Product updated": "Produit mis à jour",
  "Product created": "Produit créé",
  "Save failed": "Échec de l’enregistrement",
  "Delete Product": "Supprimer le produit",
  "Delete this product? This cannot be undone.": "Supprimer ce produit ? Cette action est irréversible.",
  "Product deleted": "Produit supprimé",
  "Delete failed": "Échec de la suppression",
  "CSV exported": "CSV exporté",
  "Delete Order": "Supprimer la commande",
  "Delete order {orderId}? This cannot be undone.": "Supprimer la commande {orderId} ? Cette action est irréversible.",
  "Order deleted": "Commande supprimée",
  "Status updated": "Statut mis à jour",
  "Update failed": "Échec de la mise à jour",
  "Delete Message": "Supprimer le message",
  "Delete this message?": "Supprimer ce message ?",
  "Message deleted": "Message supprimé",
  "Add Subcategory to {mainCategory}": "Ajouter une sous-catégorie à {mainCategory}",
  "Edit Subcategory": "Modifier la sous-catégorie",
  "Revenue (TND)": "Chiffre d’affaires (TND)",
  "Other": "Autre",
  "Yes": "Oui",
  "No": "Non",
  "From:": "De :",
  "Message:": "Message :",
  "Tunisia's digital store": "La boutique numérique de Tunisie",
  "Games, subscriptions and software.": "Jeux, abonnements et logiciels.",
  "Delivered in minutes.": "Livrés en quelques minutes.",
  "PC and console titles, streaming plans, courses and software — chosen for gamers, creators and students in Tunisia. Pay in TND and get your access digitally.": "Jeux PC et console, formules de streaming, formations et logiciels — sélectionnés pour les gamers, les créateurs et les étudiants de Tunisie. Payez en TND et recevez votre accès en numérique.",
  "Browse the catalog": "Parcourir le catalogue",
  "Explore games": "Explorer les jeux",
  "Instant digital delivery": "Livraison numérique instantanée",
  "Verified before delivery": "Vérifié avant livraison",
  "Local WhatsApp support": "Support local sur WhatsApp",
  "Featured products": "Produits en vedette",
  "Featured release": "Sortie en vedette",
  "Console": "Console",
  "PC": "PC",
  "Shop by category": "Acheter par catégorie",
  "View everything": "Tout voir",
  "Netflix, Spotify, Canva & more": "Netflix, Spotify, Canva et bien plus",
  "PC, console, mobile & gift cards": "PC, console, mobile et cartes cadeaux",
  "Programming, design & business": "Programmation, design et business",
  "Tools, licenses & mobile apps": "Outils, licences et applications mobiles",
  "Trending this month": "Tendances du mois",
  "Most popular": "Les plus populaires",
  "The products our customers keep coming back for": "Les produits que nos clients redemandent encore et encore",
  "Shop all": "Voir toute la boutique",
  "Selected offers": "Offres sélectionnées",
  "Featured deals": "Offres en vedette",
  "Hand-picked offers with clear savings": "Des offres triées sur le volet, avec des économies claires",
  "See game deals": "Voir les offres jeux",
  "The DIMA standard": "L’exigence DIMA",
  "Why buy from DIMA Deals": "Pourquoi acheter chez DIMA Deals",
  "We are not a faceless code shop. Every order is handled by a real team in Tunisia, with prices in dinars and support you can actually reach.": "Nous ne sommes pas une boutique de codes anonyme. Chaque commande est traitée par une vraie équipe en Tunisie, avec des prix en dinars et un support réellement joignable.",
  "More about us": "En savoir plus sur nous",
  "Digital codes and access sent as soon as your order is verified.": "Codes numériques et accès envoyés dès la validation de votre commande.",
  "Your details are handled carefully and payment is confirmed manually.": "Vos informations sont traitées avec soin et le paiement est confirmé manuellement.",
  "Message us on WhatsApp and talk to a real person in Tunisia.": "Écrivez-nous sur WhatsApp et parlez à une vraie personne en Tunisie.",
  "Working or refunded": "Fonctionnel ou remboursé",
  "If a product does not work as described, we make it right.": "Si un produit ne fonctionne pas comme annoncé, nous trouvons une solution.",
  "Not sure which plan or platform to pick?": "Vous hésitez entre plusieurs formules ou plateformes ?",
  "Tell us what you need and we will point you to the right product — no pressure.": "Dites-nous ce qu’il vous faut et nous vous orienterons vers le bon produit — sans aucune pression.",
  "Catalog": "Catalogue",
  "Every game, subscription, course and app in one place.": "Tous les jeux, abonnements, cours et applications au même endroit.",
  "Browse categories": "Parcourir les catégories",
  "Prices in TND · Digital delivery": "Prix en TND · Livraison numérique",
  "PC gaming platforms": "Plateformes de jeux PC",
  "Choose the storefront you already use.": "Choisissez la plateforme que vous utilisez déjà.",
  "Breadcrumb": "Fil d’Ariane",
  "Product Image": "Image du produit",
  "Loading product details…": "Chargement des détails du produit…",
  "Keep browsing": "Continuez votre visite",
  "Related products": "Produits similaires",
  "More from the same part of the store": "D’autres produits du même rayon",
  "Browse all": "Tout parcourir",
  "Your order": "Votre commande",
  "Review your products before checkout. Digital delivery is arranged after payment is confirmed.": "Vérifiez vos produits avant le paiement. La livraison numérique est organisée dès la confirmation du paiement.",
  "Continue shopping": "Continuer mes achats",
  "Your cart is empty": "Votre panier est vide",
  "Start shopping to add items to your cart!": "Commencez vos achats pour ajouter des articles à votre panier !",
  "Continue Shopping": "Continuer mes achats",
  "Order Summary": "Récapitulatif de la commande",
  "Subtotal:": "Sous-total :",
  "Tax (0%):": "TVA (0 %) :",
  "Total:": "Total :",
  "Proceed to Checkout": "Passer au paiement",
  "Complete your order": "Finalisez votre commande",
  "Enter your details and we will contact you to confirm payment and delivery.": "Saisissez vos informations et nous vous contacterons pour confirmer le paiement et la livraison.",
  "Checkout progress": "Étapes du paiement",
  "Cart": "Panier",
  "Checkout": "Paiement",
  "Confirmation": "Confirmation",
  "Billing Information": "Informations de facturation",
  "Phone Number *": "Numéro de téléphone *",
  "Enter your 8-digit Tunisian phone number": "Saisissez votre numéro de téléphone tunisien à 8 chiffres",
  "Full Name *": "Nom complet *",
  "Your Full Name": "Votre nom complet",
  "Country *": "Pays *",
  "Select Country": "Sélectionner un pays",
  "Algeria": "Algérie",
  "Morocco": "Maroc",
  "Libya": "Libye",
  "Sudan": "Soudan",
  "Egypt": "Égypte",
  "I agree to the": "J’accepte les",
  "and": "et",
  "Instant delivery after payment": "Livraison instantanée après paiement",
  "24/7 support via WhatsApp": "Assistance 24h/24 et 7j/7 sur WhatsApp",
  "Trusted by 100+ customers": "La confiance de plus de 100 clients",
  "100% working or money back": "100 % fonctionnel ou remboursé",
  "Place Order": "Valider la commande",
  "Your information is safe. Payment will be arranged manually — no card needed.": "Vos informations sont protégées. Le paiement sera organisé manuellement — aucune carte bancaire nécessaire.",
  "Back to Cart": "Retour au panier",
  "Order Confirmed!": "Commande confirmée !",
  "Thank you for your order. Your order has been received successfully.": "Merci pour votre commande. Votre commande a bien été reçue.",
  "Payment will be handled manually.": "Le paiement sera traité manuellement.",
  "We will contact you shortly via phone or WhatsApp to arrange payment and deliver your order.": "Nous vous contacterons rapidement par téléphone ou sur WhatsApp pour convenir du paiement et livrer votre commande.",
  "Order Items": "Articles commandés",
  "What's Next?": "Prochaines étapes ?",
  "You will be contacted shortly to confirm your order and arrange payment": "Vous serez contacté rapidement pour confirmer votre commande et organiser le paiement",
  "A confirmation will be sent to your email address": "Une confirmation sera envoyée à votre adresse e-mail",
  "Once payment is confirmed, you'll receive your product instantly": "Dès que le paiement est confirmé, vous recevez votre produit instantanément",
  "Need help? Our support team is available 24/7 via WhatsApp": "Besoin d’aide ? Notre équipe d’assistance est disponible 24h/24 et 7j/7 sur WhatsApp",
  "Return to Home": "Retour à l’accueil",
  "Need help? Contact us via": "Besoin d’aide ? Contactez-nous via",
  "or email": "ou par e-mail",
  "Find a product": "Trouver un produit",
  "Search results": "Résultats de recherche",
  "Sort By": "Trier par",
  "Relevance": "Pertinence",
  "Price: Low to High": "Prix : croissant",
  "Price: High to Low": "Prix : décroissant",
  "Highest Rated": "Les mieux notés",
  "Most Popular": "Les plus populaires",
  "DIMA Deals — Games, subscriptions and software in Tunisia": "DIMA Deals — Jeux, abonnements et logiciels en Tunisie",
  "Browse - DIMA Deals": "Parcourir - DIMA Deals",
  "Product Details - DIMA Deals": "Détails du produit - DIMA Deals",
  "Shopping Cart - DIMA Deals": "Panier - DIMA Deals",
  "Checkout - DIMA Deals": "Paiement - DIMA Deals",
  "Order Confirmation - DIMA Deals": "Confirmation de commande - DIMA Deals",
  "Search Results - DIMA Deals": "Résultats de recherche - DIMA Deals",
  "DIMA Deals is Tunisia's digital store for PC and console games, streaming subscriptions, courses and software. Instant digital delivery, clear prices in TND and local support.": "DIMA Deals est la boutique numérique de Tunisie pour les jeux PC et console, les abonnements de streaming, les formations et les logiciels. Livraison numérique instantanée, prix clairs en TND et support local.",
  "Buy Netflix, Spotify, and digital subscriptions in Tunisia with instant delivery and secure payment.": "Achetez Netflix, Spotify et des abonnements numériques en Tunisie avec livraison instantanée et paiement sécurisé.",
  "Home": "Accueil",
  "In stock": "En stock",
  "Out of stock": "Rupture de stock",
  "Add to cart": "Ajouter au panier",
  "Save {percent}%": "Économisez {percent} %",
  "No image available": "Aucune image disponible",
  "View {name}": "Voir {name}",
  "Rated {rating} out of 5": "Noté {rating} sur 5",
  "Show {count} more": "Afficher {count} de plus",
  "{count} left": "{count} restants",
  "All products loaded": "Tous les produits sont chargés",
  "{count} product available": "{count} produit disponible",
  "{count} products available": "{count} produits disponibles",
  "No products here yet": "Aucun produit ici pour le moment",
  "This category is empty right now. Browse the full catalog for other deals.": "Cette catégorie est vide pour le moment. Parcourez le catalogue complet pour découvrir d’autres offres.",
  "Browse all products": "Parcourir tous les produits",
  "Try a different search term or clear the category filter.": "Essayez un autre terme de recherche ou retirez le filtre de catégorie.",
  "Something went wrong": "Une erreur est survenue",
  "Could not load products. Please refresh the page.": "Impossible de charger les produits. Veuillez actualiser la page.",
  "Refresh page": "Actualiser la page",
  "No products available": "Aucun produit disponible",
  "Check back later for new arrivals.": "Revenez plus tard pour découvrir les nouveautés.",
  "Failed to load products. Please refresh the page.": "Impossible de charger les produits. Veuillez actualiser la page.",
  "Failed to load products. Please check your connection and refresh.": "Impossible de charger les produits. Vérifiez votre connexion et actualisez la page.",
  "Something went wrong. Please try again.": "Une erreur est survenue. Veuillez réessayer.",
  "Searching for: \"{query}\"": "Recherche : « {query} »",
  "{count} result(s) found": "{count} résultat(s) trouvé(s)",
  "Search: {query} — DIMA Deals": "Recherche : {query} — DIMA Deals",
  "This product may have been removed or the link is no longer valid.": "Ce produit a peut-être été supprimé ou le lien n’est plus valide.",
  "No product image available": "Aucune image de produit disponible",
  "Instant digital delivery after verification": "Livraison numérique instantanée après vérification",
  "Working product or money back": "Produit fonctionnel ou remboursé",
  "Support on WhatsApp": "Assistance sur WhatsApp",
  "Clear price in Tunisian dinars": "Prix clair en dinars tunisiens",
  "Add to cart — {price} TND": "Ajouter au panier — {price} TND",
  "Shopping cart, {count} item(s)": "Panier, {count} article(s)",
  "Decrease quantity": "Diminuer la quantité",
  "Increase quantity": "Augmenter la quantité",
  "Remove {name}": "Retirer {name}",
  "Your cart is empty!": "Votre panier est vide !",
  "Could not save your cart. Storage may be full.": "Impossible d’enregistrer votre panier. Le stockage est peut-être plein.",
  "{name} added to cart!": "{name} a été ajouté au panier !",
  "Product not found. Please refresh and try again.": "Produit introuvable. Veuillez actualiser la page et réessayer.",
  "Please enter a valid email address": "Veuillez saisir une adresse e-mail valide",
  "Phone must be 8 digits": "Le numéro de téléphone doit comporter 8 chiffres",
  "Full name must be at least 3 characters": "Le nom complet doit contenir au moins 3 caractères",
  "Please select your country": "Veuillez sélectionner votre pays",
  "Please accept the Terms of Service and Privacy Policy": "Veuillez accepter les Conditions d’utilisation et la Politique de confidentialité",
  "Some items in your cart are no longer available. Please clear your cart and re-add them.": "Certains articles de votre panier ne sont plus disponibles. Veuillez vider votre panier et les ajouter à nouveau.",
  "Placing Order...": "Envoi de la commande…",
  "The server returned an unexpected response. Please try again.": "Le serveur a renvoyé une réponse inattendue. Veuillez réessayer.",
  "Checkout failed": "Le paiement a échoué",
  "Error: {message}": "Erreur : {message}",
  "Order not found": "Commande introuvable",
  "We could not find this order. If you just placed it, please contact support.": "Nous n’avons pas trouvé cette commande. Si vous venez de la passer, contactez l’assistance.",
  "Order ID:": "N° de commande :",
  "Name:": "Nom :",
  "Phone:": "Téléphone :",
  "Date:": "Date :",
  "No items in this order.": "Aucun article dans cette commande.",
  "Back to Home": "Retour à l’accueil",
  "Browse products": "Parcourir les produits",
  "Discover digital products from DIMA Deals.": "Découvrez les produits numériques de DIMA Deals.",
  "Discover amazing digital products": "Découvrez des produits numériques exceptionnels",
  "Premium Subscriptions": "Abonnements premium",
  "Netflix, Spotify, Canva, Shahid and more — delivered instantly": "Netflix, Spotify, Canva, Shahid et plus — livrés instantanément",
  "Games & Digital Content": "Jeux et contenu numérique",
  "PC, console, mobile games and gift cards at the best prices": "Jeux PC, console, mobile et cartes cadeaux aux meilleurs prix",
  "Online Courses": "Formations en ligne",
  "Learn programming, design and business from top platforms": "Apprenez la programmation, le design et le business sur les meilleures plateformes",
  "Apps & Software": "Applications et logiciels",
  "Premium apps and software licenses for work and creativity": "Applications premium et licences logicielles pour le travail et la création",
  "Netflix Subscriptions": "Abonnements Netflix",
  "Choose the perfect Netflix plan for your entertainment needs": "Choisissez l’offre Netflix adaptée à vos besoins de divertissement",
  "Spotify Subscriptions": "Abonnements Spotify",
  "Stream unlimited music and podcasts with Spotify Premium": "Écoutez de la musique et des podcasts en illimité avec Spotify Premium",
  "Canva Subscriptions": "Abonnements Canva",
  "Enjoy templates, AI tools, and design benefits with Canva Pro": "Profitez de modèles, d’outils IA et d’avantages de design avec Canva Pro",
  "Shahid Subscriptions": "Abonnements Shahid",
  "Watch exclusive Arab shows and movies on Shahid Plus": "Regardez des séries et films arabes exclusifs sur Shahid Plus",
  "CapCut Subscriptions": "Abonnements CapCut",
  "Professional video editing with CapCut Pro": "Montage vidéo professionnel avec CapCut Pro",
  "PC Games": "Jeux PC",
  "Choose from the best PC games and digital content": "Choisissez parmi les meilleurs jeux PC et contenus numériques",
  "Console Games": "Jeux console",
  "Browse console games for PlayStation and Xbox": "Parcourez les jeux console pour PlayStation et Xbox",
  "Mobile Games": "Jeux mobiles",
  "Download premium mobile games": "Téléchargez des jeux mobiles premium",
  "Steam Gift Cards": "Cartes cadeaux Steam",
  "Enjoy premium games on Steam": "Profitez de jeux premium sur Steam",
  "Epic Games Store": "Epic Games Store",
  "Digital gift cards for Epic Games Store and free games": "Cartes cadeaux numériques pour Epic Games Store et jeux gratuits",
  "EA Play": "EA Play",
  "Access EA's extensive library of games with EA Play subscription": "Accédez à la vaste bibliothèque de jeux EA avec l’abonnement EA Play",
  "Xbox Game Pass PC": "Xbox Game Pass PC",
  "Access hundreds of games on PC with Xbox Game Pass": "Accédez à des centaines de jeux sur PC avec Xbox Game Pass",
  "Programming Courses": "Formations en programmation",
  "Learn programming and development skills": "Apprenez la programmation et le développement",
  "Design Courses": "Formations en design",
  "Master design tools and creativity": "Maîtrisez les outils de design et la créativité",
  "Business Courses": "Formations en business",
  "Develop your business and leadership skills": "Développez vos compétences en business et en leadership",
  "Mobile Apps": "Applications mobiles",
  "Premium apps and gift cards for your phone": "Applications premium et cartes cadeaux pour votre téléphone",
  "Premium software solutions for your computer": "Solutions logicielles premium pour votre ordinateur",
  "Steam": "Steam",
  "Epic Games": "Epic Games",
  "Xbox Game Pass": "Xbox Game Pass",
  "Ticket": "Ticket"
},
    ar: {
  "DIMA Deals home": "الصفحة الرئيسية DIMA Deals",
  "Main navigation": "التنقل الرئيسي",
  "Subscriptions": "الاشتراكات",
  "All subscriptions": "كل الاشتراكات",
  "Games": "الألعاب",
  "All games": "كل الألعاب",
  "PC games": "ألعاب الكمبيوتر",
  "Console games": "ألعاب الكونسول",
  "Mobile games": "ألعاب الهاتف المحمول",
  "Courses": "الدورات",
  "All courses": "كل الدورات",
  "Programming": "البرمجة",
  "Design": "التصميم",
  "Business": "الأعمال",
  "Apps": "التطبيقات",
  "All apps": "كل التطبيقات",
  "Mobile apps": "تطبيقات الهاتف المحمول",
  "Software": "البرامج",
  "All products": "جميع المنتجات",
  "Search products": "ابحث عن منتجات",
  "Search": "بحث",
  "Shopping cart": "سلة التسوق",
  "Language": "اللغة",
  "Toggle dark mode": "تبديل الوضع الداكن",
  "Toggle menu": "تبديل القائمة",
  "Digital games, subscriptions and software for Tunisia, with clear prices and real local support.": "ألعاب واشتراكات وبرامج رقمية في تونس، بأسعار واضحة ودعم محلي حقيقي.",
  "Shop": "المتجر",
  "Apps & software": "التطبيقات والبرامج",
  "Support": "الدعم",
  "FAQ": "الأسئلة الشائعة",
  "Help center": "مركز المساعدة",
  "Contact": "اتصل بنا",
  "Terms of service": "شروط الخدمة",
  "Privacy policy": "سياسة الخصوصية",
  "Tunisia": "تونس",
  "© 2026 DIMA Deals. All rights reserved.": "© 2026 DIMA Deals. جميع الحقوق محفوظة.",
  "Instant delivery": "تسليم فوري",
  "Secure checkout": "دفع آمن",
  "Local support": "دعم محلي",
  "Chat on WhatsApp": "الدردشة عبر WhatsApp",
  "Chat with us": "تحدث معنا",
  "About Us - DIMA Deals": "من نحن - DIMA Deals",
  "About DIMA Deals - Your trusted digital subscription provider in Tunisia.": "عن DIMA Deals - مزوّدك الموثوق للاشتراكات الرقمية في تونس.",
  "About DIMA Deals": "عن DIMA Deals",
  "Your trusted source for premium digital subscriptions at unbeatable prices": "مصدرك الموثوق للاشتراكات الرقمية المميزة بأسعار لا تُنافس",
  "Who We Are": "من نحن",
  "DIMA Deals is your premier destination for affordable digital subscriptions in Tunisia. We believe that quality digital services should be accessible to everyone, which is why we've made it our mission to offer premium subscriptions at prices that don't break the bank.": "DIMA Deals هي وجهتك الأولى للاشتراكات الرقمية بأسعار معقولة في تونس. نؤمن بأن الخدمات الرقمية عالية الجودة يجب أن تكون في متناول الجميع، ولهذا جعلنا من مهمتنا تقديم اشتراكات مميزة بأسعار لا تُرهق ميزانيتك.",
  "With over 1000+ happy customers, we've become the most trusted digital subscription provider in Tunisia, known for our reliability, fast delivery, and exceptional customer service.": "بفضل أكثر من 1000 عميل سعيد، أصبحنا مزوّد الاشتراكات الرقمية الأكثر ثقة في تونس، معروفين بموثوقيتنا وسرعة التسليم وجودة خدمة العملاء.",
  "What We Sell": "ما نقدّمه",
  "We provide instant access to premium digital services including:": "نوفّر وصولاً فورياً إلى خدمات رقمية مميزة، من بينها:",
  "Streaming Services (Netflix, Spotify, Shahid)": "خدمات البث (Netflix وSpotify وShahid)",
  "Design Tools (Canva Pro, Adobe Creative Suite)": "أدوات التصميم (Canva Pro وAdobe Creative Suite)",
  "Online Courses (Programming, Design, Business)": "دورات عبر الإنترنت (البرمجة والتصميم وإدارة الأعمال)",
  "Games (PC, Console, Mobile)": "ألعاب (كمبيوتر، كونسول، جوال)",
  "Software & Apps": "البرامج والتطبيقات",
  "Our Mission": "مهمتنا",
  "Make premium digital products affordable and instantly accessible to Tunisians.": "جعل المنتجات الرقمية المميزة في متناول التونسيين ومتاحة لهم فوراً.",
  "We're committed to:": "نلتزم بما يلي:",
  "Offering the lowest prices in Tunisia": "تقديم أدنى الأسعار في تونس",
  "Delivering subscriptions instantly (within minutes)": "تسليم الاشتراكات فوراً (خلال دقائق)",
  "Providing 24/7 customer support": "توفير دعم للعملاء على مدار الساعة",
  "Ensuring 100% safe and secure transactions": "ضمان معاملات آمنة بنسبة 100%",
  "Why Choose DIMA Deals?": "لماذا تختار DIMA Deals؟",
  "Instant Delivery:": "تسليم فوري:",
  "Get access within minutes of purchase": "احصل على الوصول خلال دقائق من الشراء",
  "Lowest Prices:": "أدنى الأسعار:",
  "We guarantee the best rates in Tunisia": "نضمن أفضل الأسعار في تونس",
  "100% Safe:": "آمن 100%:",
  "Secure payment processing & encrypted data": "معالجة دفع آمنة وبيانات مشفّرة",
  "Customer Support:": "دعم العملاء:",
  "Friendly team ready to help": "فريق ودود جاهز لمساعدتك",
  "Trusted:": "موثوق:",
  "1000+ satisfied customers": "أكثر من 1000 عميل راضٍ",
  "How It Works": "كيف يعمل",
  "Browse": "تصفّح",
  "Explore our catalog of premium digital subscriptions and products": "استكشف كتالوج الاشتراكات والمنتجات الرقمية المميزة",
  "Purchase": "الشراء",
  "Add items to cart and securely complete checkout": "أضف المنتجات إلى السلة وأتمم عملية الدفع بأمان",
  "Deliver": "التسليم",
  "Receive your access credentials instantly via email": "استلم بيانات الوصول الخاصة بك فوراً عبر البريد الإلكتروني",
  "Enjoy": "الاستمتاع",
  "Start using your subscription immediately!": "ابدأ باستخدام اشتراكك فوراً!",
  "Contact Us - DIMA Deals": "اتصل بنا - DIMA Deals",
  "Contact DIMA Deals - Get in touch with our customer support team.": "اتصل بـ DIMA Deals - تواصل مع فريق دعم العملاء لدينا.",
  "Contact Us": "اتصل بنا",
  "Have a question? We'd love to hear from you. Get in touch with our team anytime!": "هل لديك سؤال؟ يسعدنا أن نسمع منك. تواصل مع فريقنا في أي وقت!",
  "Message sent successfully! We'll respond soon.": "تم إرسال الرسالة بنجاح! سنرد عليك قريباً.",
  "Please fill in all fields": "يرجى ملء جميع الحقول",
  "Sending...": "جارٍ الإرسال…",
  "Failed to send message": "تعذّر إرسال الرسالة",
  "Error sending message. Please try again.": "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
  "Your Name *": "اسمك *",
  "John Doe": "محمد علي",
  "Email Address *": "البريد الإلكتروني *",
  "your@email.com": "بريدك@email.com",
  "Your Message *": "رسالتك *",
  "Tell us how we can help...": "أخبرنا كيف يمكننا مساعدتك…",
  "Send Message": "إرسال الرسالة",
  "Email": "البريد الإلكتروني",
  "Phone": "الهاتف",
  "Location": "الموقع",
  "FAQ - DIMA Deals": "الأسئلة الشائعة - DIMA Deals",
  "Frequently asked questions about DIMA Deals.": "الأسئلة الشائعة حول DIMA Deals.",
  "Frequently Asked Questions": "الأسئلة الشائعة",
  "Find answers to common questions about DIMA Deals": "اعثر على إجابات للأسئلة الشائعة حول DIMA Deals",
  "How does instant delivery work?": "كيف يعمل التسليم الفوري؟",
  "Once you complete your purchase and payment is verified, we immediately send you your access credentials via email. You can typically start using your subscription within 5-10 minutes of purchase. No waiting periods, no delays!": "بمجرد إتمام عملية الشراء والتحقق من الدفع، نرسل لك بيانات الوصول مباشرة عبر البريد الإلكتروني. ويمكنك عادةً البدء باستخدام اشتراكك خلال 5 إلى 10 دقائق من الشراء. لا انتظار ولا تأخير!",
  "What payment methods do you accept?": "ما طرق الدفع التي تقبلونها؟",
  "We accept manual payments through:": "نقبل الدفع اليدوي من خلال:",
  "Bank transfer": "التحويل البنكي",
  "Orange Money (Tunisian mobile money)": "Orange Money (الدفع عبر الهاتف المحمول في تونس)",
  "Attijari Bank payments": "مدفوعات Attijari Bank",
  "WhatsApp direct contact for special arrangements": "التواصل المباشر عبر WhatsApp لترتيبات خاصة",
  "Our team will guide you through the payment process when you checkout.": "سيقوم فريقنا بإرشادك خلال عملية الدفع عند إتمام الطلب.",
  "What is your refund policy?": "ما سياسة استرداد المبلغ لديكم؟",
  "30-Day Money Back Guarantee:": "ضمان استرداد المبلغ خلال 30 يوماً:",
  "If you're not satisfied with your purchase for any reason, you can request a full refund within 30 days. We want you to be completely happy with DIMA Deals.": "إذا لم تكن راضياً عن عملية الشراء لأي سبب، فيمكنك طلب استرداد كامل خلال 30 يوماً. نريدك أن تكون راضياً تماماً عن DIMA Deals.",
  "Instant Access Refunds:": "استرداد المبلغ مع الوصول الفوري:",
  "Since our products are delivered instantly, refunds are only available if the product doesn't work as advertised or you have technical issues we can't resolve.": "لأن منتجاتنا تُسلَّم فوراً، فإن استرداد المبلغ متاح فقط إذا لم يعمل المنتج كما هو معلن أو إذا واجهت مشكلة تقنية لا نستطيع حلها.",
  "Is my account safe with DIMA Deals?": "هل حسابي آمن مع DIMA Deals؟",
  "Yes! We take security very seriously:": "نعم! نأخذ الأمان على محمل الجد:",
  "All transactions are encrypted and secure": "جميع المعاملات مشفّرة وآمنة",
  "Your personal data is never shared with third parties": "لا تتم مشاركة بياناتك الشخصية مع أي طرف ثالث أبداً",
  "We use industry-standard security protocols": "نستخدم بروتوكولات أمان معتمدة في القطاع",
  "Your email and phone are only used for order confirmations and support": "يُستخدم بريدك الإلكتروني ورقم هاتفك فقط لتأكيد الطلبات والدعم",
  "We comply with international data protection standards": "نلتزم بمعايير حماية البيانات الدولية",
  "Can I use the same product on multiple accounts?": "هل يمكنني استخدام المنتج نفسه على عدة حسابات؟",
  "This depends on the specific product. Most subscriptions allow 1-4 simultaneous streams or logins. Please check the product description for specific details about account sharing limits.": "يعتمد ذلك على المنتج المعني. تسمح معظم الاشتراكات بـ 1 إلى 4 عمليات بث أو تسجيل دخول متزامنة. يُرجى مراجعة وصف المنتج لمعرفة حدود مشاركة الحساب.",
  "Note:": "ملاحظة:",
  "Some services may detect and block simultaneous logins from different geographic locations.": "قد تكتشف بعض الخدمات عمليات تسجيل الدخول المتزامنة من مواقع جغرافية مختلفة وتحظرها.",
  "What if I don't receive my credentials?": "ماذا لو لم أستلم بيانات الوصول؟",
  "If you don't receive your access credentials within 15 minutes:": "إذا لم تستلم بيانات الوصول خلال 15 دقيقة:",
  "Check your spam/junk email folder": "تحقق من مجلد البريد العشوائي (spam)",
  "Contact us immediately via WhatsApp or email": "تواصل معنا فوراً عبر WhatsApp أو البريد الإلكتروني",
  "We'll resend your credentials right away": "سنعيد إرسال بيانات الوصول فوراً",
  "If there's an issue, we'll offer a full refund": "وإذا حدثت مشكلة، فسنعرض عليك استرداد المبلغ كاملاً",
  "Our support team is available 24/7 to assist you.": "فريق الدعم لدينا متاح على مدار الساعة لمساعدتك.",
  "Are you officially affiliated with these services?": "هل أنتم مرتبطون رسمياً بهذه الخدمات؟",
  "DIMA Deals is an authorized reseller of digital products and subscriptions. All products we sell are legitimate and official. We work directly with service providers to ensure the best rates and instant delivery for our customers.": "DIMA Deals هي موزّع معتمد للمنتجات والاشتراكات الرقمية. جميع المنتجات التي نبيعها أصلية ورسمية. نعمل مباشرة مع مزوّدي الخدمات لضمان أفضل الأسعار والتسليم الفوري لعملائنا.",
  "Do you offer bulk/discounts for multiple purchases?": "هل تقدّمون أسعاراً بالجملة أو خصومات على عمليات الشراء المتعددة؟",
  "Yes! We offer special pricing for bulk orders. Contact our team via WhatsApp or email with your requirements, and we'll provide you with a customized quote.": "نعم! نقدّم أسعاراً خاصة للطلبات بالجملة. تواصل مع فريقنا عبر WhatsApp أو البريد الإلكتروني مع توضيح احتياجاتك، وسنقدّم لك عرض سعر مخصّصاً.",
  "For businesses, schools, or organizations looking to purchase in bulk, we can arrange special rates.": "أما الشركات والمدارس والمؤسسات التي ترغب في الشراء بالجملة، فيمكننا ترتيب أسعار خاصة لها.",
  "Help Center - DIMA Deals": "مركز المساعدة - DIMA Deals",
  "Help Center and guides for DIMA Deals.": "مركز المساعدة والأدلة الخاصة بـ DIMA Deals.",
  "Help Center": "مركز المساعدة",
  "Learn how to get the most out of DIMA Deals": "تعرّف على كيفية الاستفادة القصوى من DIMA Deals",
  "How to Order": "كيفية الطلب",
  "Get started with your first purchase in just a few clicks": "ابدأ عملية الشراء الأولى في بضع نقرات",
  "Browse our catalog": "تصفّح كتالوجنا",
  "Add items to cart": "أضف المنتجات إلى السلة",
  "Receiving Your Product": "استلام منتجك",
  "We'll send everything you need via email": "سنرسل لك كل ما تحتاجه عبر البريد الإلكتروني",
  "Check your email": "تحقق من بريدك الإلكتروني",
  "Look in spam folder": "ابحث في مجلد البريد العشوائي",
  "Save credentials": "احفظ بيانات الوصول",
  "Start using now": "ابدأ الاستخدام الآن",
  "Troubleshooting": "استكشاف الأخطاء وإصلاحها",
  "Having issues? We're here to help": "هل تواجه مشكلة؟ نحن هنا لمساعدتك",
  "Verify your email": "تحقق من بريدك الإلكتروني",
  "Check credentials": "تحقق من بيانات الوصول",
  "Contact support": "تواصل مع الدعم",
  "Fast resolution": "حل سريع",
  "Step-by-Step: How to Order": "خطوة بخطوة: كيفية الطلب",
  "Create Account:": "إنشاء حساب:",
  "Sign up or log in to your DIMA Deals account": "سجّل أو ادخل إلى حسابك في DIMA Deals",
  "Browse Products:": "تصفّح المنتجات:",
  "Explore our catalog of digital products and subscriptions": "استكشف كتالوج المنتجات والاشتراكات الرقمية",
  "Select Product:": "اختر المنتج:",
  "Click on the product you want and view details": "اضغط على المنتج الذي تريده واطّلع على تفاصيله",
  "Add to Cart:": "أضف إلى السلة:",
  "Click the \"Get Access Now\" button to add to your cart": "اضغط على زر «احصل على الوصول الآن» لإضافته إلى سلتك",
  "Checkout:": "إتمام الطلب:",
  "Review your cart and proceed to checkout": "راجع سلتك ثم انتقل إلى إتمام الطلب",
  "Payment:": "الدفع:",
  "Make payment using our secure payment method": "أتمم الدفع باستخدام طريقة الدفع الآمنة لدينا",
  "Receive Credentials:": "استلم بيانات الوصول:",
  "Check your email for instant access details": "تحقق من بريدك الإلكتروني للحصول على تفاصيل الوصول الفوري",
  "Start Using:": "بدء الاستخدام:",
  "Use your credentials to access the service immediately": "استخدم بيانات الوصول للدخول إلى الخدمة فوراً",
  "Where to Find Your Product": "أين تجد منتجك",
  "Check Your Email:": "تحقق من بريدك الإلكتروني:",
  "Within 5-10 minutes of purchase, you'll receive an email with your access details": "خلال 5 إلى 10 دقائق من الشراء، ستستلم رسالة بريد إلكتروني تحتوي على تفاصيل الوصول",
  "Check Spam Folder:": "تحقق من مجلد البريد العشوائي:",
  "Sometimes emails wind up in spam - check there if you don't see it in your inbox": "قد تصل الرسائل أحياناً إلى مجلد البريد العشوائي — تحقق منه إذا لم تجدها في صندوق الوارد",
  "Contact Us:": "اتصل بنا:",
  "If you don't receive your order, reach out to us on WhatsApp or email and we'llresend immediately": "إذا لم تستلم طلبك، تواصل معنا عبر WhatsApp أو البريد الإلكتروني وسنعيد إرساله فوراً",
  "Save Your Credentials:": "احفظ بيانات الوصول:",
  "Save your username and password securely for future access": "احفظ اسم المستخدم وكلمة المرور في مكان آمن للاستخدام لاحقاً",
  "Common Issues & Solutions": "المشكلات الشائعة والحلول",
  "Didn't receive email?": "لم تستلم البريد الإلكتروني؟",
  "Wait 15 minutes, check spam folder, then contact us": "انتظر 15 دقيقة، ثم تحقق من مجلد البريد العشوائي، ثم تواصل معنا",
  "Credentials don't work?": "بيانات الوصول لا تعمل؟",
  "Copy-paste carefully, try different browser, contact support": "انسخ والصق بعناية، جرّب متصفحاً آخر، وتواصل مع الدعم",
  "Account locked?": "الحساب مقفل؟",
  "Too many failed attempts - wait 30 minutes or contact us": "محاولات فاشلة كثيرة — انتظر 30 دقيقة أو تواصل معنا",
  "Need a refund?": "هل تحتاج إلى استرداد المبلغ؟",
  "Contact us within 30 days for a full refund": "تواصل معنا خلال 30 يوماً للحصول على استرداد كامل",
  "Want to cancel?": "هل تريد الإلغاء؟",
  "No hidden fees - manage your subscription directly with the provider": "لا رسوم خفية — أدر اشتراكك مباشرة مع مزوّد الخدمة",
  "Still Need Help?": "ما زلت بحاجة إلى مساعدة؟",
  "Our friendly support team is available 24/7 to assist you:": "فريق الدعم الودود لدينا متاح على مدار الساعة لمساعدتك:",
  "Email:": "البريد الإلكتروني:",
  "WhatsApp:": "WhatsApp:",
  "Response Time:": "وقت الاستجابة:",
  "We typically respond within 2 hours": "نرد عادةً خلال ساعتين",
  "Privacy Policy - DIMA Deals": "سياسة الخصوصية - DIMA Deals",
  "Privacy Policy for DIMA Deals. Learn how we handle your data.": "سياسة الخصوصية الخاصة بـ DIMA Deals. تعرّف على كيفية تعاملنا مع بياناتك.",
  "Privacy Policy": "سياسة الخصوصية",
  "Your privacy is important to us. Learn how we handle your information.": "خصوصيتك مهمة بالنسبة لنا. تعرّف على كيفية تعاملنا مع معلوماتك.",
  "1. What Information We Collect": "1. المعلومات التي نجمعها",
  "When you use DIMA Deals, we collect:": "عند استخدامك DIMA Deals، نجمع:",
  "Email Address:": "البريد الإلكتروني:",
  "Used for account creation and order confirmations": "يُستخدم لإنشاء الحساب وتأكيد الطلبات",
  "Phone Number:": "رقم الهاتف:",
  "For WhatsApp messages and order support": "لرسائل WhatsApp ودعم الطلبات",
  "Payment Information:": "معلومات الدفع:",
  "Bank transfer details or payment method (processed securely)": "تفاصيل التحويل البنكي أو طريقة الدفع (تُعالج بأمان)",
  "Usage Data:": "بيانات الاستخدام:",
  "Pages visited, products viewed, searches performed": "الصفحات التي تمت زيارتها والمنتجات التي تم عرضها وعمليات البحث",
  "Device Information:": "معلومات الجهاز:",
  "Browser type, IP address, operating system": "نوع المتصفح وعنوان IP ونظام التشغيل",
  "Order History:": "سجل الطلبات:",
  "Products purchased and delivery status": "المنتجات المشتراة وحالة التسليم",
  "2. How We Use Your Information": "2. كيفية استخدامنا لمعلوماتك",
  "We use collected information to:": "نستخدم المعلومات التي نجمعها من أجل:",
  "Deliver your purchased subscriptions and products": "تسليم الاشتراكات والمنتجات التي اشتريتها",
  "Process payments and handle refunds": "معالجة المدفوعات والتعامل مع عمليات الاسترداد",
  "Provide customer support": "تقديم دعم العملاء",
  "Send order confirmations and updates": "إرسال تأكيدات الطلبات والتحديثات",
  "Personalize your experience": "تخصيص تجربتك",
  "Improve our services and prevent fraud": "تحسين خدماتنا ومكافحة الاحتيال",
  "Send promotional content (if you opt in)": "إرسال محتوى ترويجي (إذا وافقت على ذلك)",
  "3. Data Sharing & Third Parties": "3. مشاركة البيانات والأطراف الثالثة",
  "We Do NOT Share Your Data": "نحن لا نشارك بياناتك",
  "We do not sell, share, or disclose your personal information to third parties for marketing or any other purpose without your explicit consent.": "نحن لا نبيع معلوماتك الشخصية ولا نشاركها ولا نفصح عنها لأطراف ثالثة لأغراض تسويقية أو لأي غرض آخر دون موافقتك الصريحة.",
  "The only exceptions:": "الاستثناءات الوحيدة:",
  "Third-party payment processors (encrypted and secure)": "مزوّدو خدمات الدفع من الأطراف الثالثة (مشفّرون وآمنون)",
  "Essential service providers (hosting, analytics)": "مزوّدو الخدمات الأساسية (الاستضافة والتحليلات)",
  "Legal requirements (government orders, law enforcement)": "المتطلبات القانونية (الأوامر الحكومية وإنفاذ القانون)",
  "4. Data Security": "4. أمان البيانات",
  "We protect your information through:": "نحمي معلوماتك من خلال:",
  "Encryption:": "التشفير:",
  "All sensitive data encrypted in transit and at rest": "جميع البيانات الحساسة مشفّرة أثناء النقل وأثناء التخزين",
  "Secure Servers:": "خوادم آمنة:",
  "Enterprise-level hosting with security measures": "استضافة بمستوى المؤسسات مع تدابير أمنية",
  "Access Control:": "التحكم في الوصول:",
  "Only authorized personnel access data": "لا يصل إلى البيانات سوى الموظفين المصرّح لهم",
  "Regular Audits:": "عمليات تدقيق منتظمة:",
  "Security assessments and updates": "تقييمات أمنية وتحديثات",
  "SSL Certificate:": "شهادة SSL:",
  "HTTPS encryption for all website traffic": "تشفير HTTPS لكل حركة المرور على الموقع",
  "However, no method of transmission is 100% secure. We work to maintain appropriate security but cannot guarantee absolute security.": "ومع ذلك، لا توجد وسيلة نقل آمنة بنسبة 100%. نعمل على الحفاظ على مستوى أمان مناسب، لكننا لا نستطيع ضمان أمان مطلق.",
  "5. Cookies & Tracking": "5. ملفات تعريف الارتباط والتتبع",
  "What are Cookies?": "ما هي ملفات تعريف الارتباط؟",
  "Small text files stored on your device to remember your preferences.": "ملفات نصية صغيرة تُخزَّن على جهازك لتذكّر تفضيلاتك.",
  "How we use them:": "كيف نستخدمها:",
  "Remember your logged-in status": "تذكّر حالة تسجيل دخولك",
  "Store shopping cart contents": "تخزين محتويات سلة التسوق",
  "Track site usage (analytics)": "تتبع استخدام الموقع (التحليلات)",
  "Remember dark mode preference": "تذكّر تفضيل الوضع الداكن",
  "Provide personalized recommendations": "تقديم توصيات مخصّصة",
  "You can control cookies through your browser settings. Disabling cookies may affect your experience.": "يمكنك التحكم في ملفات تعريف الارتباط من إعدادات متصفحك. وقد يؤثر تعطيلها على تجربتك.",
  "6. Your Privacy Rights": "6. حقوقك المتعلقة بالخصوصية",
  "GDPR Compliance (EU Users)": "الامتثال للائحة العامة لحماية البيانات (مستخدمو الاتحاد الأوروبي)",
  "If you're in the EU, you have rights regarding your data:": "إذا كنت في الاتحاد الأوروبي، فلديك حقوق تتعلق ببياناتك:",
  "Right to Access:": "الحق في الوصول:",
  "Request a copy of your data": "طلب نسخة من بياناتك",
  "Right to Rectification:": "الحق في التصحيح:",
  "Correct inaccurate information": "تصحيح المعلومات غير الدقيقة",
  "Right to Erasure:": "الحق في المحو:",
  "Request deletion of your data": "طلب حذف بياناتك",
  "Right to Restriction:": "الحق في تقييد المعالجة:",
  "Limit processing of your data": "تقييد معالجة بياناتك",
  "Right to Portability:": "الحق في قابلية النقل:",
  "Download your data in portable format": "تنزيل بياناتك بصيغة قابلة للنقل",
  "Right to Object:": "الحق في الاعتراض:",
  "Opt out of marketing communications": "الانسحاب من الرسائل التسويقية",
  "To exercise these rights:": "لممارسة هذه الحقوق:",
  "with your request.": "مع طلبك.",
  "All Users": "جميع المستخدمين",
  "You can:": "يمكنك:",
  "Update your account information anytime": "تحديث معلومات حسابك في أي وقت",
  "Opt out of marketing emails (unsubscribe link in all emails)": "الانسحاب من رسائل البريد التسويقية (رابط إلغاء الاشتراك في جميع الرسائل)",
  "Request data deletion or correction": "طلب حذف بياناتك أو تصحيحها",
  "Contact us with privacy concerns": "التواصل معنا بشأن أي مخاوف تتعلق بالخصوصية",
  "7. Data Retention": "7. الاحتفاظ بالبيانات",
  "We keep your information:": "نحتفظ بمعلوماتك:",
  "Account Data:": "بيانات الحساب:",
  "As long as your account is active": "طالما أن حسابك نشط",
  "For at least 7 years (legal requirement)": "لمدة 7 سنوات على الأقل (متطلب قانوني)",
  "Email Lists:": "قوائم البريد الإلكتروني:",
  "Until you unsubscribe": "حتى إلغاء اشتراكك",
  "Cookies:": "ملفات تعريف الارتباط:",
  "Typically 1 year (configurable)": "عادةً سنة واحدة (قابلة للتعديل)",
  "Upon account deletion, we remove personal data within 30 days (except where legally required to keep).": "عند حذف الحساب، نحذف البيانات الشخصية خلال 30 يوماً (باستثناء ما يُلزمنا القانون بالاحتفاظ به).",
  "8. Children's Privacy": "8. خصوصية الأطفال",
  "DIMA Deals is not intended for children under 18. We do not knowingly collect information from minors. If we discover a child's data was collected, we'll delete it immediately.": "DIMA Deals غير موجّه للأطفال دون 18 عاماً، ولا نجمع معلومات عن القاصرين عن علم. وإذا اكتشفنا جمع بيانات طفل، فسنحذفها فوراً.",
  "9. International Data Transfer": "9. نقل البيانات دولياً",
  "Your data may be stored on servers outside Tunisia. By using DIMA Deals, you consent to data transfer. We ensure transfers comply with GDPR and other privacy laws.": "قد تُخزَّن بياناتك على خوادم خارج تونس. وباستخدامك DIMA Deals، فإنك توافق على نقل البيانات. ونحرص على أن تتوافق عمليات النقل مع اللائحة العامة لحماية البيانات وقوانين الخصوصية الأخرى.",
  "10. Updates to This Policy": "10. تحديثات هذه السياسة",
  "We may update this Privacy Policy occasionally. Changes become effective 30 days after posting. Your continued use means acceptance. We'll notify you of material changes via email.": "قد نحدّث سياسة الخصوصية هذه من حين لآخر. وتصبح التغييرات سارية بعد 30 يوماً من نشرها. ويُعد استمرارك في الاستخدام موافقة عليها. وسنُعلمك بالتغييرات الجوهرية عبر البريد الإلكتروني.",
  "11. Contact Us": "11. اتصل بنا",
  "Questions about privacy? We're here to help:": "هل لديك أسئلة حول الخصوصية؟ نحن هنا لمساعدتك:",
  "Address:": "العنوان:",
  "Data Protection Officer": "مسؤول حماية البيانات",
  "For GDPR or privacy concerns, contact our Data Protection team at": "لأي استفسار يتعلق باللائحة العامة لحماية البيانات أو الخصوصية، تواصل مع فريق حماية البيانات لدينا عبر",
  "Last updated:": "آخر تحديث:",
  "Terms of Service - DIMA Deals": "شروط الخدمة - DIMA Deals",
  "Terms of Service for DIMA Deals.": "شروط الخدمة الخاصة بـ DIMA Deals.",
  "Terms of Service": "شروط الخدمة",
  "Please read carefully before using DIMA Deals": "يرجى القراءة بعناية قبل استخدام DIMA Deals",
  "1. Service Usage": "1. استخدام الخدمة",
  "By using DIMA Deals, you agree to our Terms of Service. You must:": "باستخدامك DIMA Deals، فإنك توافق على شروط الخدمة لدينا. ويجب عليك:",
  "Be at least 18 years old (or have parental consent)": "أن تكون في الثامنة عشرة من العمر على الأقل (أو أن تحصل على موافقة الوالدين)",
  "Provide accurate information during registration": "تقديم معلومات دقيقة عند التسجيل",
  "Use the service only for personal use": "استخدام الخدمة للاستخدام الشخصي فقط",
  "Not resell or redistribute credentials": "عدم إعادة بيع بيانات الوصول أو توزيعها",
  "Comply with all applicable laws": "الامتثال لجميع القوانين المعمول بها",
  "Not attempt unauthorized access to our systems": "عدم محاولة الوصول غير المصرّح به إلى أنظمتنا",
  "2. Payments & Billing": "2. المدفوعات والفواتير",
  "Price & Payment Terms": "الأسعار وشروط الدفع",
  "All prices are in Tunisian Dinars (TND). Prices may change without notice but changes won't affect existing orders. Payment is required before access to products is granted.": "جميع الأسعار بالدينار التونسي (TND). وقد تتغير الأسعار دون إشعار مسبق، لكن هذه التغييرات لا تؤثر على الطلبات القائمة. ويُشترط الدفع قبل منح الوصول إلى المنتجات.",
  "Payment Methods": "طرق الدفع",
  "Direct WhatsApp payment arrangements": "ترتيبات دفع مباشرة عبر WhatsApp",
  "Billing Disputes": "نزاعات الفواتير",
  "If you have a billing dispute, contact us within 30 days with proof. We'll investigate and resolve promptly.": "إذا كان لديك نزاع بشأن الفاتورة، فتواصل معنا خلال 30 يوماً مع تقديم إثبات. وسنحقّق في الأمر ونحلّه بسرعة.",
  "3. Refund & Return Policy": "3. سياسة استرداد المبلغ والإرجاع",
  "If you're unsatisfied with your purchase, you can request a full refund within 30 days of purchase.": "إذا لم تكن راضياً عن عملية الشراء، فيمكنك طلب استرداد كامل خلال 30 يوماً من تاريخ الشراء.",
  "Refund Eligibility": "أهلية استرداد المبلغ",
  "Request must be made within 30 days": "يجب تقديم الطلب خلال 30 يوماً",
  "Product must not work as advertised": "ألا يعمل المنتج كما هو معلن",
  "Technical issues must be unresolvable": "أن تكون المشكلات التقنية غير قابلة للحل",
  "No refund for changed mind (we can't take back digital access)": "لا استرداد في حال تغيير الرأي (لا يمكننا استعادة الوصول الرقمي)",
  "Refund Process": "إجراءات استرداد المبلغ",
  "Approved refunds are processed within 5-7 business days to your original payment method.": "تتم معالجة المبالغ المستردة المعتمدة خلال 5 إلى 7 أيام عمل عبر وسيلة الدفع الأصلية.",
  "4. Product Warranties": "4. ضمانات المنتجات",
  "DIMA Deals provides credentials and access to third-party services. We warrant that:": "تقدّم DIMA Deals بيانات الوصول والوصول إلى خدمات أطراف ثالثة. ونضمن ما يلي:",
  "Credentials will be delivered as promised": "سيتم تسليم بيانات الوصول كما هو موعود",
  "Access will be instant upon purchase": "سيكون الوصول فورياً عند الشراء",
  "Credentials will be valid and functional": "ستكون بيانات الوصول صالحة وقابلة للاستخدام",
  "However, DIMA Deals is not responsible for service outages, policy changes, or issues with the third-party service provider.": "غير أن DIMA Deals ليست مسؤولة عن انقطاع الخدمة أو تغيير السياسات أو المشكلات المتعلقة بمزوّد الخدمة الخارجي.",
  "5. Limitation of Liability": "5. حدود المسؤولية",
  "DIMA Deals is provided \"as-is\" without warranties. We're not liable for:": "تُقدَّم DIMA Deals «كما هي» دون أي ضمانات، ونحن غير مسؤولين عن:",
  "Indirect or consequential damages": "الأضرار غير المباشرة أو التبعية",
  "Loss of data or profits": "فقدان البيانات أو الأرباح",
  "Third-party service changes or outages": "تغييرات خدمات الأطراف الثالثة أو انقطاعها",
  "Unauthorized account access": "الوصول غير المصرّح به إلى الحساب",
  "Any damages exceeding the purchase price": "أي أضرار تتجاوز سعر الشراء",
  "6. Account Responsibility": "6. مسؤولية الحساب",
  "You are responsible for:": "أنت مسؤول عن:",
  "Keeping your login credentials secure": "الحفاظ على أمان بيانات تسجيل الدخول الخاصة بك",
  "All activity using your account": "جميع الأنشطة التي تُجرى باستخدام حسابك",
  "Notifying us of unauthorized access": "إبلاغنا بأي وصول غير مصرّح به",
  "Service terms of the third-party provider": "الالتزام بشروط خدمة المزوّد الخارجي",
  "7. Intellectual Property": "7. الملكية الفكرية",
  "DIMA Deals name, logo, and content are protected intellectual property. You may not:": "اسم DIMA Deals وشعارها ومحتواها ملكية فكرية محمية، ولا يجوز لك:",
  "Copy or reproduce without permission": "النسخ أو الاستنساخ دون إذن",
  "Create derivative works": "إنشاء أعمال مشتقة",
  "Use for commercial purposes": "الاستخدام لأغراض تجارية",
  "Remove copyright notices": "إزالة إشعارات حقوق النشر",
  "8. Changes to Terms": "8. تعديل الشروط",
  "We may update these terms anytime. We'll notify users of material changes. Your continued use means acceptance of new terms.": "قد نحدّث هذه الشروط في أي وقت، وسنُعلم المستخدمين بالتغييرات الجوهرية. ويُعد استمرارك في الاستخدام موافقة على الشروط الجديدة.",
  "9. Termination": "9. إنهاء الخدمة",
  "We may terminate your account if you violate these terms or any applicable laws. Termination is without refund unless required by law.": "يحق لنا إنهاء حسابك إذا خالفت هذه الشروط أو أي قوانين معمول بها. ويكون الإنهاء دون استرداد إلا إذا اقتضى القانون خلاف ذلك.",
  "10. Governing Law": "10. القانون الحاكم",
  "These terms are governed by the laws of Tunisia. Any disputes will be resolved in Tunisian courts.": "تخضع هذه الشروط لقوانين تونس، وتُحلّ أي نزاعات أمام المحاكم التونسية.",
  "For questions about these terms, contact us:": "لأي استفسار حول هذه الشروط، تواصل معنا:",
  "DIMA Deals — Admin Dashboard": "DIMA Deals — لوحة تحكم المسؤول",
  "Admin Dashboard": "لوحة تحكم المسؤول",
  "DIMA Deals Control Panel": "لوحة تحكم DIMA Deals",
  "Admin Key": "مفتاح المسؤول",
  "Enter your admin key": "أدخل مفتاح المسؤول",
  "Sign In": "تسجيل الدخول",
  "Overview": "نظرة عامة",
  "Orders": "الطلبات",
  "Categories": "الفئات",
  "Products": "المنتجات",
  "Messages": "الرسائل",
  "Logout": "تسجيل الخروج",
  "Refresh": "تحديث",
  "Total Orders": "إجمالي الطلبات",
  "All time": "منذ البداية",
  "Total Revenue": "إجمالي الإيرادات",
  "Pending": "قيد الانتظار",
  "Awaiting action": "بانتظار الإجراء",
  "Today": "اليوم",
  "New orders": "طلبات جديدة",
  "Revenue — Last 7 Days": "الإيرادات — آخر 7 أيام",
  "Daily revenue trend (TND)": "اتجاه الإيرادات اليومي (TND)",
  "Order Status": "حالة الطلبات",
  "Current distribution": "التوزيع الحالي",
  "Recent Orders": "أحدث الطلبات",
  "View All": "عرض الكل",
  "Order ID": "رقم الطلب",
  "Customer": "العميل",
  "Items": "العناصر",
  "Total": "الإجمالي",
  "Status": "الحالة",
  "Date": "التاريخ",
  "Loading…": "جارٍ التحميل…",
  "Loading messages…": "جارٍ تحميل الرسائل…",
  "Search by ID, email, or name…": "ابحث بالمعرّف أو البريد الإلكتروني أو الاسم…",
  "All Statuses": "جميع الحالات",
  "Processing": "قيد المعالجة",
  "Completed": "مكتمل",
  "Delivered": "تم التسليم",
  "Cancelled": "ملغى",
  "Date (Newest)": "التاريخ (الأحدث أولًا)",
  "Date (Oldest)": "التاريخ (الأقدم أولًا)",
  "Total High→Low": "الإجمالي من الأعلى إلى الأدنى",
  "Total Low→High": "الإجمالي من الأدنى إلى الأعلى",
  "Export CSV": "تصدير CSV",
  "All Orders": "جميع الطلبات",
  "Payment": "الدفع",
  "Showing {start}–{end} of {total}": "عرض {start}–{end} من {total}",
  "Add Main Category": "إضافة فئة رئيسية",
  "Add Subcategory": "إضافة فئة فرعية",
  "Add Product": "إضافة منتج",
  "All Products": "كل المنتجات",
  "Search products…": "ابحث عن منتجات…",
  "All Categories": "جميع الفئات",
  "Sort by…": "ترتيب حسب…",
  "ID ↑": "المعرّف ↑",
  "ID ↓": "المعرّف ↓",
  "Name A→Z": "الاسم أ→ي",
  "Name Z→A": "الاسم ي→أ",
  "Price Low→High": "السعر من الأدنى إلى الأعلى",
  "Price High→Low": "السعر من الأعلى إلى الأدنى",
  "Category": "الفئة",
  "ID": "المعرّف",
  "Name": "الاسم",
  "Price": "السعر",
  "Stock": "المخزون",
  "Search messages…": "ابحث عن رسائل…",
  "Contact Messages": "رسائل التواصل",
  "Message": "الرسالة",
  "No messages yet": "لا توجد رسائل بعد",
  "Order Details": "تفاصيل الطلب",
  "Save Status": "حفظ الحالة",
  "Delete": "حذف",
  "Order Info": "معلومات الطلب",
  "Created At": "تاريخ الإنشاء",
  "Full Name": "الاسم الكامل",
  "Country": "البلد",
  "Totals": "المجاميع",
  "Subtotal": "المجموع الفرعي",
  "No items": "لا توجد عناصر",
  "Product ID": "معرّف المنتج",
  "Enter product ID": "أدخل معرّف المنتج",
  "Product name": "اسم المنتج",
  "Select Category": "اختر فئة",
  "Main Categories": "الفئات الرئيسية",
  "Auto-selected from subcategory if left empty": "تُحدَّد تلقائيًا من الفئة الفرعية إذا تُركت فارغة",
  "Price (TND)": "السعر (TND)",
  "Original Price (optional)": "السعر الأصلي (اختياري)",
  "Description": "الوصف",
  "Product description": "وصف المنتج",
  "Image URLs": "روابط الصور",
  "(one per line, up to 10)": "(رابط واحد في كل سطر، 10 كحد أقصى)",
  "Rating (0-5)": "التقييم (0-5)",
  "Popular": "شائع",
  "Recommended": "موصى به",
  "In Stock": "متوفر في المخزون",
  "Cancel": "إلغاء",
  "Save Product": "حفظ المنتج",
  "Main Category Name": "اسم الفئة الرئيسية",
  "e.g., Subscriptions": "مثال: الاشتراكات",
  "Save": "حفظ",
  "Main Category": "الفئة الرئيسية",
  "Subcategory Name": "اسم الفئة الفرعية",
  "e.g., Netflix": "مثال: Netflix",
  "Confirm": "تأكيد",
  "Are you sure?": "هل أنت متأكد؟",
  "Edit Product": "تعديل المنتج",
  "Logged out due to 10 minutes of inactivity": "تم تسجيل الخروج بسبب 10 دقائق من عدم النشاط",
  "Failed to load orders": "تعذّر تحميل الطلبات",
  "Refreshed": "تم التحديث",
  "Refresh failed": "فشل التحديث",
  "Verifying…": "جارٍ التحقق…",
  "Refreshing...": "جارٍ التحديث...",
  "Invalid admin key. Please try again.": "مفتاح المسؤول غير صالح. يرجى المحاولة مرة أخرى.",
  "Invalid JSON response": "استجابة JSON غير صالحة",
  "Invalid JSON from server": "استجابة JSON غير صالحة من الخادم",
  "Unauthorized": "غير مصرّح به",
  "bad key": "مفتاح غير صالح",
  "Request failed ({status})": "فشل الطلب ({status})",
  "Failed to load categories": "تعذّر تحميل الفئات",
  "Category name is required": "اسم الفئة مطلوب",
  "Main category created": "تم إنشاء الفئة الرئيسية",
  "Failed to create category": "تعذّر إنشاء الفئة",
  "Subcategory name is required": "اسم الفئة الفرعية مطلوب",
  "Subcategory added": "تمت إضافة الفئة الفرعية",
  "Failed to add": "فشل الإضافة",
  "Subcategory updated": "تم تحديث الفئة الفرعية",
  "Failed to update": "فشل التحديث",
  "Failed to save": "فشل الحفظ",
  "Delete Subcategory": "حذف الفئة الفرعية",
  "Delete \"{subcat}\"? This cannot be undone. Products using this category must be moved or deleted first.": "هل تريد حذف «{subcat}»؟ لا يمكن التراجع عن هذا الإجراء. يجب نقل المنتجات التي تستخدم هذه الفئة أو حذفها أولًا.",
  "Subcategory deleted": "تم حذف الفئة الفرعية",
  "Failed to load products": "تعذّر تحميل المنتجات",
  "No orders yet": "لا توجد طلبات بعد",
  "No orders found": "لا توجد طلبات مطابقة",
  "{count} order(s)": "{count} طلب",
  "No categories found": "لا توجد فئات",
  "No products found": "لم يتم العثور على منتجات",
  "{count} product(s)": "{count} منتج",
  "Product not found": "المنتج غير موجود",
  "Please fill all required fields": "يرجى تعبئة جميع الحقول المطلوبة",
  "Product updated": "تم تحديث المنتج",
  "Product created": "تم إنشاء المنتج",
  "Save failed": "فشل الحفظ",
  "Delete Product": "حذف المنتج",
  "Delete this product? This cannot be undone.": "هل تريد حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.",
  "Product deleted": "تم حذف المنتج",
  "Delete failed": "فشل الحذف",
  "CSV exported": "تم تصدير CSV",
  "Delete Order": "حذف الطلب",
  "Delete order {orderId}? This cannot be undone.": "هل تريد حذف الطلب {orderId}؟ لا يمكن التراجع عن هذا الإجراء.",
  "Order deleted": "تم حذف الطلب",
  "Status updated": "تم تحديث الحالة",
  "Update failed": "فشل التحديث",
  "Delete Message": "حذف الرسالة",
  "Delete this message?": "هل تريد حذف هذه الرسالة؟",
  "Message deleted": "تم حذف الرسالة",
  "Add Subcategory to {mainCategory}": "إضافة فئة فرعية إلى {mainCategory}",
  "Edit Subcategory": "تعديل الفئة الفرعية",
  "Revenue (TND)": "الإيرادات (TND)",
  "Other": "أخرى",
  "Yes": "نعم",
  "No": "لا",
  "From:": "من:",
  "Message:": "الرسالة:",
  "Tunisia's digital store": "المتجر الرقمي في تونس",
  "Games, subscriptions and software.": "ألعاب واشتراكات وبرامج.",
  "Delivered in minutes.": "تسليم خلال دقائق.",
  "PC and console titles, streaming plans, courses and software — chosen for gamers, creators and students in Tunisia. Pay in TND and get your access digitally.": "ألعاب الكمبيوتر والكونسول، وخطط البث، والدورات، والبرامج — مختارة للاعبين والمبدعين والطلاب في تونس. ادفع بالدينار التونسي (TND) واستلم وصولك رقميًا.",
  "Browse the catalog": "تصفح المتجر",
  "Explore games": "استكشف الألعاب",
  "Instant digital delivery": "تسليم رقمي فوري",
  "Verified before delivery": "يُتحقق منه قبل التسليم",
  "Local WhatsApp support": "دعم محلي عبر WhatsApp",
  "Featured products": "منتجات مميزة",
  "Featured release": "إصدار مميز",
  "Console": "الكونسول",
  "PC": "الكمبيوتر",
  "Shop by category": "تسوق حسب الفئة",
  "View everything": "عرض كل شيء",
  "Netflix, Spotify, Canva & more": "Netflix وSpotify وCanva والمزيد",
  "PC, console, mobile & gift cards": "الكمبيوتر والكونسول والهاتف المحمول وبطاقات الهدايا",
  "Programming, design & business": "البرمجة والتصميم والأعمال",
  "Tools, licenses & mobile apps": "أدوات وتراخيص وتطبيقات الهاتف المحمول",
  "Trending this month": "الأكثر رواجًا هذا الشهر",
  "Most popular": "الأكثر شعبية",
  "The products our customers keep coming back for": "منتجات يعود إليها عملاؤنا في كل مرة",
  "Shop all": "تسوق كل المنتجات",
  "Selected offers": "عروض مختارة",
  "Featured deals": "عروض مميزة",
  "Hand-picked offers with clear savings": "عروض منتقاة بعناية مع توفير واضح",
  "See game deals": "اطلع على عروض الألعاب",
  "The DIMA standard": "معيار DIMA",
  "Why buy from DIMA Deals": "لماذا تشتري من DIMA Deals",
  "We are not a faceless code shop. Every order is handled by a real team in Tunisia, with prices in dinars and support you can actually reach.": "نحن لسنا متجرًا إلكترونيًا بلا وجه. كل طلب يتولاه فريق حقيقي في تونس، بأسعار بالدينار ودعم يمكنك الوصول إليه فعلًا.",
  "More about us": "تعرّف علينا أكثر",
  "Digital codes and access sent as soon as your order is verified.": "أكواد رقمية ووصول يُرسل فور التحقق من طلبك.",
  "Your details are handled carefully and payment is confirmed manually.": "تُعالج بياناتك بعناية ويُؤكَّد الدفع يدويًا.",
  "Message us on WhatsApp and talk to a real person in Tunisia.": "راسلنا على WhatsApp وتحدث مع شخص حقيقي في تونس.",
  "Working or refunded": "يعمل أو يُسترد المبلغ",
  "If a product does not work as described, we make it right.": "إذا لم يعمل المنتج كما هو موضح، فإننا نصلح الأمر.",
  "Not sure which plan or platform to pick?": "لست متأكدًا من الخطة أو المنصة المناسبة؟",
  "Tell us what you need and we will point you to the right product — no pressure.": "أخبرنا بما تحتاجه وسنرشدك إلى المنتج المناسب — دون أي إلزام.",
  "Catalog": "الكتالوج",
  "Every game, subscription, course and app in one place.": "كل الألعاب والاشتراكات والدورات والتطبيقات في مكان واحد.",
  "Browse categories": "تصفح الفئات",
  "Prices in TND · Digital delivery": "الأسعار بـ TND · تسليم رقمي",
  "PC gaming platforms": "منصات ألعاب الكمبيوتر",
  "Choose the storefront you already use.": "اختر المتجر الذي تستخدمه بالفعل.",
  "Breadcrumb": "مسار التنقل",
  "Product Image": "صورة المنتج",
  "Loading product details…": "جارٍ تحميل تفاصيل المنتج…",
  "Keep browsing": "واصل التصفح",
  "Related products": "منتجات ذات صلة",
  "More from the same part of the store": "المزيد من القسم نفسه في المتجر",
  "Browse all": "تصفح الكل",
  "Your order": "طلبك",
  "Review your products before checkout. Digital delivery is arranged after payment is confirmed.": "راجع منتجاتك قبل الدفع. يُرتَّب التسليم الرقمي بعد تأكيد الدفع.",
  "Continue shopping": "متابعة التسوق",
  "Your cart is empty": "سلتك فارغة",
  "Start shopping to add items to your cart!": "ابدأ التسوق لإضافة منتجات إلى سلتك!",
  "Continue Shopping": "متابعة التسوق",
  "Order Summary": "ملخص الطلب",
  "Subtotal:": "المجموع الفرعي:",
  "Tax (0%):": "الضريبة (0%):",
  "Total:": "الإجمالي:",
  "Proceed to Checkout": "المتابعة إلى الدفع",
  "Complete your order": "أكمل طلبك",
  "Enter your details and we will contact you to confirm payment and delivery.": "أدخل بياناتك وسنتواصل معك لتأكيد الدفع والتسليم.",
  "Checkout progress": "مراحل الدفع",
  "Cart": "السلة",
  "Checkout": "الدفع",
  "Confirmation": "التأكيد",
  "Billing Information": "معلومات الفوترة",
  "Phone Number *": "رقم الهاتف *",
  "Enter your 8-digit Tunisian phone number": "أدخل رقم هاتفك التونسي المكوَّن من 8 أرقام",
  "Full Name *": "الاسم الكامل *",
  "Your Full Name": "اسمك الكامل",
  "Country *": "البلد *",
  "Select Country": "اختر البلد",
  "Algeria": "الجزائر",
  "Morocco": "المغرب",
  "Libya": "ليبيا",
  "Sudan": "السودان",
  "Egypt": "مصر",
  "I agree to the": "أوافق على",
  "and": "و",
  "Instant delivery after payment": "تسليم فوري بعد الدفع",
  "24/7 support via WhatsApp": "دعم على مدار الساعة عبر WhatsApp",
  "Trusted by 100+ customers": "يثق بنا أكثر من 100 عميل",
  "100% working or money back": "يعمل بنسبة 100% أو استرداد الأموال",
  "Place Order": "تأكيد الطلب",
  "Your information is safe. Payment will be arranged manually — no card needed.": "معلوماتك في أمان. سيُرتَّب الدفع يدويًا — دون الحاجة إلى بطاقة.",
  "Back to Cart": "العودة إلى السلة",
  "Order Confirmed!": "تم تأكيد الطلب!",
  "Thank you for your order. Your order has been received successfully.": "شكرًا لطلبك. تم استلام طلبك بنجاح.",
  "Payment will be handled manually.": "ستتم معالجة الدفع يدويًا.",
  "We will contact you shortly via phone or WhatsApp to arrange payment and deliver your order.": "سنتواصل معك قريبًا عبر الهاتف أو WhatsApp لترتيب الدفع وتسليم طلبك.",
  "Order Items": "منتجات الطلب",
  "What's Next?": "ما الخطوة التالية؟",
  "You will be contacted shortly to confirm your order and arrange payment": "سيتم التواصل معك قريبًا لتأكيد طلبك وترتيب الدفع",
  "A confirmation will be sent to your email address": "سيُرسل تأكيد إلى بريدك الإلكتروني",
  "Once payment is confirmed, you'll receive your product instantly": "بمجرد تأكيد الدفع، ستستلم منتجك فورًا",
  "Need help? Our support team is available 24/7 via WhatsApp": "تحتاج مساعدة؟ فريق الدعم متاح على مدار الساعة عبر WhatsApp",
  "Return to Home": "العودة إلى الرئيسية",
  "Need help? Contact us via": "تحتاج مساعدة؟ تواصل معنا عبر",
  "or email": "أو عبر البريد الإلكتروني",
  "Find a product": "ابحث عن منتج",
  "Search results": "نتائج البحث",
  "Sort By": "الترتيب حسب",
  "Relevance": "الصلة",
  "Price: Low to High": "السعر: من الأقل إلى الأعلى",
  "Price: High to Low": "السعر: من الأعلى إلى الأقل",
  "Highest Rated": "الأعلى تقييمًا",
  "Most Popular": "الأكثر شعبية",
  "DIMA Deals — Games, subscriptions and software in Tunisia": "DIMA Deals — ألعاب واشتراكات وبرامج في تونس",
  "Browse - DIMA Deals": "تصفح المنتجات - DIMA Deals",
  "Product Details - DIMA Deals": "تفاصيل المنتج - DIMA Deals",
  "Shopping Cart - DIMA Deals": "سلة التسوق - DIMA Deals",
  "Checkout - DIMA Deals": "الدفع - DIMA Deals",
  "Order Confirmation - DIMA Deals": "تأكيد الطلب - DIMA Deals",
  "Search Results - DIMA Deals": "نتائج البحث - DIMA Deals",
  "DIMA Deals is Tunisia's digital store for PC and console games, streaming subscriptions, courses and software. Instant digital delivery, clear prices in TND and local support.": "DIMA Deals هو المتجر الرقمي في تونس لألعاب الكمبيوتر والكونسول، واشتراكات البث، والدورات، والبرامج. تسليم رقمي فوري، وأسعار واضحة بـ TND، ودعم محلي.",
  "Buy Netflix, Spotify, and digital subscriptions in Tunisia with instant delivery and secure payment.": "اشترِ Netflix وSpotify والاشتراكات الرقمية في تونس مع تسليم فوري ودفع آمن.",
  "Home": "الرئيسية",
  "In stock": "متوفر",
  "Out of stock": "غير متوفر",
  "Add to cart": "أضف إلى السلة",
  "Save {percent}%": "وفّر {percent}%",
  "No image available": "لا توجد صورة",
  "View {name}": "عرض {name}",
  "Rated {rating} out of 5": "التقييم {rating} من 5",
  "Show {count} more": "عرض {count} إضافية",
  "{count} left": "بقي {count}",
  "All products loaded": "تم تحميل جميع المنتجات",
  "{count} product available": "منتج واحد متاح",
  "{count} products available": "{count} منتجاً متاحاً",
  "No products here yet": "لا توجد منتجات هنا بعد",
  "This category is empty right now. Browse the full catalog for other deals.": "هذه الفئة فارغة حالياً. تصفح المتجر الكامل للعثور على عروض أخرى.",
  "Browse all products": "تصفح جميع المنتجات",
  "Try a different search term or clear the category filter.": "جرّب كلمة بحث أخرى أو أزل تصفية الفئة.",
  "Something went wrong": "حدث خطأ ما",
  "Could not load products. Please refresh the page.": "تعذر تحميل المنتجات. يرجى تحديث الصفحة.",
  "Refresh page": "تحديث الصفحة",
  "No products available": "لا توجد منتجات متاحة",
  "Check back later for new arrivals.": "عد لاحقاً لاستكشاف المنتجات الجديدة.",
  "Failed to load products. Please refresh the page.": "تعذر تحميل المنتجات. يرجى تحديث الصفحة.",
  "Failed to load products. Please check your connection and refresh.": "تعذر تحميل المنتجات. تحقق من اتصالك ثم حدّث الصفحة.",
  "Something went wrong. Please try again.": "حدث خطأ ما. يرجى المحاولة مرة أخرى.",
  "Searching for: \"{query}\"": "البحث عن: «{query}»",
  "{count} result(s) found": "تم العثور على {count} نتيجة",
  "Search: {query} — DIMA Deals": "بحث: {query} — DIMA Deals",
  "This product may have been removed or the link is no longer valid.": "ربما تمت إزالة هذا المنتج أو أصبح الرابط غير صالح.",
  "No product image available": "لا تتوفر صورة للمنتج",
  "Instant digital delivery after verification": "تسليم رقمي فوري بعد التحقق",
  "Working product or money back": "منتج يعمل أو استرداد المبلغ",
  "Support on WhatsApp": "الدعم عبر واتساب",
  "Clear price in Tunisian dinars": "سعر واضح بالدينار التونسي",
  "Add to cart — {price} TND": "أضف إلى السلة — {price} TND",
  "Shopping cart, {count} item(s)": "السلة، {count} عنصر",
  "Decrease quantity": "تقليل الكمية",
  "Increase quantity": "زيادة الكمية",
  "Remove {name}": "إزالة {name}",
  "Your cart is empty!": "سلتك فارغة!",
  "Could not save your cart. Storage may be full.": "تعذر حفظ سلتك. قد تكون مساحة التخزين ممتلئة.",
  "{name} added to cart!": "تمت إضافة {name} إلى السلة!",
  "Product not found. Please refresh and try again.": "المنتج غير موجود. يرجى تحديث الصفحة والمحاولة مرة أخرى.",
  "Please enter a valid email address": "يرجى إدخال بريد إلكتروني صالح",
  "Phone must be 8 digits": "يجب أن يتكون رقم الهاتف من 8 أرقام",
  "Full name must be at least 3 characters": "يجب أن يتكون الاسم الكامل من 3 أحرف على الأقل",
  "Please select your country": "يرجى اختيار بلدك",
  "Please accept the Terms of Service and Privacy Policy": "يرجى قبول شروط الخدمة وسياسة الخصوصية",
  "Some items in your cart are no longer available. Please clear your cart and re-add them.": "بعض العناصر في سلتك لم تعد متاحة. يرجى إفراغ السلة وإضافتها مجدداً.",
  "Placing Order...": "جارٍ إرسال الطلب…",
  "The server returned an unexpected response. Please try again.": "أعاد الخادم استجابة غير متوقعة. يرجى المحاولة مرة أخرى.",
  "Checkout failed": "فشل الدفع",
  "Error: {message}": "خطأ: {message}",
  "Order not found": "الطلب غير موجود",
  "We could not find this order. If you just placed it, please contact support.": "لم نتمكن من العثور على هذا الطلب. إذا كنت قد أرسلته للتو، يرجى التواصل مع الدعم.",
  "Order ID:": "رقم الطلب:",
  "Name:": "الاسم:",
  "Phone:": "الهاتف:",
  "Date:": "التاريخ:",
  "No items in this order.": "لا توجد عناصر في هذا الطلب.",
  "Back to Home": "العودة إلى الرئيسية",
  "Browse products": "تصفح المنتجات",
  "Discover digital products from DIMA Deals.": "اكتشف المنتجات الرقمية من DIMA Deals.",
  "Discover amazing digital products": "اكتشف منتجات رقمية رائعة",
  "Premium Subscriptions": "اشتراكات مميزة",
  "Netflix, Spotify, Canva, Shahid and more — delivered instantly": "نتفليكس وسبوتيفاي وكانفا وشاهد والمزيد — تسليم فوري",
  "Games & Digital Content": "الألعاب والمحتوى الرقمي",
  "PC, console, mobile games and gift cards at the best prices": "ألعاب الكمبيوتر والكونسول والهاتف وبطاقات الهدايا بأفضل الأسعار",
  "Online Courses": "دورات عبر الإنترنت",
  "Learn programming, design and business from top platforms": "تعلّم البرمجة والتصميم والأعمال من أفضل المنصات",
  "Apps & Software": "التطبيقات والبرامج",
  "Premium apps and software licenses for work and creativity": "تطبيقات مميزة وتراخيص برامج للعمل والإبداع",
  "Netflix Subscriptions": "اشتراكات نتفليكس",
  "Choose the perfect Netflix plan for your entertainment needs": "اختر خطة نتفليكس المناسبة لاحتياجاتك الترفيهية",
  "Spotify Subscriptions": "اشتراكات سبوتيفاي",
  "Stream unlimited music and podcasts with Spotify Premium": "استمع إلى موسيقى وبودكاست بلا حدود مع Spotify Premium",
  "Canva Subscriptions": "اشتراكات كانفا",
  "Enjoy templates, AI tools, and design benefits with Canva Pro": "استمتع بالقوالب وأدوات الذكاء الاصطناعي ومزايا التصميم مع Canva Pro",
  "Shahid Subscriptions": "اشتراكات شاهد",
  "Watch exclusive Arab shows and movies on Shahid Plus": "شاهد مسلسلات وأفلاماً عربية حصرية على Shahid Plus",
  "CapCut Subscriptions": "اشتراكات كاب كات",
  "Professional video editing with CapCut Pro": "مونتاج فيديو احترافي مع CapCut Pro",
  "PC Games": "ألعاب الكمبيوتر",
  "Choose from the best PC games and digital content": "اختر من أفضل ألعاب الكمبيوتر والمحتوى الرقمي",
  "Console Games": "ألعاب الكونسول",
  "Browse console games for PlayStation and Xbox": "تصفح ألعاب الكونسول لأجهزة PlayStation وXbox",
  "Mobile Games": "ألعاب الهاتف المحمول",
  "Download premium mobile games": "نزّل ألعاب الهاتف المميزة",
  "Steam Gift Cards": "بطاقات هدايا Steam",
  "Enjoy premium games on Steam": "استمتع بألعاب مميزة على Steam",
  "Epic Games Store": "متجر Epic Games",
  "Digital gift cards for Epic Games Store and free games": "بطاقات هدايا رقمية لمتجر Epic Games والألعاب المجانية",
  "EA Play": "EA Play",
  "Access EA's extensive library of games with EA Play subscription": "استمتع بمكتبة EA الواسعة من الألعاب مع اشتراك EA Play",
  "Xbox Game Pass PC": "Xbox Game Pass للكمبيوتر",
  "Access hundreds of games on PC with Xbox Game Pass": "استمتع بمئات الألعاب على الكمبيوتر مع Xbox Game Pass",
  "Programming Courses": "دورات البرمجة",
  "Learn programming and development skills": "تعلّم البرمجة ومهارات التطوير",
  "Design Courses": "دورات التصميم",
  "Master design tools and creativity": "أتقن أدوات التصميم والإبداع",
  "Business Courses": "دورات الأعمال",
  "Develop your business and leadership skills": "طوّر مهاراتك في الأعمال والقيادة",
  "Mobile Apps": "تطبيقات الهاتف",
  "Premium apps and gift cards for your phone": "تطبيقات مميزة وبطاقات هدايا لهاتفك",
  "Premium software solutions for your computer": "حلول برمجية مميزة لجهاز الكمبيوتر",
  "Steam": "Steam",
  "Epic Games": "Epic Games",
  "Xbox Game Pass": "Xbox Game Pass",
  "Ticket": "تذكرة"
},
  };
  const PRODUCTS = {
  "1": {
    "fr": {
      "name": "Netflix Premium — 1 mois",
      "description": "Regardez des films et des séries en illimité en 4K Ultra HD sur 4 écrans avec un profil Netflix Premium privé. Activation instantanée."
    },
    "ar": {
      "name": "Netflix Premium — شهر واحد",
      "description": "شاهد أفلامًا ومسلسلات بلا حدود بجودة 4K Ultra HD على 4 شاشات مع ملف Netflix Premium خاص. تفعيل فوري."
    }
  },
  "2": {
    "fr": {
      "name": "Netflix Premium — 3 mois",
      "description": "3 mois de Netflix Premium en 4K Ultra HD. Profil privé, 4 écrans simultanés et livraison instantanée après paiement."
    },
    "ar": {
      "name": "Netflix Premium — 3 أشهر",
      "description": "3 أشهر من Netflix Premium بجودة 4K Ultra HD. ملف خاص و4 شاشات في الوقت نفسه وتسليم فوري بعد الدفع."
    }
  },
  "3": {
    "fr": {
      "name": "Netflix Premium — 6 mois",
      "description": "Économisez davantage avec 6 mois de Netflix Premium. Accès complet à la 4K sur 4 écrans avec un profil privé prêt à l'emploi."
    },
    "ar": {
      "name": "Netflix Premium — 6 أشهر",
      "description": "وفّر أكثر مع 6 أشهر من Netflix Premium. وصول كامل إلى جودة 4K على 4 شاشات مع ملف خاص جاهز للاستخدام."
    }
  },
  "10": {
    "fr": {
      "name": "Spotify Premium — 1 mois",
      "description": "Musique sans publicité, téléchargements hors ligne et sauts illimités avec Spotify Premium. Compatible mobile, ordinateur et téléviseurs connectés."
    },
    "ar": {
      "name": "Spotify Premium — شهر واحد",
      "description": "موسيقى بلا إعلانات وتنزيلات للاستماع دون اتصال وتخطٍّ غير محدود مع Spotify Premium. يعمل على الهاتف والحاسوب وأجهزة التلفاز الذكية."
    }
  },
  "11": {
    "fr": {
      "name": "Spotify Premium — 3 mois",
      "description": "Trois mois de Spotify Premium sans publicité, avec écoute hors ligne et audio de haute qualité sur tous vos appareils."
    },
    "ar": {
      "name": "Spotify Premium — 3 أشهر",
      "description": "ثلاثة أشهر من Spotify Premium بلا إعلانات مع الاستماع دون اتصال وصوت عالي الجودة على جميع أجهزتك."
    }
  },
  "12": {
    "fr": {
      "name": "Spotify Premium — 6 mois",
      "description": "Six mois de Spotify Premium au meilleur prix. Musique, podcasts et téléchargements illimités, sans publicité."
    },
    "ar": {
      "name": "Spotify Premium — 6 أشهر",
      "description": "ستة أشهر من Spotify Premium بأفضل سعر. موسيقى وبودكاست وتنزيلات بلا حدود ودون إعلانات."
    }
  },
  "20": {
    "fr": {
      "name": "Canva Pro — 1 an",
      "description": "Débloquez des modèles premium, le détourage, les kits de marque et les outils de design par IA avec un an de Canva Pro."
    },
    "ar": {
      "name": "Canva Pro — سنة واحدة",
      "description": "افتح قوالب مميزة وأداة إزالة الخلفية وأطقم الهوية البصرية وأدوات التصميم بالذكاء الاصطناعي مع سنة كاملة من Canva Pro."
    }
  },
  "21": {
    "fr": {
      "name": "Canva Pro — 1 mois",
      "description": "Un mois complet de Canva Pro avec des modèles premium, les outils IA Magic Studio et des exports illimités."
    },
    "ar": {
      "name": "Canva Pro — شهر واحد",
      "description": "شهر كامل من Canva Pro مع قوالب مميزة وأدوات Magic Studio بالذكاء الاصطناعي وتصدير غير محدود."
    }
  },
  "22": {
    "fr": {
      "name": "Canva Pro — 3 mois",
      "description": "Trois mois de Canva Pro pour les créateurs, les étudiants et les petites entreprises. Activation instantanée."
    },
    "ar": {
      "name": "Canva Pro — 3 أشهر",
      "description": "ثلاثة أشهر من Canva Pro للمبدعين والطلاب والشركات الصغيرة. تفعيل فوري."
    }
  },
  "30": {
    "fr": {
      "name": "Shahid VIP — 1 mois",
      "description": "Diffusez en HD des séries arabes exclusives, des films et des sports en direct avec Shahid VIP. Activation instantanée."
    },
    "ar": {
      "name": "Shahid VIP — شهر واحد",
      "description": "شاهد مسلسلات عربية حصرية وأفلامًا وبثًا مباشرًا للرياضة بجودة HD مع Shahid VIP. تفعيل فوري."
    }
  },
  "31": {
    "fr": {
      "name": "Shahid VIP — 3 mois",
      "description": "Trois mois de Shahid VIP avec un accès illimité aux Shahid Originals, aux films et aux contenus premium."
    },
    "ar": {
      "name": "Shahid VIP — 3 أشهر",
      "description": "ثلاثة أشهر من Shahid VIP مع وصول غير محدود إلى Shahid Originals والأفلام والمحتوى المميز."
    }
  },
  "32": {
    "fr": {
      "name": "Shahid VIP — 1 an",
      "description": "Une année complète de divertissement Shahid VIP au meilleur prix. Compatible mobile, web et téléviseurs connectés."
    },
    "ar": {
      "name": "Shahid VIP — سنة واحدة",
      "description": "سنة كاملة من ترفيه Shahid VIP بأفضل سعر. يعمل على الهاتف والويب وأجهزة التلفاز الذكية."
    }
  },
  "40": {
    "fr": {
      "name": "CapCut Pro — 1 mois",
      "description": "Montez comme un pro avec CapCut Pro : effets premium, stockage cloud et exports sans filigrane pendant 30 jours."
    },
    "ar": {
      "name": "CapCut Pro — شهر واحد",
      "description": "حرّر كالمحترفين مع CapCut Pro: مؤثرات مميزة ومساحة تخزين سحابية وتصدير بدون علامة مائية لمدة 30 يومًا."
    }
  },
  "41": {
    "fr": {
      "name": "CapCut Pro — 3 mois",
      "description": "Trois mois de CapCut Pro avec tous les effets, modèles et outils de montage par IA débloqués."
    },
    "ar": {
      "name": "CapCut Pro — 3 أشهر",
      "description": "ثلاثة أشهر من CapCut Pro مع فتح جميع المؤثرات والقوالب وأدوات المونتاج بالذكاء الاصطناعي."
    }
  },
  "42": {
    "fr": {
      "name": "CapCut Pro — 1 an",
      "description": "Un an de CapCut Pro pour les créateurs de contenu. Ressources premium, sauvegarde cloud et aucun filigrane."
    },
    "ar": {
      "name": "CapCut Pro — سنة واحدة",
      "description": "سنة كاملة من CapCut Pro لمنشئي المحتوى. موارد مميزة ونسخ احتياطي سحابي وبدون علامة مائية."
    }
  },
  "50": {
    "fr": {
      "name": "Arc Raiders",
      "description": "Arc Raiders est un jeu de tir de survie coopératif où vous et votre escouade affrontez des menaces mécaniques et des pillards rivaux. Clé Steam."
    },
    "ar": {
      "name": "Arc Raiders",
      "description": "Arc Raiders لعبة تصويب وبقاء تعاونية حيث تواجه أنت وفريقك تهديدات آلية وغزاة منافسين. مفتاح Steam."
    }
  },
  "51": {
    "fr": {
      "name": "Cyberpunk 2077",
      "description": "Explorez Night City dans ce RPG en monde ouvert riche en histoire, en combats et en personnalisation. Clé numérique PC."
    },
    "ar": {
      "name": "Cyberpunk 2077",
      "description": "استكشف Night City في لعبة تقمص أدوار بعالم مفتوح مليئة بالقصص والقتال والتخصيص. مفتاح رقمي للكمبيوتر."
    }
  },
  "52": {
    "fr": {
      "name": "Elden Ring",
      "description": "Le RPG d'action primé de FromSoftware. Explorez les Terres Intermédiaires, maîtrisez le combat et devenez Seigneur Elden."
    },
    "ar": {
      "name": "Elden Ring",
      "description": "لعبة تقمص الأدوار القتالية الحائزة على جوائز من FromSoftware. استكشف الأراضي البينية وأتقن القتال وكن سيد Elden."
    }
  },
  "53": {
    "fr": {
      "name": "Helldivers 2",
      "description": "Formez une équipe de quatre joueurs pour répandre la démocratie dans la galaxie dans ce jeu de tir coopératif à la troisième personne."
    },
    "ar": {
      "name": "Helldivers 2",
      "description": "اتحد مع ما يصل إلى أربعة لاعبين لنشر الديمقراطية في المجرة في لعبة تصويب تعاونية بمنظور الشخص الثالث."
    }
  },
  "54": {
    "fr": {
      "name": "Grand Theft Auto V",
      "description": "Vivez l'expérience de Los Santos et de Blaine County dans ce légendaire jeu d'action en monde ouvert, incluant GTA Online."
    },
    "ar": {
      "name": "Grand Theft Auto V",
      "description": "عِش تجربة Los Santos وBlaine County في لعبة الأكشن الأسطورية ذات العالم المفتوح، بما في ذلك GTA Online."
    }
  },
  "55": {
    "fr": {
      "name": "No Man's Sky",
      "description": "Explorez un univers infini de planètes, construisez des bases et échangez avec d'autres joueurs dans cette aventure spatiale de survie."
    },
    "ar": {
      "name": "No Man's Sky",
      "description": "استكشف عالمًا لا نهائيًا من الكواكب وابنِ قواعدك وتاجر مع لاعبين آخرين في مغامرة بقاء فضائية."
    }
  },
  "56": {
    "fr": {
      "name": "Rust",
      "description": "Survivez, construisez et combattez pour les ressources dans le bac à sable multijoueur impitoyable de Rust. Clé Steam à livraison instantanée."
    },
    "ar": {
      "name": "Rust",
      "description": "انجُ وابنِ وقاتل من أجل الموارد في عالم Rust متعدد اللاعبين القاسي. مفتاح Steam بتسليم فوري."
    }
  },
  "57": {
    "fr": {
      "name": "Nioh 3",
      "description": "Maîtrisez un combat de samouraï rapide et affrontrez des ennemis surnaturels dans le dernier chapitre de la série Nioh."
    },
    "ar": {
      "name": "Nioh 3",
      "description": "أتقن قتال الساموراي السريع وواجه أعداءً خارقين في أحدث إصدار من سلسلة Nioh."
    }
  },
  "58": {
    "fr": {
      "name": "REANIMAL",
      "description": "Une sombre aventure d'horreur coopérative des créateurs de Little Nightmares. Affrontez vos peurs ensemble."
    },
    "ar": {
      "name": "REANIMAL",
      "description": "مغامرة رعب تعاونية مظلمة من مبتكري Little Nightmares. واجهوا مخاوفكم معًا."
    }
  },
  "59": {
    "fr": {
      "name": "Minecraft: Java & Bedrock Edition",
      "description": "Construisez, explorez et survivez dans le bac à sable le plus populaire au monde. Inclut les éditions Java et Bedrock."
    },
    "ar": {
      "name": "Minecraft: Java & Bedrock Edition",
      "description": "ابنِ واستكشف وانجُ في اللعبة الأكثر شعبية في العالم. تشمل إصداري Java وBedrock."
    }
  },
  "60": {
    "fr": {
      "name": "EA Sports FC 26 — PS5",
      "description": "Jouez le nouvel opus d'EA Sports FC sur PlayStation 5 avec des clubs mis à jour, Ultimate Team et un gameplay retravaillé."
    },
    "ar": {
      "name": "EA Sports FC 26 — PS5",
      "description": "العب أحدث إصدار من EA Sports FC على PlayStation 5 مع أندية محدثة وUltimate Team وأسلوب لعب محسّن."
    }
  },
  "61": {
    "fr": {
      "name": "EA Sports FC 26 — Xbox",
      "description": "EA Sports FC 26 pour Xbox Series X|S. Code numérique du jeu complet avec livraison instantanée."
    },
    "ar": {
      "name": "EA Sports FC 26 — Xbox",
      "description": "EA Sports FC 26 لأجهزة Xbox Series X|S. رمز رقمي للعبة الكاملة مع تسليم فوري."
    }
  },
  "62": {
    "fr": {
      "name": "Elden Ring — PS5",
      "description": "L'expérience Elden Ring complète sur PlayStation 5. Explorez les Terres Intermédiaires et affrontez des boss légendaires."
    },
    "ar": {
      "name": "Elden Ring — PS5",
      "description": "تجربة Elden Ring الكاملة على PlayStation 5. استكشف الأراضي البينية وواجه زعماء أسطوريين."
    }
  },
  "63": {
    "fr": {
      "name": "Cyberpunk 2077 — Xbox",
      "description": "Cyberpunk 2077 sur Xbox Series X|S avec la mise à jour next-gen. Plongez dans l'histoire foisonnante de Night City."
    },
    "ar": {
      "name": "Cyberpunk 2077 — Xbox",
      "description": "Cyberpunk 2077 على Xbox Series X|S مع تحديث الجيل الجديد. انغمس في قصة Night City الواسعة."
    }
  },
  "70": {
    "fr": {
      "name": "Minecraft Mobile",
      "description": "Minecraft Pocket Edition pour iOS et Android. Construisez, minez et explorez partout."
    },
    "ar": {
      "name": "Minecraft Mobile",
      "description": "Minecraft Pocket Edition لنظامي iOS وAndroid. ابنِ واحفر واستكشف في أي مكان."
    }
  },
  "71": {
    "fr": {
      "name": "GTA V — Mobile Cloud",
      "description": "Diffusez Grand Theft Auto V sur votre téléphone avec un pass de cloud gaming. Aucune console nécessaire."
    },
    "ar": {
      "name": "GTA V — Mobile Cloud",
      "description": "بثّ Grand Theft Auto V على هاتفك مع بطاقة الألعاب السحابية. دون الحاجة إلى جهاز ألعاب."
    }
  },
  "72": {
    "fr": {
      "name": "EA Sports FC 26 — Mobile",
      "description": "Jouez à EA Sports FC 26 sur mobile avec un compte premium et un accès complet à Ultimate Team."
    },
    "ar": {
      "name": "EA Sports FC 26 — Mobile",
      "description": "العب EA Sports FC 26 على الهاتف مع حساب مميز ووصول كامل إلى Ultimate Team."
    }
  },
  "80": {
    "fr": {
      "name": "Bootcamp de programmation Python",
      "description": "Apprenez Python de zéro à un niveau avancé grâce à des projets pratiques, des exercices et un accès à vie aux supports de cours."
    },
    "ar": {
      "name": "معسكر برمجة Python",
      "description": "تعلّم Python من الصفر إلى المستوى المتقدم عبر مشاريع عملية وتمارين ووصول دائم إلى مواد الدورة."
    }
  },
  "81": {
    "fr": {
      "name": "Développement web full-stack",
      "description": "Maîtrisez HTML, CSS, JavaScript, React, Node.js et les bases de données avec un cursus full-stack complet."
    },
    "ar": {
      "name": "تطوير الويب المتكامل Full-Stack",
      "description": "أتقن HTML وCSS وJavaScript وReact وNode.js وقواعد البيانات من خلال منهج متكامل لتطوير الويب."
    }
  },
  "82": {
    "fr": {
      "name": "Masterclass JavaScript",
      "description": "Approfondissez vos compétences en JavaScript avec les fonctionnalités ES modernes, les modèles asynchrones et des projets concrets."
    },
    "ar": {
      "name": "دورة JavaScript المتقدمة",
      "description": "طوّر مهاراتك في JavaScript مع ميزات ES الحديثة وأنماط البرمجة غير المتزامنة ومشاريع واقعية."
    }
  },
  "90": {
    "fr": {
      "name": "Design UI/UX avec Figma",
      "description": "Concevez des interfaces belles et ergonomiques dans Figma. Couvre les design systems, le prototypage et des projets de portfolio."
    },
    "ar": {
      "name": "تصميم UI/UX باستخدام Figma",
      "description": "صمّم واجهات جميلة وسهلة الاستخدام في Figma. يشمل أنظمة التصميم والنماذج الأولية ومشاريع لملف أعمالك."
    }
  },
  "91": {
    "fr": {
      "name": "Masterclass Adobe Creative Cloud",
      "description": "Apprenez Photoshop, Illustrator et InDesign à travers des projets pratiques et des flux de travail professionnels."
    },
    "ar": {
      "name": "دورة Adobe Creative Cloud الاحترافية",
      "description": "تعلّم Photoshop وIllustrator وInDesign عبر مشاريع عملية وأساليب عمل احترافية."
    }
  },
  "92": {
    "fr": {
      "name": "Fondamentaux du design graphique",
      "description": "Comprenez la couleur, la typographie, la mise en page et le branding pour créer des designs professionnels dès le premier jour."
    },
    "ar": {
      "name": "أساسيات التصميم الجرافيكي",
      "description": "افهم الألوان والخطوط والتنسيق والهوية البصرية لتصميم أعمال احترافية من اليوم الأول."
    }
  },
  "100": {
    "fr": {
      "name": "Marketing digital professionnel",
      "description": "Maîtrisez le SEO, les réseaux sociaux, l'email marketing et les publicités payantes avec une formation pratique orientée certification."
    },
    "ar": {
      "name": "التسويق الرقمي الاحترافي",
      "description": "أتقن تحسين محركات البحث ووسائل التواصل والبريد التسويقي والإعلانات المدفوعة عبر دورة عملية تؤهلك للشهادة."
    }
  },
  "101": {
    "fr": {
      "name": "Leadership et management d'entreprise",
      "description": "Développez vos compétences en leadership, en communication et en gestion d'équipe pour les organisations modernes."
    },
    "ar": {
      "name": "القيادة وإدارة الأعمال",
      "description": "طوّر مهاراتك في القيادة والتواصل وإدارة الفرق للمؤسسات الحديثة."
    }
  },
  "102": {
    "fr": {
      "name": "LinkedIn Learning — 3 mois",
      "description": "Un accès illimité à des milliers de cours en business, technologie et création pendant trois mois."
    },
    "ar": {
      "name": "LinkedIn Learning — 3 أشهر",
      "description": "وصول غير محدود إلى آلاف الدورات في الأعمال والتقنية والإبداع لمدة ثلاثة أشهر."
    }
  },
  "120": {
    "fr": {
      "name": "Microsoft 365 Personal — 1 an",
      "description": "Word, Excel, PowerPoint, Outlook et 1 To de stockage OneDrive pour un utilisateur sur tous ses appareils."
    },
    "ar": {
      "name": "Microsoft 365 Personal — سنة واحدة",
      "description": "Word وExcel وPowerPoint وOutlook و1 تيرابايت من مساحة OneDrive لمستخدم واحد على جميع أجهزته."
    }
  },
  "121": {
    "fr": {
      "name": "Carte cadeau Google Play — 50 TND",
      "description": "Rechargez votre solde Google Play et achetez des applications, des jeux et des achats intégrés. Code numérique livré instantanément."
    },
    "ar": {
      "name": "بطاقة هدايا Google Play — 50 TND",
      "description": "اشحن رصيد Google Play واشترِ التطبيقات والألعاب والمشتريات داخل التطبيقات. رمز رقمي يُسلَّم فورًا."
    }
  },
  "122": {
    "fr": {
      "name": "Carte cadeau App Store — 50 TND",
      "description": "Carte cadeau Apple App Store et iTunes pour des applications, des jeux, de la musique et des abonnements. Livraison numérique instantanée."
    },
    "ar": {
      "name": "بطاقة هدايا App Store — 50 TND",
      "description": "بطاقة هدايا Apple App Store وiTunes للتطبيقات والألعاب والموسيقى والاشتراكات. تسليم رقمي فوري."
    }
  },
  "130": {
    "fr": {
      "name": "Adobe Creative Cloud — 1 an",
      "description": "Accès complet à Photoshop, Illustrator, Premiere Pro, After Effects et bien plus pendant un an."
    },
    "ar": {
      "name": "Adobe Creative Cloud — سنة واحدة",
      "description": "وصول كامل إلى Photoshop وIllustrator وPremiere Pro وAfter Effects والمزيد لمدة سنة كاملة."
    }
  },
  "131": {
    "fr": {
      "name": "Microsoft 365 Family — 1 an",
      "description": "Partagez Microsoft 365 avec jusqu'à 6 personnes, chacune avec 1 To de stockage OneDrive et les applications Office premium."
    },
    "ar": {
      "name": "Microsoft 365 Family — سنة واحدة",
      "description": "شارك Microsoft 365 مع ما يصل إلى 6 أشخاص، لكل منهم 1 تيرابايت من مساحة OneDrive وتطبيقات Office المميزة."
    }
  },
  "132": {
    "fr": {
      "name": "Norton 360 Deluxe — 1 an",
      "description": "Protégez jusqu'à 5 appareils avec un antivirus, un VPN, un gestionnaire de mots de passe et une sauvegarde cloud pendant un an."
    },
    "ar": {
      "name": "Norton 360 Deluxe — سنة واحدة",
      "description": "احمِ ما يصل إلى 5 أجهزة بمضاد للفيروسات وVPN ومدير كلمات مرور ونسخ احتياطي سحابي لمدة سنة."
    }
  },
  "133": {
    "fr": {
      "name": "QuickBooks Pro — 1 an",
      "description": "Outils de comptabilité, de facturation, de paie et de reporting pour les petites entreprises. Abonnement d'un an."
    },
    "ar": {
      "name": "QuickBooks Pro — سنة واحدة",
      "description": "أدوات محاسبة وفواتير ورواتب وتقارير للشركات الصغيرة. اشتراك لمدة سنة."
    }
  },
  "134": {
    "fr": {
      "name": "Sketch Pro — 1 an",
      "description": "Un an de Sketch pour Mac : édition vectorielle, prototypage et collaboration pour les product designers."
    },
    "ar": {
      "name": "Sketch Pro — سنة واحدة",
      "description": "سنة كاملة من Sketch لنظام Mac: تحرير المتجهات والنماذج الأولية والتعاون لمصممي المنتجات."
    }
  },
  "150": {
    "fr": {
      "name": "Carte cadeau Steam — 50 TND",
      "description": "Ajoutez 50 TND à votre portefeuille Steam et achetez des jeux, des DLC ou des objets intégrés. Code livré instantanément."
    },
    "ar": {
      "name": "بطاقة هدايا Steam — 50 TND",
      "description": "أضف 50 TND إلى محفظة Steam واشترِ الألعاب أو الإضافات أو العناصر داخل اللعبة. يُسلَّم الرمز فورًا."
    }
  },
  "151": {
    "fr": {
      "name": "Carte cadeau Steam — 100 TND",
      "description": "Un code portefeuille Steam de 100 TND pour les jeux que vous aimez. Livraison numérique instantanée après paiement."
    },
    "ar": {
      "name": "بطاقة هدايا Steam — 100 TND",
      "description": "رمز محفظة Steam بقيمة 100 TND للألعاب التي تحبها. تسليم رقمي فوري بعد الدفع."
    }
  },
  "160": {
    "fr": {
      "name": "Carte cadeau Epic Games — 50 TND",
      "description": "Achetez sur l'Epic Games Store avec une carte cadeau de 50 TND. Utilisez-la pour des jeux, des DLC et des V-Bucks."
    },
    "ar": {
      "name": "بطاقة هدايا Epic Games — 50 TND",
      "description": "تسوّق من Epic Games Store ببطاقة هدايا بقيمة 50 TND. استخدمها في الألعاب والإضافات وV-Bucks."
    }
  },
  "161": {
    "fr": {
      "name": "Carte cadeau Epic Games — 100 TND",
      "description": "Une carte cadeau Epic Games Store de 100 TND, livrée instantanément sous forme de code numérique."
    },
    "ar": {
      "name": "بطاقة هدايا Epic Games — 100 TND",
      "description": "بطاقة هدايا من Epic Games Store بقيمة 100 TND، تُسلَّم فورًا كرمز رقمي."
    }
  },
  "170": {
    "fr": {
      "name": "EA Play — 1 mois",
      "description": "Accédez à une bibliothèque de jeux EA, à des essais anticipés et à des récompenses membres avec un abonnement EA Play d'un mois."
    },
    "ar": {
      "name": "EA Play — شهر واحد",
      "description": "استمتع بمكتبة من ألعاب EA وتجارب مبكرة ومكافآت للأعضاء مع اشتراك EA Play لمدة شهر."
    }
  },
  "171": {
    "fr": {
      "name": "EA Play — 12 mois",
      "description": "Un an d'EA Play : plus de jeux, des essais en accès anticipé et 10 % de réduction sur les achats numériques EA."
    },
    "ar": {
      "name": "EA Play — 12 شهرًا",
      "description": "سنة كاملة من EA Play: المزيد من الألعاب وتجارب الوصول المبكر وخصم 10% على مشتريات EA الرقمية."
    }
  },
  "180": {
    "fr": {
      "name": "Xbox Game Pass PC — 1 mois",
      "description": "Jouez à des centaines de jeux PC de qualité avec Xbox Game Pass, y compris les nouveautés dès leur sortie."
    },
    "ar": {
      "name": "Xbox Game Pass PC — شهر واحد",
      "description": "العب مئات من ألعاب الكمبيوتر عالية الجودة مع Xbox Game Pass، بما في ذلك الإصدارات الجديدة يوم إطلاقها."
    }
  },
  "181": {
    "fr": {
      "name": "Xbox Game Pass PC — 3 mois",
      "description": "Trois mois de Xbox Game Pass pour PC avec accès à l'intégralité du catalogue renouvelé et aux remises membres."
    },
    "ar": {
      "name": "Xbox Game Pass PC — 3 أشهر",
      "description": "ثلاثة أشهر من Xbox Game Pass للكمبيوتر مع وصول إلى الكتالوج الكامل المتجدد وخصومات الأعضاء."
    }
  },
  "182": {
    "fr": {
      "name": "Xbox Game Pass Ultimate — 1 mois",
      "description": "Game Pass Ultimate réunit les catalogues PC et console, le multijoueur en ligne et le cloud gaming."
    },
    "ar": {
      "name": "Xbox Game Pass Ultimate — شهر واحد",
      "description": "يجمع Game Pass Ultimate بين مكتبتي الكمبيوتر وأجهزة الألعاب واللعب الجماعي عبر الإنترنت والألعاب السحابية."
    }
  }
};

  const ORIGINAL_TEXT = new WeakMap();
  const ORIGINAL_ATTRIBUTES = new WeakMap();
  const listeners = new Set();

  let language = DEFAULT_LANGUAGE;
  let initialized = false;
  let translating = false;
  let observer = null;
  let originalTitle = '';

  function normalizeLanguage(value) {
    const candidate = String(value || '').toLowerCase();
    return SUPPORTED_LANGUAGES.includes(candidate) ? candidate : DEFAULT_LANGUAGE;
  }

  function getLanguage() {
    return language;
  }

  function getDirection(lang) {
    return normalizeLanguage(lang || language) === 'ar' ? 'rtl' : 'ltr';
  }

  function interpolate(template, vars) {
    if (!vars || typeof template !== 'string') return template;
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      if (Object.prototype.hasOwnProperty.call(vars, key)) return String(vars[key]);
      return match;
    });
  }

  function lookup(message, lang) {
    const text = String(message == null ? '' : message);
    const target = normalizeLanguage(lang || language);
    if (target === DEFAULT_LANGUAGE) return text;
    const dictionary = MESSAGES[target];
    if (dictionary && Object.prototype.hasOwnProperty.call(dictionary, text)) {
      return dictionary[text];
    }
    return text;
  }

  function t(message, vars) {
    return interpolate(lookup(message), vars || undefined);
  }

  function hasTranslation(message, lang) {
    const target = normalizeLanguage(lang || language);
    if (target === DEFAULT_LANGUAGE) return true;
    return Boolean(MESSAGES[target] && Object.prototype.hasOwnProperty.call(MESSAGES[target], message));
  }

  function localizeProduct(product) {
    if (!product || typeof product !== 'object') return product;
    const lang = language;
    if (lang === DEFAULT_LANGUAGE) return product;

    const explicit = product.translations && product.translations[lang];
    const catalog = PRODUCTS[String(product.id)]?.[lang];
    const source = explicit || catalog;
    if (!source) return product;

    return {
      ...product,
      name: source.name || product.name,
      description: source.description || product.description,
    };
  }

  function formatDate(value, options) {
    if (value === null || value === undefined || value === '') return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    const opts = options || { day: '2-digit', month: 'short', year: 'numeric' };
    try {
      return new Intl.DateTimeFormat(LANGUAGE_LOCALES[language] || 'en-GB', opts).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  }

  function formatNumber(value, options) {
    const number = Number(value);
    if (!Number.isFinite(number)) return String(value ?? '');
    try {
      return new Intl.NumberFormat(LANGUAGE_LOCALES[language] || 'en-GB', options || {}).format(number);
    } catch {
      return number.toLocaleString();
    }
  }

  function shouldSkipElement(element) {
    if (!element || element.nodeType !== 1) return false;
    if (['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'NOSCRIPT'].includes(element.tagName)) return true;
    return Boolean(element.closest('[data-i18n-skip]'));
  }

  function preserveWhitespace(original, translated) {
    const leading = original.match(/^\s*/)?.[0] || '';
    const trailing = original.match(/\s*$/)?.[0] || '';
    return `${leading}${translated}${trailing}`;
  }

  function translatedMessage(original) {
    const trimmed = String(original).trim();
    if (!trimmed) return null;
    const normalized = trimmed.replace(/\s+/g, ' ');
    let translated = lookup(trimmed);
    if (translated === trimmed) {
      if (normalized !== trimmed) {
        const alternate = lookup(normalized);
        if (alternate !== normalized) translated = alternate;
        else translated = language === DEFAULT_LANGUAGE ? trimmed : null;
      } else {
        translated = language === DEFAULT_LANGUAGE ? trimmed : null;
      }
    }
    if (translated !== null) return translated;

    // Dynamic server/admin counters that cannot be exact dictionary keys.
    let match = normalized.match(/^Showing (\d+)[–-](\d+) of (\d+)$/);
    if (match) {
      return interpolate(lookup('Showing {start}–{end} of {total}'), {
        start: match[1], end: match[2], total: match[3],
      });
    }
    match = normalized.match(/^(\d+)\s+order\(s\)$/);
    if (match) return interpolate(lookup('{count} order(s)'), { count: match[1] });
    match = normalized.match(/^(\d+)\s+product\(s\)$/);
    if (match) return interpolate(lookup('{count} product(s)'), { count: match[1] });
    match = normalized.match(/^(\d+)\s+result(?:s)? found$/);
    if (match) return interpolate(lookup('{count} result(s) found'), { count: match[1] });
    return null;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    const parent = node.parentElement;
    if (!parent || shouldSkipElement(parent)) return;

    let original = ORIGINAL_TEXT.get(node);
    if (original === undefined) {
      original = node.nodeValue || '';
      ORIGINAL_TEXT.set(node, original);
    }

    const translated = translatedMessage(original);
    if (translated === null) return;

    const next = preserveWhitespace(original, translated);
    if (node.nodeValue !== next) node.nodeValue = next;
  }

  function shouldSkipAttributeElement(element) {
    if (!element || element.nodeType !== 1) return true;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(element.tagName)) return true;
    return Boolean(element.closest('[data-i18n-skip]'));
  }

  function translateAttribute(element, attribute) {
    if (!element || element.nodeType !== 1 || !element.hasAttribute(attribute)) return;
    if (shouldSkipAttributeElement(element)) return;

    let store = ORIGINAL_ATTRIBUTES.get(element);
    if (!store) {
      store = {};
      ORIGINAL_ATTRIBUTES.set(element, store);
    }
    if (store[attribute] === undefined) store[attribute] = element.getAttribute(attribute);

    const original = store[attribute];
    const trimmed = String(original || '').trim();
    if (!trimmed) return;
    const translated = translatedMessage(trimmed);
    if (translated === null) return;
    const next = preserveWhitespace(original, translated);
    if (element.getAttribute(attribute) !== next) element.setAttribute(attribute, next);
  }

  function translateElement(element) {
    if (!element || element.nodeType !== 1) return;

    if (!shouldSkipElement(element)) {
      const key = element.getAttribute('data-i18n');
      if (key) {
        const value = t(key);
        if (element.textContent !== value) element.textContent = value;
      }
    }

    const attrPairs = [
      ['data-i18n-placeholder', 'placeholder'],
      ['data-i18n-title', 'title'],
      ['data-i18n-aria-label', 'aria-label'],
    ];
    for (const [dataAttribute, attribute] of attrPairs) {
      const dataKey = element.getAttribute(dataAttribute);
      if (dataKey) {
        const value = t(dataKey);
        if (element.getAttribute(attribute) !== value) element.setAttribute(attribute, value);
      } else {
        translateAttribute(element, attribute);
      }
    }
  }

  function translateDom(root) {
    if (!root) return;
    const scope = root.nodeType === 9 ? root.body || root.documentElement : root;
    if (!scope) return;

    translating = true;
    try {
      if (scope.nodeType === 1) translateElement(scope);

      const walker = document.createTreeWalker(
        scope,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
          acceptNode(node) {
            if (node.nodeType === 1) {
              if (shouldSkipElement(node)) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_SKIP;
            }
            if (node.nodeType === 3) {
              if (node.parentElement && shouldSkipElement(node.parentElement)) return NodeFilter.FILTER_REJECT;
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          },
        }
      );

      let node = walker.nextNode();
      while (node) {
        if (node.nodeType === 3) translateTextNode(node);
        node = walker.nextNode();
      }

      scope.querySelectorAll?.('*').forEach(translateElement);
      if (scope.matches?.('[data-i18n]')) translateElement(scope);
    } finally {
      translating = false;
    }
  }

  function updateLanguageControls() {
    document.querySelectorAll('#language-select, [data-language-select]').forEach((select) => {
      if (select.value !== language) select.value = language;
    });
  }

  function notifyListeners() {
    listeners.forEach((listener) => {
      try { listener(language); } catch (error) { console.error('[i18n] listener failed:', error); }
    });
    try {
      window.dispatchEvent(new CustomEvent('dima:languagechange', { detail: { language, direction: getDirection() } }));
    } catch { /* ignore */ }
  }

  function setLanguage(nextLanguage, options = {}) {
    const { persist = true, silent = false } = options;
    language = normalizeLanguage(nextLanguage);

    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    document.documentElement.dataset.language = language;
    document.body?.classList.toggle('lang-ar', language === 'ar');

    if (persist) {
      try { localStorage.setItem('language', language); } catch { /* ignore */ }
    }

    translateDom(document.body);
    updateLanguageControls();
    if (originalTitle) document.title = lookup(originalTitle);
    if (!silent) notifyListeners();
  }

  function bindLanguageControls() {
    document.querySelectorAll('#language-select, [data-language-select]').forEach((select) => {
      if (select.dataset.i18nBound === 'true') return;
      select.dataset.i18nBound = 'true';
      select.value = language;
      select.addEventListener('change', () => setLanguage(select.value));
    });
  }

  function startObserver() {
    if (observer || !document.body || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver((mutations) => {
      if (translating) return;
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === 1) translateDom(node);
          else if (node.nodeType === 3 && node.parentElement) translateTextNode(node);
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    let stored = null;
    try { stored = localStorage.getItem('language'); } catch { /* ignore */ }
    language = normalizeLanguage(stored || DEFAULT_LANGUAGE);

    document.documentElement.lang = language;
    document.documentElement.dir = getDirection(language);
    document.documentElement.dataset.language = language;
    document.body?.classList.toggle('lang-ar', language === 'ar');

    bindLanguageControls();
    translateDom(document.body);
    originalTitle = document.title;
    if (originalTitle) document.title = lookup(originalTitle);
    startObserver();
  }

  function onLanguageChange(listener) {
    if (typeof listener !== 'function') return () => {};
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  global.DimaI18n = {
    supported: SUPPORTED_LANGUAGES.slice(),
    t,
    hasTranslation,
    lookup,
    localizeProduct,
    formatDate,
    formatNumber,
    translateDom,
    setLanguage,
    getLanguage,
    getDirection,
    onLanguageChange,
    init,
    get messages() { return MESSAGES; },
    get products() { return PRODUCTS; },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})(window);
