import { NextResponse } from "next/server";
import { ConnectDB } from "@/lib/db/ConnectDB";

// Models
import SiteSettingsModel from "@/lib/models/SiteSetting";
import HomeBannerModel from "@/lib/models/HomeBanner";
import AboutUsModel from "@/lib/models/AboutUsModel";
import TeamModel from "@/lib/models/TeamModel";
import StatsModel from "@/lib/models/StatModel";
import InnerPageModel from "@/lib/models/InnerPageBanner";
import BlogsModel from "@/lib/models/BlogModel";
import CategoryModel from "@/lib/models/CategoryModel";
import TestimonialModel from "@/lib/models/TestimonialModel";
import AwardModel from "@/lib/models/AwardsModel";
import WebpopupsModel from "@/lib/models/PopupsModel";
import VideoModel from "@/lib/models/VideoModel";
import AdvertisementModel from "@/lib/models/AdvertisementModel";
import GalleryModel from "@/lib/models/Gallery";
import GalleryCategoryModel from "@/lib/models/GalleryCategoryModel";
import FaqModel from "@/lib/models/FaqsModel";
import AdminServicesModel from "@/lib/models/AdminServiceModel";
import LeadsModel from "@/lib/models/LeadsModel";
import AmcsLogoModel from "@/lib/models/AmcsLogos";
import SocialMediaModel from "@/lib/models/SocialMedia";
import MissionVisionModel from "@/lib/models/MissionVissionModel";
import UserModel from "@/lib/models/UserModel";
import PermissionModel from "@/lib/models/Permissions";
import LoginGroupModel from "@/lib/models/LoginModel";

// --- GLOBAL DUMMY ASSETS ---
const DUMMY_IMAGE = "https://www.redvisiontechnologies.com/assets/images/backgrounds/about.webp";
const DUMMY_TEAM = "https://www.redvisiontechnologies.com/assets/images/woman.webp";
const DUMMY_AWARD = "https://www.redvisiontechnologies.com/assets/images/5star.png";
const DUMMY_LINK = "https://example.com";

/** 
 * 1. SEED_DATA: This is where you put your specific overrides.
 * If you leave a module out of here, the DEFAULT_DUMMY_DATA below will be used.
 */
const SEED_DATA = {
    USER: {
        username: "Anuj@123",
        email: "Anuj.bansal@redvisionglobal.com",
        passwordHash: "$2b$10$kIomwFLSfg8a2JjxCsNIROuXvj3yr699JGIGz4z6lx3jucw.mfG1e",
        role: "DEVADMIN",
        failedLoginAttempts: 0,
        failedOtpAttempts: 0,
        sessionsversion: {
            "mlf1zuiu-WyQFNTfbFXnNXeXZ": {
                version: 1,
                createdAt: new Date("2026-02-09T10:53:03.942Z"),
                expiresAt: new Date("2026-02-09T11:53:03.942Z")
            }
        }
    },
    SITE_SETTINGS: {
        name: "Anuj Bansal",
        description: "Leading financial advisor providing expert guidance on wealth management and strategic planning.",
        websiteName: "WealthElite",
        email: "Anuj.bansal@redvisionglobal.com",
        mobile: "+91 98765 43210",
        address: "Bhopal, Madhya Pradesh, India",
        image: { url: "https://www.redvisiontechnologies.com/assets/images/logo-white-full.png", public_id: "logo" }
    }
};

/**
 * 2. DEFAULT_DUMMY_DATA: Common dummy data used for ALL websites.
 * This ensures the seeder always produces a full website even with empty SEED_DATA.
 */
