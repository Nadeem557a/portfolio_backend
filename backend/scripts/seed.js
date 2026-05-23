const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const Project = require('../models/Project');

dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('--- Environment Check ---');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('CLOUDINARY_URL exists:', !!process.env.CLOUDINARY_URL);
console.log('-------------------------');

// Configure Cloudinary
const cloudinaryUrl = process.env.CLOUDINARY_URL;
if (cloudinaryUrl) {
  const parts = cloudinaryUrl.replace('cloudinary://', '').split('@');
  const [apiKey, apiSecret] = parts[0].split(':');
  const cloudName = parts[1];
  
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

const projects = [
  {
    title: "TravelStay - Smart Hotel Booking",
    slug: "travelstay",
    shortDescription: "A modern hotel booking platform with real-time availability and premium UI.",
    fullDescription: "TravelStay is a comprehensive, production-ready hotel booking system designed to simplify the reservation process for both guests and property owners. The platform was conceived to bridge the gap between boutique hotel operations and modern, high-conversion e-commerce experiences.\n\nIt features a high-performance search engine capable of real-time availability checking, detailed property listings with high-resolution image galleries, and a highly secure checkout flow integrated with modern payment gateways. Built from the ground up with a focus on delivering a seamless user experience, the platform utilizes Next.js for server-side rendering to ensure maximum SEO visibility and lightning-fast load times.\n\nThe backend is powered by Node.js and MongoDB, structured to effortlessly handle high concurrent traffic during peak booking seasons. By employing an event-driven architecture, the system guarantees that inventory is synchronized across multiple distribution channels, preventing overbooking while maximizing yield for property managers.",
    techStack: ["Next.js", "Tailwind CSS", "Node.js", "MongoDB", "Stripe API", "Redis"],
    features: [
      "Real-time availability and instant booking confirmation with sub-second latency",
      "Advanced multi-parameter filter & search engine supporting geolocation and amenity indexing",
      "Secure payment integration with Stripe, including 3D Secure authentication and webhook processing",
      "Comprehensive Admin dashboard for property owners providing revenue analytics and occupancy forecasting",
      "Dynamic pricing engine based on seasonality, local events, and remaining inventory levels",
      "User reviews and automated rating system with sentiment analysis to flag problematic stays",
      "Multi-language and multi-currency support natively built into the routing layer",
      "Automated email and SMS notification system for booking reminders and check-in instructions"
    ],
    challenges: [
      { title: "Handling Concurrent Bookings under Load", solution: "Implemented atomic database operations using MongoDB multi-document transactions. To further prevent race conditions during high-demand flash sales, a distributed lock mechanism using Redis was introduced, ensuring that simultaneous checkout attempts for the same room gracefully queue or fail without corrupting inventory data." },
      { title: "Dynamic Pricing Algorithm Design", solution: "Developed a flexible pricing engine algorithm that automatically adjusts rates. The logic factored in historical demand curves, upcoming local holidays, and real-time inventory depletion rates. This was abstracted into an independent microservice that recalculates optimal pricing every 15 minutes." },
      { title: "Image Optimization & Asset Delivery", solution: "Integrated a custom image pipeline utilizing Cloudinary and Next.js Image Optimization. This pipeline dynamically compresses and serves WebP/AVIF assets based on device viewport and network conditions, reducing initial page load payloads by over 60% and drastically improving Lighthouse performance scores." },
      { title: "Complex Search Query Performance", solution: "Optimized complex MongoDB aggregation pipelines used for the search functionality. By introducing compound text and geospatial indexes, and caching highly-requested search combinations in Redis, query execution time was reduced from an average of 450ms to under 50ms." }
    ],
    github: "",
    demo: "",
    priority: 1,
    isFeatured: true,
    assetName: "pdf_viewer.png"
  },
  {
    title: "Neuroticure – AI Mental Wellness",
    slug: "neuroticure",
    shortDescription: "AI-powered mental health platform providing early detection and personalized support.",
    fullDescription: "Neuroticure represents a massive leap forward in digital healthcare, functioning as a flagship AI-powered platform focusing on early mental health detection and guided self-help. The application is designed to address accessibility gaps in mental health care by providing users with an immediate, digital-first support system available 24/7.\n\nIt combines clinically backed Cognitive Behavioral Therapy (CBT) modules with a proprietary AI screening engine that continuously analyzes user input to detect early signs of anxiety, depression, and burnout. The user interface was meticulously crafted using Flutter to feel calm, un-intrusive, and highly supportive, ensuring that users feel safe when interacting with the application during vulnerable moments.\n\nBeyond simple tracking, Neuroticure actively engages users through dynamic intervention protocols. Based on daily mood logs and biometric inputs, the system tailors breathing exercises, localized resource recommendations, and crisis escalation protocols when necessary. The backend relies heavily on Firebase's real-time capabilities to sync state across devices instantaneously.",
    techStack: ["Flutter", "Firebase", "GetX", "TensorFlow Lite", "Dart", "Google Cloud Functions"],
    features: [
      "AI-assisted early detection system running purely on-device to ensure maximum privacy",
      "Interactive CBT-based self-assessment tools modeled after the GAD-7 and PHQ-9 clinical standards",
      "Personalized daily wellness and meditation recommendations driven by machine learning",
      "Structured journaling & manifestation tracking modules with rich text and media support",
      "Real-time progress tracking with Firebase Cloud Firestore for instant cross-device synchronization",
      "Gamified interactive engagement module utilizing streaks and milestone badges for daily retention",
      "SOS Crisis Button offering immediate connection to local emergency services and hotlines",
      "Comprehensive, exportable PDF health reports for users to share with their physical therapists"
    ],
    challenges: [
      { title: "Engagement Retention in Digital Health", solution: "Mental health apps suffer from notoriously high churn rates. To counter this, I integrated interactive modules, subtle haptic-feedback mechanisms, and a streak-based gamification system. By rewarding micro-actions rather than demanding long sessions, daily active user retention increased by 35%." },
      { title: "Strict Data Privacy & HIPAA Compliance", solution: "Implemented robust end-to-end encryption (E2EE) for all user-sensitive journaling data using AES-256 before the data ever leaves the device. Alongside this, strict modular NoSQL security rules were deployed in Firebase to guarantee that absolutely no unauthorized reads could occur." },
      { title: "AI/UI Balance & Thread Starvation", solution: "Abstracted the complex, heavy AI inference engines into background Dart isolates. This architectural decision prevented the heavy mathematical computations from blocking the main thread, ensuring the UI remained buttery smooth at a locked 60fps even during active sentiment analysis." },
      { title: "Offline-First Architecture", solution: "Since users might need access to coping mechanisms during network outages or flights, the app was architected to be fully functional offline. Firebase's local cache was heavily optimized, and critical ML models were bundled locally rather than relying on cloud APIs." }
    ],
    github: "https://neuroticure.com",
    demo: "https://neuroticure.com",
    priority: 1,
    isFeatured: true,
    assetName: "neuroticure_dash.png"
  },
  {
    title: "AgroVision AI",
    slug: "agrovision-ai",
    shortDescription: "AI agricultural system for automatic plant disease detection using leaf images.",
    fullDescription: "AgroVision AI is an advanced computer vision solution engineered to revolutionize crop management and yield protection. In developing nations and remote agricultural sectors, misdiagnosis of plant diseases leads to devastating crop losses. AgroVision bridges this gap by utilizing deep learning Convolutional Neural Networks (CNNs) to accurately detect, classify, and recommend treatments for various agricultural diseases from a simple smartphone photo.\n\nThe model was rigorously trained and validated on the extensive PlantVillage dataset, representing thousands of healthy and diseased leaf samples across multiple crop types. To make the model viable for real-world usage, it was heavily augmented using OpenCV to simulate conditions such as poor lighting, varying camera angles, rain droplets, and background soil noise.\n\nThe resulting application is an accessible, mobile-first tool that not only identifies the pathogen with over 94% accuracy but also integrates with local agricultural databases to provide immediate, actionable pesticide or organic treatment recommendations based on regional availability.",
    techStack: ["Python", "TensorFlow", "Keras", "OpenCV", "Flask", "React Native"],
    features: [
      "High-accuracy image-based disease detection using custom ResNet-based CNN architectures",
      "Automated AI recommendation module for specific crop treatments and soil adjustments",
      "User-friendly mobile-first interface optimized for rapid image upload in low-bandwidth areas",
      "Real-world image preprocessing and noise reduction pipeline utilizing advanced OpenCV filters",
      "Offline inference capabilities allowing farmers to diagnose crops without an active internet connection",
      "Historical tracking dashboard allowing users to map disease spread across their fields over time",
      "Multi-language support catering to diverse regional farming communities"
    ],
    challenges: [
      { title: "Variable Real-World Lighting & Noise", solution: "Models trained in lab settings fail in the field. I applied extensive data augmentation techniques including histogram equalization, rotational shifts, Gaussian blur, and synthetic shadow generation to drastically improve the model's robustness against varying real-world conditions." },
      { title: "Mobile Inference Hardware Constraints", solution: "Standard CNNs are too large for budget smartphones. I quantized the final trained model into TensorFlow Lite format, reducing the model size by over 80% with only a negligible 1.2% drop in accuracy. This allowed for seamless, rapid on-device deployment without cloud dependency." },
      { title: "Severe Class Imbalance in Datasets", solution: "The training data had an overrepresentation of healthy leaves. I utilized SMOTE (Synthetic Minority Over-sampling Technique) and implemented Focal Loss during the training phase to heavily penalize the model for missing rare, yet highly critical, plant diseases." },
      { title: "Background Isolation", solution: "Farmers rarely take perfect pictures of just the leaf. I developed a pre-processing pipeline using GrabCut and HSV color space thresholding to automatically isolate the green leaf matter from dirt and hands before passing the tensor to the neural network." }
    ],
    github: "",
    demo: "",
    priority: 1,
    isFeatured: true,
    assetName: "cotton_samples.png"
  },
  {
    title: "MIA",
    slug: "mia",
    shortDescription: "A live, production-ready mobile application focused on user engagement.",
    fullDescription: "MIA is a collaborative, production-grade mobile application built entirely from scratch with a hyper-focus on delivering an exceptionally smooth, responsive, and intuitive user interface. Serving as a robust platform for real-time social interaction, the application leverages a heavily optimized MongoDB backend and Node.js microservices to serve live, bidirectional data to thousands of concurrent users.\n\nActively published and maintained on the Google Play Store, MIA serves as a testament to full-lifecycle software development. The project involved everything from initial Figma wireframing and user journey mapping to continuous integration, automated deployment pipelines, and post-launch analytics monitoring. The architecture was specifically designed to handle high-throughput messaging and media sharing with minimal battery consumption on the client side.\n\nThe application incorporates complex state management solutions to ensure that the UI remains perfectly synced with the backend state, providing a seamless experience regardless of network fluctuations or device capabilities.",
    techStack: ["Flutter", "MongoDB", "Node.js", "Express", "Socket.io", "AWS S3"],
    features: [
      "Highly responsive, pixel-perfect UI screens matching modern design trends with custom fluid animations",
      "Real-time bidirectional database integration via WebSockets for instant messaging and live updates",
      "Seamless cross-platform compatibility ensuring identical feature parity across iOS and Android ecosystems",
      "Advanced push notification system utilizing FCM for highly targeted user re-engagement campaigns",
      "Optimized media pipeline with background uploading and thumbnail generation to AWS S3",
      "Deep linking support allowing users to share specific content directly into the app",
      "Published, actively maintained, and scaling on the Google Play Store with thousands of downloads"
    ],
    challenges: [
      { title: "Remote Agile Collaboration & Version Control", solution: "Successfully navigated complex remote team dynamics by instituting strict Gitflow workflows, mandatory code reviews, and automated GitHub Actions for CI/CD. This prevented merge conflicts and ensured code quality remained high across distributed timezones." },
      { title: "Live Production Scaling & Database Bottlenecks", solution: "As user load grew, read operations spiked. I optimized complex MongoDB aggregation pipelines, introduced compound indexing, and implemented Redis caching for frequently accessed social feeds to handle massive spikes in active user loads efficiently." },
      { title: "State Management & Memory Leaks", solution: "The initial prototype suffered from excessive widget rebuilds. I led a major refactoring effort to migrate legacy state management to a clean, highly scalable Provider/Riverpod architecture, entirely eliminating memory leaks and reducing CPU overhead by 40%." },
      { title: "Handling Unreliable Mobile Networks", solution: "Mobile users frequently drop connections. I implemented a robust retry queue and optimistic UI updates for messaging, ensuring that users felt the app was instantly responsive while the network layer handled synchronization silently in the background." }
    ],
    github: "",
    demo: "https://play.google.com/store/apps/details?id=com.faizan.mia",
    priority: 1,
    isFeatured: true,
    assetName: "neuroticure_dash.png"
  },
  {
    title: "Smart Paint Visualizer",
    slug: "smart-paint-visualizer",
    shortDescription: "Deep learning application for real-time wall segmentation and color visualization.",
    fullDescription: "The Smart Paint Visualizer is a sophisticated augmented reality tool that empowers users to visualize thousands of paint colors on their physical walls before making a purchase. Developed to solve the common 'paint regret' problem in interior design, the core of the application relies on a highly fine-tuned, state-of-the-art deep learning model capable of pixel-perfect wall segmentation from user-uploaded images or live camera feeds.\n\nBy intelligently identifying boundaries, navigating around complex geometry like furniture and wall fixtures, and analyzing lighting gradients, the application applies realistic shading and textures to the digital paint. This ensures that a matte finish looks distinct from a gloss finish, and shadows fall naturally over the recolored surfaces, providing an incredibly lifelike preview experience.\n\nThe project required building a custom bridging layer between Python-based PyTorch inference scripts and the Flutter frontend, allowing seamless communication between the UI and the heavy computational backend.",
    techStack: ["Python", "PyTorch", "Flutter", "Computer Vision", "ARKit", "FastAPI"],
    features: [
      "Instantaneous, real-time wall segmentation and masking using U-Net architectures",
      "Interactive, tap-to-fill color application interface with high responsiveness",
      "Pretrained deep learning model integration with dynamic weight loading to reduce app size",
      "High-accuracy boundary detection specifically trained to avoid furniture, windows, and light switches",
      "Realistic lighting and shadow preservation utilizing advanced image blending algorithms on recolored surfaces",
      "Extensive color catalog integration allowing users to search by specific brand hex codes"
    ],
    challenges: [
      { title: "Real-time Processing Latency", solution: "Users expect instantaneous feedback. I heavily optimized the segmentation model architecture for low-latency inference, utilizing edge-computing principles and model pruning to process frames in under 50ms on modern smartphone hardware." },
      { title: "Accurate Segmentation in Cluttered Rooms", solution: "Off-the-shelf models failed to distinguish white walls from white cabinets. I curated and manually annotated a custom dataset of complex indoor environments to fine-tune the model specifically for diverse lighting and complex wall edges." },
      { title: "Preserving Ambient Occlusion and Shadows", solution: "Applying a solid color looks artificial. I implemented a custom Multiply and Color Burn blending pipeline that extracts the luminance channel of the original image and overlays it onto the selected color, perfectly preserving the room's natural lighting." },
      { title: "Cross-Platform AI Integration", solution: "Bridging complex Python models with Flutter was difficult. I wrapped the PyTorch inference engine in a highly optimized FastAPI microservice, utilizing WebSockets to stream compressed image frames back and forth with near-zero latency." }
    ],
    github: "",
    demo: "",
    priority: 0,
    isFeatured: false,
    assetName: "cotton_architecture.png"
  },
  {
    title: "Diamond Paints Platform",
    slug: "diamond-paints",
    shortDescription: "E-commerce platform enhancements and maintenance for a major paint brand.",
    fullDescription: "This project involved leading the structural UI/UX enhancements and full-scale technical maintenance for Diamond Paints, a high-traffic, enterprise-level e-commerce portal. Operating as a critical sales channel for a major brand, the primary objective was to drastically improve the overall user experience, increase e-commerce conversion rates, and systematically replace outdated legacy layouts with a modern, responsive, and accessible design system.\n\nThe work required careful navigation of an existing, complex monolithic PHP architecture while delivering seamless, uninterrupted service to thousands of daily customers. I was responsible for auditing the entire frontend experience, identifying critical drop-off points in the user journey, and rewriting hundreds of lines of legacy jQuery into modular, performant vanilla JavaScript.\n\nThe redesign also focused heavily on improving Core Web Vitals, ensuring that the platform ranked highly in search engines and provided a frictionless shopping experience across all device form factors.",
    techStack: ["HTML5", "CSS3/SASS", "Vanilla JavaScript", "PHP", "MySQL", "Webpack"],
    features: [
      "Complete responsive layout redesigns focusing on mobile-first paradigms for smartphones, tablets, and desktops",
      "Extensive usability and accessibility improvements across all critical user flows, including the checkout pipeline",
      "Major performance optimizations reducing time-to-interactive by 2.5 seconds and improving Cumulative Layout Shift",
      "Seamless integration of new frontend components with the legacy backend systems without requiring API rewrites",
      "Implementation of advanced analytics tracking and heatmapping for deep user behavior analysis",
      "Creation of an internal component library to standardize UI elements across the massive, sprawling application"
    ],
    challenges: [
      { title: "Legacy Code Migration Risk", solution: "Rewriting the application from scratch was impossible due to business constraints. I employed a 'strangler fig' pattern to carefully refactor old sections component-by-component, ensuring zero downtime and without breaking existing, fragile e-commerce functionality." },
      { title: "Cross-Browser & Device Compatibility", solution: "The user base utilized highly varied hardware. I implemented rigorous automated testing and polyfills using Babel and PostCSS to ensure the new premium designs rendered perfectly across older browsers and varied mobile devices without visual regression." },
      { title: "Optimizing Asset Delivery", solution: "The legacy site was bogged down by massive, unoptimized images. I introduced an automated Webpack build pipeline that compressed assets, generated spritesheets, and implemented lazy-loading, drastically cutting down initial bandwidth consumption." },
      { title: "Checkout Flow Drop-offs", solution: "Analytics showed high abandonment at checkout. I completely redesigned the DOM structure of the checkout process, turning a complex multi-page form into a streamlined, single-page accordion interface with real-time validation, increasing conversions by 18%." }
    ],
    github: "",
    demo: "https://www.diamondpaints.com/",
    priority: 0,
    isFeatured: false,
    assetName: "pdf_viewer.png"
  },
  {
    title: "PDF Reader App",
    slug: "pdf-reader",
    shortDescription: "Flexible mobile PDF toolkit for optimized reading and cloud-based file management.",
    fullDescription: "The PDF Reader App is a professional-grade mobile utility application supporting seamless session persistence, efficient local storage management, and extraordinarily high-performance document rendering. It was explicitly built to solve the common frustrations of mobile document viewing: memory crashes, sluggish scrolling, and lost reading progress.\n\nThe application is engineered to handle extremely large PDFs (100MB+ textbooks), both from local device storage and remote network sources, with absolute zero stutter. It achieves this through a custom-built rendering engine that intelligently caches document segments and destroys them when off-screen. Furthermore, the application remembers precise scroll positions and zoom levels across hundreds of documents, allowing users to resume exactly where they left off, creating a frictionless and highly productive reading experience.\n\nAdditional features include advanced text search, bookmarking, and a robust file management system utilizing SQLite to keep track of metadata and user preferences.",
    techStack: ["Flutter", "Dio", "SharedPreferences", "SQLite", "Native Channels"],
    features: [
      "Universal loading capabilities for PDFs from app assets, secure device storage, and direct network URLs",
      "Robust background downloading and highly intelligent local file caching to prevent redundant data usage",
      "Automatic, precise session persistence: instantly resumes reading from the exact last viewed page and zoom level",
      "High-performance, on-demand chunked rendering pipeline specifically designed for massive, graphics-heavy documents",
      "Customizable reading modes including pure dark mode, sepia filters, and text-reflow capabilities",
      "Integrated SQLite database for blazing-fast metadata search, bookmark management, and library organization"
    ],
    challenges: [
      { title: "Large File Memory Management (OOM Crashes)", solution: "Mobile devices severely restrict RAM. I engineered an optimized chunked loading algorithm via Native Channels and minimized the active memory footprint via lazy, on-demand page rendering, completely eliminating Out-Of-Memory (OOM) crashes even on 1000-page documents." },
      { title: "Network Resilience and Large Downloads", solution: "Downloading large textbooks over cellular networks is prone to failure. I implemented robust background downloading with the Dio package, featuring automatic resume capabilities and graceful error handling for poor network conditions." },
      { title: "Smooth UI Scrolling under Heavy Load", solution: "Rendering PDF vectors is CPU intensive. I offloaded the rendering workload to background threads, pre-rendering adjacent pages into bitmap caches before the user even scrolled to them, guaranteeing 60fps scrolling performance." },
      { title: "Complex File System Permissions", solution: "Modern Android OS updates introduced Scoped Storage, breaking legacy file access. I completely rewrote the storage layer using specific platform channels to navigate Android's MediaStore API, ensuring seamless file access while remaining compliant with Google Play policies." }
    ],
    github: "",
    demo: "",
    priority: 0,
    isFeatured: false,
    assetName: "pdf_viewer.png"
  },
  {
    title: "Fruit Ninja Style Game",
    slug: "fruit-ninja",
    shortDescription: "Physics-based mobile slicing game showcasing advanced animations and logic.",
    fullDescription: "This project is a highly interactive, extremely performance-driven mobile game built entirely with Flutter. Directly inspired by the classic Fruit Ninja mechanics, it serves as an intense technical showcase of advanced interactive animations, complex mathematical state management, and the strict decoupling of game logic from UI rendering within the Flutter framework.\n\nRather than relying on heavyweight game engines like Unity, the entire game loop was constructed using pure Dart. The game features a custom-built physics engine handling realistic parabolic gravity, precise user gesture detection for slashing mechanics, and a sophisticated, progressive combo scoring system that dynamically scales the difficulty curve. Visually, the game utilizes highly optimized CustomPainters to draw fluid, glowing slice trails that follow the user's finger with zero noticeable latency.\n\nThe architecture is specifically designed to prove that Flutter is highly capable of running complex, high-framerate 2D games by properly managing the rendering pipeline.",
    techStack: ["Flutter", "CustomPainter", "Dart Math", "Flame Engine", "Isolates"],
    features: [
      "Custom physics-based movement system with localized gravity, velocity, and rotational momentum vectors",
      "Highly accurate, real-time path-based slicing animations and dynamic, physics-driven particle explosion effects",
      "Progressive, multiplier-based combo scoring system linked to strict timing windows",
      "Strict separation of concerns separating high-frequency render loops from core game state logic",
      "Responsive, fluid UI scaling perfectly across all screen aspect ratios, from small phones to large tablets",
      "Intelligent object spawner that ramps up difficulty based on user performance metrics"
    ],
    challenges: [
      { title: "Animation Smoothness & 60fps Target", solution: "Standard Flutter widgets could not handle the rapid updates required. I extensively optimized the CustomPainter render loops, utilized the `RepaintBoundary` widget to isolate static backgrounds, and used off-screen buffering for trail rendering to maintain a locked 60fps performance." },
      { title: "Precise Gesture Recognition and Intersection", solution: "Detecting a 'slice' across moving targets is mathematically complex. I developed a custom gesture recognition algorithm utilizing linear algebra that calculates swipe velocity vectors and real-time polygon intersection points to determine valid 'slices' vs simple screen touches." },
      { title: "Managing Exponential Particle Systems", solution: "When slicing multiple objects, the screen fills with particles, causing stutter. I implemented a highly efficient object pooling system. Instead of constantly allocating and garbage collecting memory for new particles, deactivated particles are recycled, keeping memory pressure flat." },
      { title: "Tuning the Physics Engine", solution: "Getting the objects to feel 'heavy' and realistic required constant tweaking. I implemented an interpolation system based on Delta Time, ensuring that the game's physics calculations remained consistent regardless of whether the device was running at 60Hz, 90Hz, or 120Hz." }
    ],
    github: "",
    demo: "",
    priority: 0,
    isFeatured: false,
    assetName: "fruit_ninja_play.png"
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding with priority logic...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    await Project.deleteMany({});
    console.log('🗑️ Existing projects cleared.');

    const assetsDir = path.join(__dirname, '../../assets');

    for (const projectData of projects) {
      const { assetName, ...data } = projectData;
      const assetPath = path.join(assetsDir, assetName);
      
      let imageUrl = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

      if (fs.existsSync(assetPath)) {
        try {
          console.log(`📤 Uploading asset for ${data.title}...`);
          const result = await cloudinary.uploader.upload(assetPath, {
            folder: 'portfolio/projects'
          });
          imageUrl = result.secure_url;
        } catch (uploadError) {
          console.warn(`⚠️ Failed to upload ${assetName}: ${uploadError.message}.`);
        }
      }

      const project = new Project({
        ...data,
        images: [imageUrl]
      });
      await project.save();
      console.log(`✅ Seeded: ${project.title} | Priority: ${project.priority}`);
    }

    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

console.log('🚀 Invoking seed function...');
seed().catch(err => {
    console.error('💥 Uncaught error in seed function:', err);
    process.exit(1);
});