const DEFAULT_DUMMY_DATA = {
    SITE_SETTINGS: {
        name: "Financial Advisor",
        description: "Professional financial advisory services protecting and growing your wealth through strategic planning and expert management.",
        websiteName: "MyWealth",
        email: "contact@example.com",
        alternateEmail: "support@example.com",
        mobile: "+91 00000 00000",
        alternateMobile: "+91 00000 00000",
        whatsAppNo: "910000000000",
        address: "Regional Office, India",
        websiteDomain: "example.com",
        siteurl: "https://example.com/",
        image: { url: "https://www.redvisiontechnologies.com/assets/images/logo-white-full.png", public_id: "logo" }
    },
    MISSION_VISION: {
        mission: "To provide ethical and professional financial guidance to every client.",
        vision: "To be the benchmark of excellence in financial planning and fund management.",
        values: "Transparency, Integrity, Proficiency, and Client Success."
    },
    ABOUT: {
        title: "Pioneering Your Financial Future",
        description: "We are a team of certified financial experts dedicated to helping individuals and businesses achieve their financial aspirations through evidence-based planning. With over two decades of experience in global markets, we combine cutting-edge technology with deep human insights to protect your assets and accelerate your growth. Our client-centric approach ensures that every strategy is tailored to your unique lifecycle needs, from wealth accumulation to legacy preservation. We believe in transparency, discipline, and the power of compounding to transform your financial dreams into reality.",
        image: { url: DUMMY_IMAGE, public_id: "about" }
    },
    AMC_LOGOS: [
        { logoname: "HDFC Mutual Fund", logourl: DUMMY_LINK, status: true, logo: DUMMY_IMAGE, logocategory: "MF" },
        { logoname: "SBI Mutual Fund", logourl: DUMMY_LINK, status: true, logo: DUMMY_IMAGE, logocategory: "MF" }
    ],
    INNER_PAGE: { title: "Global Page", image: { url: DUMMY_IMAGE, public_id: "ib" } },
    TEAM: [
        { name: "Executive Lead", designation: "Chief Strategist", experience: 15, description: "Leading the core financial strategy and client relations with a focus on long-term sustainability.", image: { url: DUMMY_TEAM, public_id: "t1" } },
        { name: "Portfolio Manager", designation: "Market Analyst", experience: 12, description: "Focusing on asset allocation and market performance tracking across diverse asset classes.", image: { url: DUMMY_TEAM, public_id: "t2" } },
        { name: "Risk Assessment Head", designation: "Compliance Officer", experience: 10, description: "Ensuring all investment strategies align with regulatory standards and risk tolerances.", image: { url: DUMMY_TEAM, public_id: "t3" } },
        { name: "Wealth Specialist", designation: "Tax Planner", experience: 8, description: "Optimizing wealth structures for tax efficiency and future legacy planning.", image: { url: DUMMY_TEAM, public_id: "t4" } }
    ],
    STATS: [
        { title: "Satisfied Clients", statsNumber: "1200+", description: "Active families trusting our advisory.", image: { url: DUMMY_IMAGE } },
        { title: "Experience", statsNumber: "20+", description: "Years of excellence in finance.", image: { url: DUMMY_IMAGE } },
        { title: "Assets Under Management", statsNumber: "₹500Cr+", description: "Entrusted portfolio growth.", image: { url: DUMMY_IMAGE } },
        { title: "Global Experts", statsNumber: "50+", description: "Dedicated professionals.", image: { url: DUMMY_IMAGE } }
    ],
    TESTIMONIALS: [
        { name: "Sarah Johnson", feedback: "The transparency and discipline they bring to investment planning are refreshing. My portfolio has never been healthier.", image: { url: DUMMY_TEAM } },
        { name: "Michael Chen", feedback: "They helped me plan my children's education fund perfectly. The roadmap they provided was clear and achievable.", image: { url: DUMMY_TEAM } },
        { name: "Anita Kapoor", feedback: "Retirement planning seemed daunting until I met this team. Now I'm confident about my financial freedom.", image: { url: DUMMY_TEAM } },
        { name: "Robert Wilson", feedback: "Their market insights are top-notch. I appreciate the proactive communication during market volatility.", image: { url: DUMMY_TEAM } }
    ],
    BLOGS: [
        { title: "Financial Planning Basics", slug: "planning-basics", description: "Why everyone needs a financial plan to secure their future.", content: "Financial planning is not just for the wealthy. It's a roadmap for anyone who wants to ensure they have enough to cover their goals, from buying a home to retirement.", image: { url: DUMMY_IMAGE } },
        { title: "Understanding Market Volatility", slug: "market-volatility", description: "How to stay calm and stay the course when markets are bumpy.", content: "Market fluctuations are natural. This post explores why long-term investors should ignore short-term noise and focus on their asset allocation.", image: { url: DUMMY_IMAGE } },
        { title: "Retirement Savings Strategies", slug: "retirement-strategies", description: "Maximizing your nest egg through smart planning and tax efficiency.", content: "Start early and stay consistent. We break down the best vehicles for retirement savings and how to automate your contributions.", image: { url: DUMMY_IMAGE } },
        { title: "Estate Planning 101", slug: "estate-planning", description: "Protecting your legacy and ensuring your assets reach the right hands.", content: "Estate planning is more than just a will. Learn about trusts, power of attorney, and how to minimize inheritance taxes.", image: { url: DUMMY_IMAGE } }
    ],
    FAQS: [
        { question: "How do I start?", answer: "Simply contact us for a free consultation." },
        { question: "Is my data safe?", answer: "We use top-tier security standards for all client information." }
    ],
    SERVICES: [
        {
            name: "Investment Planning",
            description: "Customized investment plans for your life goals.",
            link: "investment-planning",
            superServiceId: "default_s1",
            versionSlug: "v1",
            status: true,
            icon: { url: DUMMY_IMAGE, status: true },
            image: { url: DUMMY_IMAGE, status: true }
        }
    ],
    PERMISSIONS: [
        "dashboard", "leads", "services", "blogs", "team", "testimonials", "awards", "faq", "gallery", "popups", "videos", "advertisement", "social-media", "site-settings", "users"
    ],
    AWARDS: [
        { name: "Top Advisor 2024", presentedBy: "Finance Today", date: new Date("2024-01-01"), image: { url: DUMMY_AWARD } },
        { name: "Excellence in Planning", presentedBy: "Global Wealth", date: new Date("2023-12-15"), image: { url: DUMMY_AWARD } },
        { name: "Rising Star Award", presentedBy: "Advise Hub", date: new Date("2023-06-20"), image: { url: DUMMY_AWARD } },
        { name: "Customer Choice Award", presentedBy: "Wealth Management Inc", date: new Date("2023-03-10"), image: { url: DUMMY_AWARD } }
    ],
    LOGIN_DESK: {
        _id: "66ea6fe3395697693f443586",
        name: "IFA",
        loginitems: [
            { _id: "68cbf9f52547fde5c5706369", login_value: "CLIENT", login_name: "Client", login_desk: "IFA", login_status: true, isstatus: true },
            { _id: "68cbfa842547fde5c5706374", login_value: "EMPLOYEE", login_name: "Employee", login_desk: "IFA", login_status: true, isstatus: true },
            { _id: "68cbfa992547fde5c570637c", login_value: "ADVISOR", login_name: "Admin", login_desk: "IFA", login_status: true, isstatus: true }
        ]
    }
};

// --- SEEDER FUNCTION ---

export async function POST(request) {
    try {
        await ConnectDB();

        // Helper to get data or fallback
        const getData = (key) => SEED_DATA[key] || DEFAULT_DUMMY_DATA[key];

        // 1. Leads
        const leads = getData('LEADS');
        if (leads) {
            await LeadsModel.deleteMany({});
            await LeadsModel.create(leads);
        }

        // 2. Site Settings
        const siteSettings = getData('SITE_SETTINGS');
        if (siteSettings) {
            await SiteSettingsModel.deleteMany({});
            await SiteSettingsModel.create(siteSettings);
        }

        // 3. Home Banners
        const homeBanners = getData('HOME_BANNERS') || [
            { title: "Professional Financial Advisory", designation: "Protecting and growing your wealth.", image: { url: DUMMY_IMAGE, public_id: "b1" }, auther_url: DUMMY_LINK },
            { title: "Expert Market Analysis", designation: "Data-driven decisions for your future.", image: { url: DUMMY_IMAGE, public_id: "b2" }, auther_url: DUMMY_LINK }
        ];
        await HomeBannerModel.deleteMany({});
        await HomeBannerModel.create(homeBanners);

        // 4. About Us
        const about = getData('ABOUT');
        if (about) {
            await AboutUsModel.deleteMany({});
            await AboutUsModel.create(about);
        }

        // 5. Mission & Vision
        const mv = getData('MISSION_VISION');
        if (mv) {
            await MissionVisionModel.deleteMany({});
            await MissionVisionModel.create(mv);
        }

        // 6. Stats
        const stats = getData('STATS');
        if (stats) {
            await StatsModel.deleteMany({});
            await StatsModel.create(stats);
        }

        // 7. Team
        const team = getData('TEAM');
        if (team) {
            await TeamModel.deleteMany({});
            await TeamModel.create(team);
        }

        // 8. Blogs & Category
        const blogs = getData('BLOGS');
        if (blogs) {
            await CategoryModel.deleteMany({});
            const defaultCategory = await CategoryModel.create({ categoryname: "Finance", slug: "finance", status: true });

            await BlogsModel.deleteMany({});
            const blogsToCreate = blogs.map(blog => ({
                posttitle: blog.title,
                metatitle: blog.metatitle || blog.title,
                description: blog.description,
                slug: blog.slug,
                content: blog.content,
                image: blog.image,
                category: defaultCategory._id
            }));
            await BlogsModel.create(blogsToCreate);
        }

        // 9. Testimonials
        const testimonials = getData('TESTIMONIALS');
        if (testimonials) {
            await TestimonialModel.deleteMany({});
            await TestimonialModel.create(testimonials);
        }

        // 10. Awards
        const awards = getData('AWARDS');
        if (awards) {
            await AwardModel.deleteMany({});
            await AwardModel.create(awards);
        }

        // 11. FAQ
        const faqs = getData('FAQS');
        if (faqs) {
            await FaqModel.deleteMany({});
            await FaqModel.create(faqs);
        }

        // 12. Services
        const services = getData('SERVICES');
        if (services) {
            await AdminServicesModel.deleteMany({});
            await AdminServicesModel.create(services);
        }

        // 13. Popups
        const popups = getData('POPUP');
        if (popups) {
            await WebpopupsModel.deleteMany({});
            await WebpopupsModel.create(popups);
        }

        // 14. Videos
        const videos = getData('VIDEOS');
        if (videos) {
            await VideoModel.deleteMany({});
            await VideoModel.create(videos);
        }

        // 15. Ads
        const ads = getData('AD');
        if (ads) {
            await AdvertisementModel.deleteMany({});
            await AdvertisementModel.create(ads);
        }

        // 16. Gallery
        const gallery = getData('GALLERY');
        if (gallery) {
            await GalleryCategoryModel.deleteMany({});
            const generalGallery = await GalleryCategoryModel.create({ categoryname: "General", status: true });
            await GalleryModel.deleteMany({});
            const galleryItems = gallery.map(item => ({ ...item, category: generalGallery._id }));
            await GalleryModel.create(galleryItems);
        }

        // 17. Social Media
        const social = getData('SOCIAL_MEDIA');
        if (social) {
            await SocialMediaModel.deleteMany({});
            await SocialMediaModel.create(social);
        }

        // 18. AMC Logos
        const amcs = getData('AMC_LOGOS');
        if (amcs) {
            await AmcsLogoModel.deleteMany({});
            await AmcsLogoModel.create(amcs);
        }

        // 19. Inner Page
        const inner = getData('INNER_PAGE');
        if (inner) {
            await InnerPageModel.deleteMany({});
            await InnerPageModel.create(inner);
        }

        // 20. Admin User (DEVADMIN)
        const user = getData('USER');
        if (user) {
            await UserModel.deleteMany({});
            await UserModel.create(user);
        }

        // 21. Login Group (IFA Desk)
        const loginDesk = getData('LOGIN_DESK');
        if (loginDesk) {
            await LoginGroupModel.deleteMany({});
            await LoginGroupModel.create(loginDesk);
        }

        // 22. Permissions
        const perms = getData('PERMISSIONS');
        if (perms) {
            await PermissionModel.deleteMany({});
            const permissionsToCreate = perms.map(p => ({ permission: p, enabled: true }));
            await PermissionModel.create(permissionsToCreate);
        }

        return NextResponse.json({ message: "Database seeded with overrides/fallbacks successfully!" }, { status: 200 });
    } catch (error) {
        console.error("Seeding error:", error);
        return NextResponse.json({ message: "Failed to seed database", error: error.message }, { status: 500 });
    }
}
