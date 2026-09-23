"use strict";

/* =========================================================
   HELPER
========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const safeAddEvent = (element, event, callback) => {
    if (element) {
        element.addEventListener(event, callback);
    }
};


/* =========================================================
   LOADER
========================================================= */

const loader = $("#loader");
const loaderBar = $("#loaderBar");

let loading = 0;

if (loader && loaderBar) {
    const loaderTimer = setInterval(() => {
        loading = Math.min(
            100,
            loading + Math.floor(Math.random() * 10) + 5
        );

        loaderBar.style.width = `${loading}%`;

        if (loading >= 100) {
            clearInterval(loaderTimer);

            setTimeout(() => {
                loader.classList.add("hide");

                setTimeout(() => {
                    loader.style.display = "none";
                }, 500);
            }, 500);
        }
    }, 100);
}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

const nav = $("#nav");
const menuToggle = $("#menuToggle");

safeAddEvent(menuToggle, "click", () => {
    if (!nav) return;

    const isOpen = nav.classList.toggle("active");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );
});

$$(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
        if (nav) {
            nav.classList.remove("active");
        }

        if (menuToggle) {
            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });
});


/* =========================================================
   TRANSLATION SYSTEM
========================================================= */

/*
   Kode translation kamu yang panjang:

   translations
   koreanTranslations
   additionalTranslations
   completeTranslations
   sharedLabels
   regionalTranslations
   languageExtras
   translationCoverage
   coverageExtras

   tetap gunakan seperti yang sudah kamu buat.

   PERBAIKAN UTAMA ADA DI setLanguage()
*/


const languageCodes = {
    EN: "en",
    ID: "id",
    JA: "ja",
    KO: "ko",
    ZH: "zh-CN",
    AR: "ar",
    ES: "es",
    FR: "fr",
    DE: "de",
    PT: "pt-BR",
    IT: "it",
    RU: "ru",

    JV: "jv-ID",
    SU: "su-ID",
    MAD: "mad-ID",
    MIN: "min-ID",
    BAL: "ban-ID",
    BUG: "bug-ID",
    ACE: "ace-ID",
    BJN: "bjn-ID",
    BTK: "bbc-ID",
    SAS: "sas-ID",
    MAK: "mak-ID",
    PLM: "plm-ID"
};


const originalContent = new Map();
const originalPlaceholders = new Map();

const translations = {};
const koreanTranslations = {};
const additionalTranslations = {};
const completeTranslations = {};
const regionalTranslations = {};
const languageExtras = {};
const sharedLabels = {};
const translationCoverage = { EN: [], ID: [] };
const coverageExtras = {};
const coverageSelectors = [];

const pageTextMap = {
    EN: {
        nav: ["HOME", "PROFILE", "SKILLS", "WORKS", "ABOUT ME", "CONTACT"],
        kicker: "HONDA CBR250RR // PORTFOLIO",
        heroTitle: ["BUILT TO", "CREATE"],
        subtitle: "CREATIVE DEVELOPER",
        description: "I design websites, interfaces, and digital experiences with a sharp visual style, strong functionality, and clear character.",
        explore: "EXPLORE MY WORK",
        hear: "HEAR INTRO",
        audioSystem: "AUDIO SYSTEM",
        audioSubtitle: "YUDA CREATIVE EXPERIENCE",
        focusMode: "FOCUS MODE",
        focusSubtitle: "CREATIVE WORKFLOW",
        yudaVoice: "YUDA VOICE",
        voiceSubtitle: "PERSONAL INTRO",
        volume: "VOLUME",
        about: ["04 / ABOUT ME", "IDEAS INTO", "EXPERIENCES.", "Saya Firdaus Yuda Permana, seorang creative developer yang tertarik pada web, interface, visual game, dan branding. Portfolio ini menampilkan proses dan karya yang saya bangun.", "PLAY MY INTRO"],
        contact: ["05 / CONTACT", "LET'S MAKE", "IT REAL.", "Punya ide atau project yang ingin diwujudkan? Kirim pesan dan mari mulai percakapannya.", "NAMA", "EMAIL", "PESAN", "SEND MESSAGE"],
        stats: ["SELECTED PROJECTS", "CORE SKILLS", "ALWAYS LEARNING", "MAKE IMPACT"],
        section1: ["01 / CAPABILITIES", "BUILT TO", "CREATE.", "WEB DEVELOPMENT", "UI DESIGN", "VISUAL DIRECTION", "PROBLEM SOLVING"],
        section2: ["02 / TOOLKIT", "SKILLS THAT", "MOVE."]
    },
    ID: {
        nav: ["BERANDA", "PROFIL", "KEAHLIAN", "KERJA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT UNTUK", "MEMBUAT"],
        subtitle: "PENGEMBANG KREATIF",
        description: "Saya merancang website, antarmuka, dan pengalaman digital dengan gaya visual yang tajam, fungsional, dan berkarakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE MENJADI", "PENGALAMAN.", "Saya Firdaus Yuda Permana, seorang creative developer yang tertarik pada web, interface, visual game, dan branding. Portfolio ini menampilkan proses dan karya yang saya bangun.", "MAINKAN INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Punya ide atau project yang ingin diwujudkan? Kirim pesan dan mari mulai percakapannya.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEAHLIAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT UNTUK", "MEMBUAT.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / PERALATAN", "KEAHLIAN YANG", "BERGERAK."]
    },
    JA: {
        nav: ["ホーム", "プロフィール", "スキル", "作品", "私について", "コンタクト"],
        kicker: "HONDA CBR250RR // ポートフォリオ",
        heroTitle: ["創るために", "制作"],
        subtitle: "クリエイティブ開発者",
        description: "私は、鋭いビジュアル、機能性、個性を兼ね備えたWebサイト、インターフェース、デジタル体験を設計します。",
        explore: "作品を見る",
        hear: "紹介を聞く",
        audioSystem: "オーディオシステム",
        audioSubtitle: "YUDA CREATIVE EXPERIENCE",
        focusMode: "フォーカスモード",
        focusSubtitle: "クリエイティブワークフロー",
        yudaVoice: "YUDA VOICE",
        voiceSubtitle: "自己紹介",
        volume: "音量",
        about: ["04 / 自己紹介", "アイデアから", "体験へ。", "私はFirdaus Yuda Permana。Web、インターフェース、ゲームビジュアル、ブランディングに興味を持つクリエイティブ開発者です。", "自己紹介を再生"],
        contact: ["05 / お問い合わせ", "一緒に", "形にしよう。", "アイデアやプロジェクトがあれば、メッセージを送ってください。", "名前", "メール", "メッセージ", "送信"],
        stats: ["選定プロジェクト", "中核スキル", "常に学ぶ", "影響を生む"],
        section1: ["01 / 能力", "創るために", "作る。", "ウェブ開発", "UIデザイン", "ビジュアル方向性", "問題解決"],
        section2: ["02 / ツールキット", "動くスキル", "がある。"]
    },
    KO: {
        nav: ["홈", "프로필", "기술", "작업", "소개", "연락처"],
        kicker: "HONDA CBR250RR // 포트폴리오",
        heroTitle: ["만들기 위한", "창조"],
        subtitle: "크리에이티브 개발자",
        description: "날카로운 시각, 기능성, 개성을 가진 웹사이트, 인터페이스, 디지털 경험을 설계합니다.",
        explore: "작업 보기",
        hear: "소개 듣기",
        audioSystem: "오디오 시스템",
        audioSubtitle: "YUDA CREATIVE EXPERIENCE",
        focusMode: "집중 모드",
        focusSubtitle: "크리에이티브 워크플로",
        yudaVoice: "YUDA VOICE",
        voiceSubtitle: "개인 소개",
        volume: "볼륨",
        about: ["04 / 소개", "아이디어를", "경험으로。", "저는 Firdaus Yuda Permana이며 웹, 인터페이스, 게임 비주얼, 브랜딩에 관심이 있는 크리에이티브 개발자입니다.", "소개 재생"],
        contact: ["05 / 연락처", "함께", "만들어 보세요.", "아이디어나 프로젝트가 있다면 메시지를 보내주세요.", "이름", "이메일", "메시지", "보내기"],
        stats: ["선정 프로젝트", "핵심 스킬", "항상 배우기", "영향을 만들기"],
        section1: ["01 / 역량", "만들기 위해", "창조.", "웹 개발", "UI 디자인", "비주얼 방향", "문제 해결"],
        section2: ["02 / 툴킷", "움직이는", "스킬."]
    },
    ZH: {
        nav: ["首页", "简介", "技能", "作品", "关于", "联系"],
        kicker: "HONDA CBR250RR // 作品集",
        heroTitle: ["为创造而生", "创意"],
        subtitle: "创意开发者",
        description: "我设计网站、界面和数字体验，融合锐利的视觉风格、功能性和独特个性。",
        explore: "查看作品",
        hear: "播放介绍",
        audioSystem: "音频系统",
        audioSubtitle: "YUDA CREATIVE EXPERIENCE",
        focusMode: "专注模式",
        focusSubtitle: "创意工作流",
        yudaVoice: "YUDA 声音",
        voiceSubtitle: "个人介绍",
        volume: "音量",
        about: ["04 / 关于我", "想法变成", "体验。", "我是 Firdaus Yuda Permana，一名对网页、界面、游戏视觉和品牌设计感兴趣的创意开发者。", "播放我的介绍"],
        contact: ["05 / 联系", "让我们一起", "实现它。", "有想法或项目想实现？发消息给我吧。", "名字", "邮箱", "消息", "发送消息"],
        stats: ["精选项目", "核心技能", "持续学习", "创造影响"],
        section1: ["01 / 能力", "为创造而生", "创意。", "网页开发", "UI 设计", "视觉方向", "问题解决"],
        section2: ["02 / 工具包", "让技能", "动起来。"]
    },
    AR: {
        nav: ["الرئيسية", "الملف", "المهارات", "الأعمال", "عني", "التواصل"],
        kicker: "HONDA CBR250RR // معرض الأعمال",
        heroTitle: ["مصمم من أجل", "الإبداع"],
        subtitle: "مطور إبداعي",
        description: "أصمم مواقع الإنترنت والواجهات وتجارب رقمية بأسلوب بصري حاد وعملي ومميز.",
        explore: "استعراض الأعمال",
        hear: "استماع للمقدمة",
        audioSystem: "نظام الصوت",
        audioSubtitle: "YUDA CREATIVE EXPERIENCE",
        focusMode: "وضع التركيز",
        focusSubtitle: "سير العمل الإبداعي",
        yudaVoice: "صوت YUDA",
        voiceSubtitle: "مقدمة شخصية",
        volume: "الصوت",
        about: ["04 / عني", "الأفكار تتحول إلى", "تجارب.", "أنا فيرداوس يودا بيرمانا، مطور إبداعي مهتم بالويب والواجهات وتصميم الألعاب والهوية البصرية.", "تشغيل مقدمتي"],
        contact: ["05 / التواصل", "دعنا نصنع", "الحقيقة.", "هل لديك فكرة أو مشروع تريد تنفيذه؟ أرسل رسالة وابدأ المحادثة.", "الاسم", "البريد", "الرسالة", "إرسال الرسالة"],
        stats: ["مشاريع مختارة", "مهارات أساسية", "دائمًا نتعلم", "نخلق أثرًا"],
        section1: ["01 / القدرات", "مصمم من أجل", "الإبداع.", "تطوير الويب", "تصميم واجهات", "التوجيه البصري", "حل المشكلات"],
        section2: ["02 / الأدوات", "مهارات", "تتحرك."]
    },
    JV: {
        nav: ["NGAREP", "PROFIL", "KETERAMPILAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIDUWENKE", "NYIPTA"],
        subtitle: "PENGEMBANG KREATIF",
        description: "Aku ngrancang situs web, antarmuka, lan pengalaman digital kanthi gaya visual sing cetha, fungsional, lan nduweni karakter.",
        explore: "LIHAT KARYA",
        hear: "RUNGOKAKE INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE MENJADI", "PENGALAMAN.", "Aku Firdaus Yuda Permana, pangembang kreatif sing kasengsem ing web, antarmuka, visual game, lan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "AYO NGGAWE", "SING NYATA.", "Punya ide utawa proyek sing pengin diwujudake? Kirim pesen lan ayo miwiti obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEAHLIAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIDUWENKE", "NYIPTA.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / PERALATAN", "KEAHLIAN", "BERGERAK."]
    },
    SU: {
        nav: ["SAMANDAR", "PROFIL", "KAHUSAN", "KARYA", "NGEUNA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIREKAYASA", "NGADIDIK"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Abdi ngarancang situs web, antarmuka, sareng pangalaman digital kalayan gaya visual anu jelas, fungsional, sareng berkarakter.",
        explore: "TINGALI KARYA",
        hear: "DANGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SORA YUDA",
        voiceSubtitle: "PANGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / NGEUNA", "IDE JADI", "PANGALAMAN.", "Abdi Firdaus Yuda Permana, pangembang kreatif anu resep kana web, antarmuka, visual game, jeung branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "AYO NGARAK", "ANU NYATA.", "Aya ide atawa proyék anu hayang diwujudkeun? Kirim pesen sareng hayu ngamimitian paguneman.", "NAMI", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAHUSAN INTI", "SALALU NGALARAN", "BANGUN DAMPAK"],
        section1: ["01 / KAHUSAN", "DIREKAYASA", "NGADIDIK.", "PANGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAHUSAN", "GERAK."]
    },
    MAD: {
        nav: ["BERRU", "PROFIL", "KAHALAHAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "NGABUAT"],
        subtitle: "PENGEMBANG KREATIF",
        description: "Seng ngadari website, antarmuka, sareng pengalaman digital bân gaya visual se jelas, fungsional, sareng karakter.",
        explore: "ELIAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Seng Firdaus Yuda Permana, kreatif developer se tarèt ngani web, antarmuka, visual game, bra branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ada ide atawa proyek se pengin dibangun? Kirim pesen sareng mari mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEAHLIAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "NGABUAT.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KEAHLIAN", "BERGERAK."]
    },
    MIN: {
        nav: ["RUMAH", "PROFIL", "KAMAMPUAN", "KARJA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "MAMBUAT"],
        subtitle: "PANGAMBANG KREATIF",
        description: "Azu marancang website, antarmuka, dan pengalaman digital jo gaya visual nan tajam, fungsional, sarato babarapo karakter.",
        explore: "LIAT KARJA",
        hear: "DANGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE MANJADI", "PENGALAMAN.", "Azu Firdaus Yuda Permana, creative developer nan ciekek pado web, antarmuka, visual game, dan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ado ide atau proyek nan ingin diwujudkan? Kirim pesan dan mari mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAMAMPUAN INTI", "SALALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KAMAMPUAN", "DIBUAT", "MAMBUAT.", "PANGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAMAMPUAN", "BERTINDAK."]
    },
    BAL: {
        nav: ["UTAMA", "PROFIL", "KAHALERAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["KARENA", "NYIPTA"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Tiang ngrancang website, antarmuka, miwah pengalaman digital sareng gaya visual sané jelas, fungsional, miwah karakter.",
        explore: "NGUNING KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Tiang Firdaus Yuda Permana, creative developer sané kabetot ring web, antarmuka, visual game, miwah branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "AYO NGABANGUN", "ANU NYATA.", "Wénten ide utawi proyek sané jagi kalaksanayang? Kirim pesen sareng ngiring mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAHALERAN INTI", "SALALU NGELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KAMPUAN", "KARENA", "NYIPTA.", "PANGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAHALERAN", "NGGERAK."]
    },
    BUG: {
        nav: ["UTAMA", "PROFIL", "KAMAMPUA", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "NGABBANG"],
        subtitle: "PAKEMBANG KREATIF",
        description: "Aku ma'rancang website, antarmuka, sibawa pengalaman digital si jelas, fungsional, sibawa karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SURE YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Aku Firdaus Yuda Permana, kreatif developer si tertarik ri web, antarmuka, visual game, sibawa branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ada ide atau proyek yang ingin diwujudkan? Kirim pesan dan mari mulai percakapan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAMAMPUA INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "NGABBANG.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KEMAMPUAN", "BERGERAK."]
    },
    ACE: {
        nav: ["UTAMA", "PROFIL", "KEMAMPUAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBOH", "MIMBUAT"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Ureueng nyoe ngancang website, antarmuka, dan pengalaman digital ngön gaya visual nyang teuh, fungsional, ngön karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Ureueng nyoe Firdaus Yuda Permana, creative developer nyang tarékéh bak web, antarmuka, visual game, dan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Na ide atawa proyek nyang geutamong? Kirim pesan dan mari mulai ngobrol.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEMAMPUAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBOH", "MIMBUAT.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KEMAMPUAN", "BERGERAK."]
    },
    BJN: {
        nav: ["UTAMA", "PROFIL", "KAPARIGELAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "MAKANYA"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Aku marancang website, antarmuka, dan pengalaman digital lawan gaya visual nang jelas, fungsional, lawan karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Aku Firdaus Yuda Permana, creative developer nang minat di web, antarmuka, visual game, lawan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "AYO BANGUN", "YANG NYATA.", "Wadah ide atawa proyek nang ingin diwujudkan? Kirim pesan lawan mari mulai ngobrol.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAPARIGELAN INTI", "SALALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "MAKANYA.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAPARIGELAN", "BERGERAK."]
    },
    BTK: {
        nav: ["UTAMA", "PROFIL", "KEMAMPUAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "MARBADA"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Au mangarancang website, antarmuka, dohot pengalaman digital na gaya visual na jelas, fungsional, dohot karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Au Firdaus Yuda Permana, creative developer na martarigaan di web, antarmuka, visual game, dohot branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Adong ide atau proyek na pinang naeng dibangun? Kirim pesan dohot mar mulai ngobrol.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEMAMPUAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "MARBADA.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KEMAMPUAN", "BERGERAK."]
    },
    SAS: {
        nav: ["UTAMA", "PROFIL", "KEAHLIAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "NGIYANG"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Aq merancang website, antarmuka, dan pengalaman digital dengan gaya visual si jelas, fungsional, dan karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Aq Firdaus Yuda Permana, creative developer si minat di web, antarmuka, visual game, dan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ada ide atau proyek se pengin diwujudkan? Kirim pesan dan mari mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KEAHLIAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "NGIYANG.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KEAHLIAN", "BERGERAK."]
    },
    MAK: {
        nav: ["UTAMA", "PROFIL", "KAMAMPUAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "NGEKKU"],
        subtitle: "PANGEMBANG KREATIF",
        description: "Aku mangrancang website, antarmuka, siagang pengalaman digital si jelas, fungsional, siagang karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Aku Firdaus Yuda Permana, creative developer nan tertarik ri web, antarmuka, visual game, siagang branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ada ide atau proyek nan ingin diwujudkan? Kirim pesan dan mari mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAMAMPUAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "NGEKKU.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAMAMPUAN", "BERGERAK."]
    },
    PLM: {
        nav: ["UTAMA", "PROFIL", "KAMAMPUAN", "KARYA", "TENTANG SAYA", "KONTAK"],
        kicker: "HONDA CBR250RR // PORTOFOLIO",
        heroTitle: ["DIBUAT", "MANGGE"],
        subtitle: "PENGEMBANG KREATIF",
        description: "Aku ngarang website, antarmuka, dan pengalaman digital pake gaya visual yang jelas, fungsional, dan karakter.",
        explore: "LIHAT KARYA",
        hear: "DENGAR INTRO",
        audioSystem: "SISTEM AUDIO",
        audioSubtitle: "PENGALAMAN KREATIF YUDA",
        focusMode: "MODE FOKUS",
        focusSubtitle: "ALUR KERJA KREATIF",
        yudaVoice: "SUARA YUDA",
        voiceSubtitle: "PENGANTAR PRIBADI",
        volume: "VOLUME",
        about: ["04 / TENTANG SAYA", "IDE JADI", "PENGALAMAN.", "Aku Firdaus Yuda Permana, creative developer yang tertarik di web, antarmuka, visual game, dan branding.", "PUTAR INTRO"],
        contact: ["05 / KONTAK", "MARI BANGUN", "YANG NYATA.", "Ada ide atau proyek yang pengin diwujudkan? Kirim pesan dan mari mulai obrolan.", "NAMA", "EMAIL", "PESAN", "KIRIM PESAN"],
        stats: ["PROYEK TERPILIH", "KAMAMPUAN INTI", "SELALU BELAJAR", "BANGUN DAMPAK"],
        section1: ["01 / KEMAMPUAN", "DIBUAT", "MANGGE.", "PENGEMBANGAN WEB", "DESAIN UI", "ARAH VISUAL", "PEMECAHAN MASALAH"],
        section2: ["02 / ALAT", "KAMAMPUAN", "BERGERAK."]
    },
    ES: {
        nav: ["INICIO", "PERFIL", "HABILIDADES", "TRABAJOS", "SOBRE MÍ", "CONTACTO"],
        kicker: "HONDA CBR250RR // PORTAFOLIO",
        heroTitle: ["CONSTRUIDO PARA", "CREAR"],
        subtitle: "DESARROLLADOR CREATIVO",
        description: "Diseño sitios web, interfaces y experiencias digitales con un estilo visual agudo, funcionalidad clara y carácter distintivo.",
        explore: "VER MIS TRABAJOS",
        hear: "ESCUCHAR INTRO",
        audioSystem: "SISTEMA DE AUDIO",
        audioSubtitle: "EXPERIENCIA CREATIVA YUDA",
        focusMode: "MODO ENFOQUE",
        focusSubtitle: "FLUJO DE TRABAJO CREATIVO",
        yudaVoice: "VOZ YUDA",
        voiceSubtitle: "INTRODUCCIÓN PERSONAL",
        volume: "VOLUMEN",
        about: ["04 / SOBRE MÍ", "IDEAS EN", "EXPERIENCIAS.", "Soy Firdaus Yuda Permana, un desarrollador creativo interesado en web, interfaces, visuales de juegos y branding.", "REPRODUCIR INTRO"],
        contact: ["05 / CONTACTO", "HAGAMOS", "REALIDAD.", "¿Tienes una idea o proyecto que quieras llevar a cabo? Envíame un mensaje y empecemos a conversar.", "NOMBRE", "CORREO", "MENSAJE", "ENVIAR MENSAJE"],
        stats: ["PROYECTOS SELECCIONADOS", "HABILIDADES PRINCIPALES", "SIEMPRE APRENDIENDO", "CREAR IMPACTO"],
        section1: ["01 / CAPACIDADES", "CONSTRUIDO PARA", "CREAR.", "DESARROLLO WEB", "DISEÑO UI", "DIRECCIÓN VISUAL", "RESOLUCIÓN DE PROBLEMAS"],
        section2: ["02 / HERRAMIENTAS", "HABILIDADES QUE", "SE MUEVEN."]
    },
    FR: {
        nav: ["ACCUEIL", "PROFIL", "COMPÉTENCES", "TRAVAUX", "À PROPOS", "CONTACT"],
        kicker: "HONDA CBR250RR // PORTFOLIO",
        heroTitle: ["CONSTRUIT POUR", "CRÉER"],
        subtitle: "DÉVELOPPEUR CRÉATIF",
        description: "Je conçois des sites web, des interfaces et des expériences numériques avec un style visuel percutant, fonctionnalité claire et caractère distinctif.",
        explore: "VOIR MES TRAVAUX",
        hear: "ÉCOUTER L'INTRO",
        audioSystem: "SYSTÈME AUDIO",
        audioSubtitle: "EXPÉRIENCE CRÉATIVE YUDA",
        focusMode: "MODE DE CONCENTRATION",
        focusSubtitle: "FLUX DE TRAVAIL CRÉATIF",
        yudaVoice: "VOIX YUDA",
        voiceSubtitle: "INTRODUCTION PERSONNELLE",
        volume: "VOLUME",
        about: ["04 / À PROPOS", "DES IDÉES EN", "EXPÉRIENCES.", "Je suis Firdaus Yuda Permana, un développeur créatif intéressé par le web, les interfaces, les visuels de jeux et le branding.", "LIRE L'INTRO"],
        contact: ["05 / CONTACT", "CRÉONS", "ENSEMBLE.", "Vous avez une idée ou un projet à réaliser ? Envoyez-moi un message et commençons la conversation.", "NOM", "EMAIL", "MESSAGE", "ENVOYER LE MESSAGE"],
        stats: ["PROJETS SÉLECTIONNÉS", "COMPÉTENCES PRINCIPALES", "TOUJOURS APPRENDRE", "CRÉER DE L'IMPACT"],
        section1: ["01 / CAPACITÉS", "CONSTRUIT POUR", "CRÉER.", "DÉVELOPPEMENT WEB", "CONCEPTION UI", "DIRECTION VISUELLE", "RÉSOLUTION DE PROBLÈMES"],
        section2: ["02 / OUTILS", "COMPÉTENCES QUI", "BOUGENT."]
    },
    DE: {
        nav: ["STARTSEITE", "PROFIL", "FÄHIGKEITEN", "ARBEITEN", "ÜBER MICH", "KONTAKT"],
        kicker: "HONDA CBR250RR // PORTFOLIO",
        heroTitle: ["GEBAUT ZUM", "SCHAFFEN"],
        subtitle: "KREATIVER ENTWICKLER",
        description: "Ich entwerfe Websites, Schnittstellen und digitale Erfahrungen mit scharfem visuellen Stil, klarer Funktionalität und eigenständigem Charakter.",
        explore: "MEINE ARBEITEN ANSEHEN",
        hear: "INTRO ANHÖREN",
        audioSystem: "AUDIOSYSTEM",
        audioSubtitle: "YUDA KREATIVE ERFAHRUNG",
        focusMode: "FOKUSMODUS",
        focusSubtitle: "KREATIVER WORKFLOW",
        yudaVoice: "YUDA STIMME",
        voiceSubtitle: "PERSÖNLICHE EINFÜHRUNG",
        volume: "LAUTSTÄRKE",
        about: ["04 / ÜBER MICH", "IDEEN IN", "ERFAHRUNGEN.", "Ich bin Firdaus Yuda Permana, ein kreativer Entwickler mit Interesse an Web, Schnittstellen, Spiel-Visuals und Branding.", "INTRO ABSPIELEN"],
        contact: ["05 / KONTAKT", "LASSEN SIE UNS", "REALISIEREN.", "Haben Sie eine Idee oder ein Projekt? Senden Sie mir eine Nachricht und beginnen Sie das Gespräch.", "NAME", "E-MAIL", "NACHRICHT", "NACHRICHT SENDEN"],
        stats: ["AUSGEWÄHLTE PROJEKTE", "KERNFÄHIGKEITEN", "IMMER LERNEN", "AUSWIRKUNGEN SCHAFFEN"],
        section1: ["01 / FÄHIGKEITEN", "GEBAUT ZUM", "SCHAFFEN.", "WEBENTWICKLUNG", "UI-DESIGN", "VISUELLE RICHTUNG", "PROBLEMLÖSUNG"],
        section2: ["02 / WERKZEUGE", "FÄHIGKEITEN DIE", "SICH BEWEGEN."]
    },
    PT: {
        nav: ["INÍCIO", "PERFIL", "HABILIDADES", "TRABALHOS", "SOBRE MIM", "CONTATO"],
        kicker: "HONDA CBR250RR // PORTFÓLIO",
        heroTitle: ["CONSTRUÍDO PARA", "CRIAR"],
        subtitle: "DESENVOLVEDOR CRIATIVO",
        description: "Projeto websites, interfaces e experiências digitais com um estilo visual afiado, funcionalidade clara e caráter distintivo.",
        explore: "VER MEUS TRABALHOS",
        hear: "OUVIR INTRODUÇÃO",
        audioSystem: "SISTEMA DE ÁUDIO",
        audioSubtitle: "EXPERIÊNCIA CRIATIVA YUDA",
        focusMode: "MODO FOCO",
        focusSubtitle: "FLUXO DE TRABALHO CRIATIVO",
        yudaVoice: "VOZ YUDA",
        voiceSubtitle: "INTRODUÇÃO PESSOAL",
        volume: "VOLUME",
        about: ["04 / SOBRE MIM", "IDEIAS EM", "EXPERIÊNCIAS.", "Sou Firdaus Yuda Permana, um desenvolvedor criativo interessado em web, interfaces, visuais de jogos e branding.", "REPRODUZIR INTRO"],
        contact: ["05 / CONTATO", "VAMOS", "CRIAR.", "Tem uma ideia ou projeto que quer realizar? Envie-me uma mensagem e comecemos a conversa.", "NOME", "EMAIL", "MENSAGEM", "ENVIAR MENSAGEM"],
        stats: ["PROJETOS SELECIONADOS", "HABILIDADES PRINCIPAIS", "SEMPRE APRENDENDO", "CRIAR IMPACTO"],
        section1: ["01 / CAPACIDADES", "CONSTRUÍDO PARA", "CRIAR.", "DESENVOLVIMENTO WEB", "DESIGN UI", "DIREÇÃO VISUAL", "RESOLUÇÃO DE PROBLEMAS"],
        section2: ["02 / FERRAMENTAS", "HABILIDADES QUE", "SE MOVEM."]
    },
    IT: {
        nav: ["INIZIO", "PROFILO", "COMPETENZE", "LAVORI", "CHI SONO", "CONTATTI"],
        kicker: "HONDA CBR250RR // PORTFOLIO",
        heroTitle: ["COSTRUITO PER", "CREARE"],
        subtitle: "SVILUPPATORE CREATIVO",
        description: "Progetto siti web, interfacce e esperienze digitali con uno stile visivo acuto, funzionalità chiara e carattere distintivo.",
        explore: "VEDI I MIEI LAVORI",
        hear: "ASCOLTA L'INTRO",
        audioSystem: "SISTEMA AUDIO",
        audioSubtitle: "ESPERIENZA CREATIVA YUDA",
        focusMode: "MODALITÀ FOCUS",
        focusSubtitle: "FLUSSO DI LAVORO CREATIVO",
        yudaVoice: "VOCE YUDA",
        voiceSubtitle: "INTRODUZIONE PERSONALE",
        volume: "VOLUME",
        about: ["04 / CHI SONO", "IDEE IN", "ESPERIENZE.", "Sono Firdaus Yuda Permana, uno sviluppatore creativo interessato a web, interfacce, visual di giochi e branding.", "RIPRODUCI INTRO"],
        contact: ["05 / CONTATTI", "REALIZZIAMO", "INSIEME.", "Hai un'idea o un progetto da realizzare? Inviami un messaggio e iniziamo la conversazione.", "NOME", "EMAIL", "MESSAGGIO", "INVIA MESSAGGIO"],
        stats: ["PROGETTI SELEZIONATI", "COMPETENZE PRINCIPALI", "SEMPRE IMPARANDO", "CREARE IMPATTO"],
        section1: ["01 / CAPACITÀ", "COSTRUITO PER", "CREARE.", "SVILUPPO WEB", "DESIGN UI", "DIREZIONE VISIVA", "RISOLUZIONE DEI PROBLEMI"],
        section2: ["02 / STRUMENTI", "COMPETENZE CHE", "SI MUOVONO."]
    },
    RU: {
        nav: ["ГЛАВНАЯ", "ПРОФИЛЬ", "НАВЫКИ", "РАБОТЫ", "ОБО МНЕ", "КОНТАКТ"],
        kicker: "HONDA CBR250RR // ПОРТФОЛИО",
        heroTitle: ["СОЗДАНО ДЛЯ", "ТВОРЧЕСТВА"],
        subtitle: "КРЕАТИВНЫЙ РАЗРАБОТЧИК",
        description: "Я разрабатываю веб-сайты, интерфейсы и цифровые опыт с острым визуальным стилем, четкой функциональностью и характером.",
        explore: "ПОСМОТРЕТЬ МОИ РАБОТЫ",
        hear: "ПРОСЛУШАТЬ ВСТУПЛЕНИЕ",
        audioSystem: "АУДИОСИСТЕМА",
        audioSubtitle: "КРЕАТИВНЫЙ ОПЫТ YUDA",
        focusMode: "РЕЖИМ ФОКУСА",
        focusSubtitle: "ТВОРЧЕСКИЙ ПРОЦЕСС",
        yudaVoice: "ГОЛОС YUDA",
        voiceSubtitle: "ЛИЧНОЕ ВВЕДЕНИЕ",
        volume: "ГРОМКОСТЬ",
        about: ["04 / ОБО МНЕ", "ИДЕИ В", "ОПЫТ.", "Я Фирдаус Юда Пермана, креативный разработчик, интересующийся веб-дизайном, интерфейсами, визуальными эффектами игр и брендингом.", "ВОСПРОИЗВЕСТИ ВСТУПЛЕНИЕ"],
        contact: ["05 / КОНТАКТ", "ДАВАЙТЕ", "СОЗДАДИМ.", "У вас есть идея или проект? Отправьте мне сообщение и начнем беседу.", "ИМЯ", "EMAIL", "СООБЩЕНИЕ", "ОТПРАВИТЬ СООБЩЕНИЕ"],
        stats: ["ИЗБРАННЫЕ ПРОЕКТЫ", "ОСНОВНЫЕ НАВЫКИ", "ВСЕГДА УЧУСЬ", "СОЗДАВАЙТЕ ВЛИЯНИЕ"],
        section1: ["01 / ВОЗМОЖНОСТИ", "СОЗДАНО ДЛЯ", "ТВОРЧЕСТВА.", "ВЕبراз-РАЗРАБОТКА", "ДИЗАЙН UI", "ВИЗУАЛЬНОЕ НАПРАВЛЕНИЕ", "РЕШЕНИЕ ПРОБЛЕМ"],
        section2: ["02 / ИНСТРУМЕНТЫ", "НАВЫКИ, КОТОРЫЕ", "ДВИГАЮТСЯ."]
    }
};

function applyPageText(language) {
    const langData = pageTextMap[language] || pageTextMap.EN;
    const navLinks = document.querySelectorAll(".nav a");
    navLinks.forEach((link, index) => {
        if (langData.nav && langData.nav[index]) {
            link.textContent = langData.nav[index];
        }
    });

    const kicker = document.querySelector(".kicker");
    if (kicker) kicker.textContent = langData.kicker;

    const heroTitle = document.querySelector(".hero-copy h1");
    if (heroTitle && langData.heroTitle) {
        heroTitle.innerHTML = `<span>${langData.heroTitle[0]}</span><strong>${langData.heroTitle[1]}</strong>`;
    }

    const subtitle = document.querySelector(".hero-copy .subtitle");
    if (subtitle) subtitle.textContent = langData.subtitle;

    const description = document.querySelector(".hero-copy .description");
    if (description) description.textContent = langData.description;

    const mainExploreBtn = document.querySelector(".hero .btn");
    if (mainExploreBtn) mainExploreBtn.innerHTML = `${langData.explore} <b>&rarr;</b>`;

    const voiceBtn = document.getElementById("voiceBtn");
    if (voiceBtn) voiceBtn.innerHTML = `<span>&#127908;</span> ${langData.hear}`;

    const audioSystem = document.querySelector(".sound-title strong");
    if (audioSystem) audioSystem.textContent = langData.audioSystem;

    const audioSubtitle = document.querySelector(".sound-title small");
    if (audioSubtitle) audioSubtitle.textContent = langData.audioSubtitle;

    const focusMode = document.querySelector("#engineRow .audio-info strong");
    if (focusMode) focusMode.textContent = langData.focusMode;

    const focusSubtitle = document.querySelector("#engineRow .audio-info small");
    if (focusSubtitle) focusSubtitle.textContent = langData.focusSubtitle;

    const yudaVoice = document.querySelector("#voiceRow .audio-info strong");
    if (yudaVoice) yudaVoice.textContent = langData.yudaVoice;

    const voiceRowSubtitle = document.querySelector("#voiceRow .audio-info small");
    if (voiceRowSubtitle) voiceRowSubtitle.textContent = langData.voiceSubtitle;

    const volumeText = document.querySelector(".volume > span");
    if (volumeText) volumeText.innerHTML = `&#128266; ${langData.volume}`;

    const aboutMeta = document.getElementById("aboutLabel");
    if (aboutMeta && langData.about) aboutMeta.textContent = langData.about[0];

    const aboutTitle = document.querySelector("#about h2");
    if (aboutTitle && langData.about) {
        aboutTitle.innerHTML = `<span>${langData.about[1]}</span><br><b>${langData.about[2]}</b>`;
    }

    const aboutText = document.querySelector("#about p");
    if (aboutText && langData.about) aboutText.textContent = langData.about[3];

    const playIntro = document.getElementById("voiceBtn2");
    if (playIntro && langData.about) playIntro.innerHTML = `&#127908; ${langData.about[4]}`;

    const contactMeta = document.getElementById("contactLabel");
    if (contactMeta && langData.contact) contactMeta.textContent = langData.contact[0];

    const contactTitle = document.querySelector(".contact-copy h2");
    if (contactTitle && langData.contact) {
        contactTitle.innerHTML = `<span>${langData.contact[1]}</span><br><b>${langData.contact[2]}</b>`;
    }

    const contactParagraph = document.querySelector(".contact-copy p");
    if (contactParagraph && langData.contact) contactParagraph.textContent = langData.contact[3];

    const nameLabel = document.querySelector("#name");
    if (nameLabel && langData.contact) {
        nameLabel.placeholder = langData.contact[4];
        const nameText = document.querySelector("label[for='name'] span");
        if (nameText) nameText.textContent = langData.contact[4];
    }

    const emailLabel = document.querySelector("#email");
    if (emailLabel && langData.contact) {
        emailLabel.placeholder = "email@kamu.com";
        const emailText = document.querySelector("label[for='email'] span");
        if (emailText) emailText.textContent = langData.contact[5];
    }

    const msgLabel = document.querySelector("#message");
    if (msgLabel && langData.contact) {
        msgLabel.placeholder = "Ceritakan project kamu...";
        const msgText = document.querySelector("label[for='message'] span");
        if (msgText) msgText.textContent = langData.contact[6];
    }

    const sendBtn = document.querySelector(".contact-form .btn");
    if (sendBtn && langData.contact) sendBtn.innerHTML = `${langData.contact[7]} <b>&rarr;</b>`;

    const statBlocks = document.querySelectorAll(".stats > div");
    const statLabels = langData.stats || [];
    statBlocks.forEach((block, index) => {
        const small = block.querySelector("small");
        if (small && statLabels[index]) small.textContent = statLabels[index];
    });

    const sectionHead = document.querySelectorAll(".section-head span");
    sectionHead.forEach((span, index) => {
        if (index === 0 && langData.section1) span.textContent = langData.section1[0];
        if (index === 1 && langData.section2) span.textContent = langData.section2[0];
        if (index === 2 && langData.section3) span.textContent = langData.section3[0];
    });

    const sectionH2 = document.querySelectorAll(".section-head h2");
    sectionH2.forEach((h2, index) => {
        if (index === 0 && langData.section1) h2.innerHTML = `${langData.section1[1]} <b>${langData.section1[2]}</b>`;
        if (index === 1 && langData.section2) h2.innerHTML = `${langData.section2[1]} <b>${langData.section2[2]}</b>`;
    });
}

const allTranslationSelectors = new Set([
    ...Object.keys(translations),

    ...Object.keys(koreanTranslations),

    ...Object.keys(additionalTranslations).flatMap(
        (language) =>
            Object.keys(
                additionalTranslations[language]
            )
    ),

    ...Object.keys(completeTranslations).flatMap(
        (language) =>
            Object.keys(
                completeTranslations[language]
            )
    ),

    ...Object.keys(regionalTranslations).flatMap(
        (language) =>
            Object.keys(
                regionalTranslations[language]
            )
    ),

    ...Object.keys(coverageExtras)
]);


allTranslationSelectors.forEach((selector) => {
    $$(selector).forEach((element) => {
        originalContent.set(
            element,
            element.innerHTML
        );

        originalPlaceholders.set(
            element,
            element.placeholder || ""
        );
    });
});


let currentLanguage = "EN";


/* =========================================================
   GET TRANSLATION
========================================================= */

function getTranslation(language, selector) {

    let result = null;

    /*
       1. BASE TRANSLATION
    */

    if (
        translations[selector] &&
        translations[selector][language]
    ) {
        result = translations[selector][language];
    }

    /*
       2. KOREAN
    */

    if (
        language === "KO" &&
        koreanTranslations[selector]
    ) {
        result = koreanTranslations[selector];
    }

    /*
       3. ADDITIONAL LANGUAGE
    */

    if (
        additionalTranslations[language] &&
        additionalTranslations[language][selector]
    ) {
        result =
            additionalTranslations[language][selector];
    }

    /*
       4. REGIONAL LANGUAGE
    */

    if (
        regionalTranslations[language] &&
        regionalTranslations[language][selector]
    ) {
        result =
            regionalTranslations[language][selector];
    }

    /*
       5. COMPLETE TRANSLATION
    */

    if (
        completeTranslations[language] &&
        completeTranslations[language][selector]
    ) {
        result =
            completeTranslations[language][selector];
    }

    return result;
}


/* =========================================================
   APPLY TRANSLATION
========================================================= */

function applyTranslation(
    selector,
    translation,
    language
) {

    if (translation === null || translation === undefined) {
        return;
    }

    const elements = $$(selector);

    elements.forEach((element, index) => {

        let text = translation;

        /*
           NAVIGATION
        */

        if (
            selector === "nav a" &&
            Array.isArray(translation)
        ) {
            text = translation[index];

            if (
                text === undefined ||
                text === null
            ) {
                return;
            }
        }

        /*
           ARRAY TRANSLATION
        */

        else if (
            Array.isArray(translation)
        ) {

            /*
               EN = index 0
               ID = index 1
            */

            if (translation.length >= 2) {

                const languageIndex =
                    language === "ID" ? 1 : 0;

                text =
                    translation[languageIndex];
            }

            else {
                text = translation[0];
            }
        }

        if (
            selector === "#name" ||
            selector === "#email" ||
            selector === "#message"
        ) {
            element.placeholder = text;
        }

        else {
            element.innerHTML = text;
        }
    });
}


/* =========================================================
   RESET ORIGINAL CONTENT
========================================================= */

function resetOriginalContent() {

    originalContent.forEach(
        (content, element) => {
            element.innerHTML = content;
        }
    );

    originalPlaceholders.forEach(
        (placeholder, element) => {
            element.placeholder = placeholder;
        }
    );
}


/* =========================================================
   LANGUAGE EXTRA
========================================================= */

function applyLanguageExtra(language) {

    const extra = languageExtras && languageExtras[language];

    if (!extra) {
        return;
    }

    if ($("#voiceBtn2") && extra[0]) {
        $("#voiceBtn2").innerHTML = extra[0];
    }

    if ($("#about h2") && extra[1]) {
        $("#about h2").innerHTML = extra[1];
    }

    if ($("#about p") && extra[2]) {
        $("#about p").innerHTML = extra[2];
    }

    if (
        $(".contact-copy h2") &&
        extra[3]
    ) {
        $(".contact-copy h2").innerHTML =
            extra[3];
    }

    if ($("#name") && extra[4]) {
        $("#name").placeholder = extra[4];
    }

    if ($("#email")) {

        $("#email").placeholder =
            extra[5] || "you@email.com";
    }

    if ($("#message")) {

        $("#message").placeholder =
            extra[6] ||
            extra[5] ||
            "Tell me about your project...";
    }
}


/* =========================================================
   SHARED LABELS
========================================================= */

function applySharedLabels(language) {

    const labels = sharedLabels && sharedLabels[language];

    if (!labels) {
        return;
    }

    const selectors = [
        ".hero .btn",
        "#engineRow .audio-info strong",
        "#engineRow .audio-info small",
        "#voiceRow .audio-info strong",
        "#voiceRow .audio-info small",
        ".stats > div:nth-child(1) small",
        ".stats > div:nth-child(2) small",
        ".stats > div:nth-child(3) em",
        ".stats > div:nth-child(3) small",
        ".stats > div:nth-child(4) em",
        ".stats > div:nth-child(4) small",
        "#voiceBtn2"
    ];

    selectors.forEach((selector, index) => {

        const element = $(selector);

        if (element && labels[index]) {
            element.innerHTML = labels[index];
        }
    });
}


/* =========================================================
   COVERAGE
========================================================= */

function applyCoverage(language) {

    const coverage =
        (translationCoverage && translationCoverage[language]) ||
        (translationCoverage && translationCoverage.ID) ||
        [];

    coverageSelectors.forEach(
        (selector, index) => {

            $$(selector).forEach(
                (element) => {

                    if (
                        coverage[index] !==
                        undefined
                    ) {
                        element.innerHTML =
                            coverage[index];
                    }
                }
            );
        }
    );


    Object.entries(
        coverageExtras
    ).forEach(
        ([selector, values]) => {

            $$(selector).forEach(
                (element) => {

                    element.innerHTML =
                        values[language] ||
                        values.ID ||
                        values.EN ||
                        "";
                }
            );
        }
    );
}


/* =========================================================
   SET LANGUAGE - FIXED
========================================================= */

function setLanguage(language) {

    currentLanguage = language;

    /*
       HTML LANG
    */

    document.documentElement.lang =
        languageCodes[language] || "en";


    /*
       RESET
    */

    resetOriginalContent();


    /*
       COLLECT SEMUA SELECTOR
       DARI SEMUA SISTEM TRANSLATION
    */

    const selectors = new Set([
        ...Object.keys(translations),

        ...Object.keys(koreanTranslations),

        ...(
            additionalTranslations[language]
                ? Object.keys(
                    additionalTranslations[language]
                )
                : []
        ),

        ...(
            completeTranslations[language]
                ? Object.keys(
                    completeTranslations[language]
                )
                : []
        ),

        ...(
            regionalTranslations[language]
                ? Object.keys(
                    regionalTranslations[language]
                )
                : []
        )
    ]);


    /*
       APPLY TRANSLATION
    */

    selectors.forEach((selector) => {

        const translation =
            getTranslation(
                language,
                selector
            );

        if (
            translation !== null &&
            translation !== undefined
        ) {
            applyTranslation(
                selector,
                translation,
                language
            );
        }
    });


    /*
       EXTRA
    */

    applyLanguageExtra(language);


    /*
       SHARED LABEL
    */

    applySharedLabels(language);


    /*
       COVERAGE
    */

    applyCoverage(language);


    /*
       CUSTOM PAGE TEXT
    */

    applyPageText(language);


    /*
       BUTTON LANGUAGE
    */

    if (langButton) {
        langButton.innerHTML =
            `${language}⌄`;
    }


    /*
       RTL ARABIC
    */

    if (language === "AR") {

        document.documentElement.dir =
            "rtl";

        document.body.classList.add(
            "rtl"
        );

    } else {

        document.documentElement.dir =
            "ltr";

        document.body.classList.remove(
            "rtl"
        );
    }
}


/* =========================================================
   LANGUAGE BUTTON
========================================================= */

const langButton = $("#langButton");
const languageMenu = $("#languageMenu");


safeAddEvent(
    langButton,
    "click",
    (event) => {
        if (event) {
            event.stopPropagation();
        }

        if (!languageMenu) {
            return;
        }

        const isOpen =
            languageMenu.classList.toggle(
                "open"
            );

        languageMenu.classList.toggle(
            "active",
            isOpen
        );
        languageMenu.classList.toggle(
            "show",
            isOpen
        );

        languageMenu.style.display =
            isOpen ? "grid" : "none";
        languageMenu.style.visibility =
            isOpen ? "visible" : "hidden";
        languageMenu.style.opacity =
            isOpen ? "1" : "0";
        languageMenu.style.transform =
            isOpen ? "translateY(0)" : "translateY(-6px)";

        langButton.setAttribute(
            "aria-expanded",
            String(isOpen)
        );
    }
);


if (languageMenu) {

    languageMenu
        .querySelectorAll(
            "[data-language]"
        )
        .forEach((option) => {

            option.addEventListener(
                "click",
                () => {

                    const language =
                        option.dataset.language;

                    if (language) {
                        setLanguage(language);
                    }

                    languageMenu.classList.remove(
                        "open"
                    );
                    languageMenu.classList.remove(
                        "active"
                    );
                    languageMenu.classList.remove(
                        "show"
                    );

                    if (langButton) {
                        langButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }
            );
        });
}


document.addEventListener(
    "click",
    (event) => {
        const target = event.target;

        if (
            target instanceof Element &&
            target.closest(
                ".language-switcher"
            )
        ) {
            return;
        }

        if (languageMenu) {
            languageMenu.classList.remove(
                "open"
            );
            languageMenu.classList.remove(
                "active"
            );
            languageMenu.classList.remove(
                "show"
            );
            languageMenu.style.display = "none";
            languageMenu.style.visibility = "hidden";
            languageMenu.style.opacity = "0";
            languageMenu.style.transform = "translateY(-6px)";
        }

        if (langButton) {
            langButton.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }
);

// The language popup stays open while interacting inside the switcher.
// Closing externally is handled only when the user clicks outside it.


/*
   DEFAULT LANGUAGE
*/

setLanguage("EN");


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    $$("main section[id]");

const navLinks =
    $$(".nav a");


window.addEventListener(
    "scroll",
    () => {

        let currentSection = "home";

        sections.forEach(
            (section) => {

                if (
                    window.scrollY >=
                    section.offsetTop - 200
                ) {
                    currentSection =
                        section.id;
                }
            }
        );


        navLinks.forEach(
            (link) => {

                link.classList.toggle(
                    "active",
                    link.getAttribute(
                        "href"
                    ) ===
                    `#${currentSection}`
                );
            }
        );

    },
    {
        passive: true
    }
);


/* =========================================================
   ENGINE AUDIO
========================================================= */

const engineAudio =
    $("#checkSound");

const engineButton =
    $("#checkSoundBtn");

const playEngine =
    $("#playEngine");

const engineRow =
    $("#engineRow");

const engineIcon =
    $("#checkSoundIcon");

const engineTime =
    $("#engineTime");

const volume =
    $("#volume");

const volumeValue =
    $("#volumeValue");


if (engineAudio && volume) {
    engineAudio.volume =
        Number(volume.value);
}


function setEngineState(isPlaying) {

    if (playEngine) {
        playEngine.textContent =
            isPlaying ? "Ⅱ" : "▶";

        playEngine.classList.toggle(
            "playing",
            isPlaying
        );
    }


    if (engineRow) {
        engineRow.classList.toggle(
            "active",
            isPlaying
        );
    }


    if (engineIcon) {
        engineIcon.textContent =
            isPlaying ? "⏸" : "🔊";
    }


    if (engineButton) {
        engineButton.classList.toggle(
            "playing",
            isPlaying
        );
    }
}


function toggleEngine() {

    if (!engineAudio) {
        return;
    }


    if (!engineAudio.paused) {

        engineAudio.pause();

        setEngineState(false);

        return;
    }


    engineAudio
        .play()
        .then(() => {

            setEngineState(true);

        })
        .catch(() => {

            alert(
                "File suara belum ditemukan.\n\n" +
                "Pastikan file:\n" +
                "cbr250rr-check-sound.mp3\n\n" +
                "berada di folder portfolio."
            );

            setEngineState(false);
        });
}


safeAddEvent(
    engineButton,
    "click",
    toggleEngine
);

safeAddEvent(
    playEngine,
    "click",
    toggleEngine
);


safeAddEvent(
    engineAudio,
    "timeupdate",
    () => {

        if (!engineTime) {
            return;
        }

        const minutes =
            Math.floor(
                engineAudio.currentTime / 60
            )
            .toString()
            .padStart(2, "0");


        const seconds =
            Math.floor(
                engineAudio.currentTime % 60
            )
            .toString()
            .padStart(2, "0");


        engineTime.textContent =
            `${minutes}:${seconds}`;
    }
);


safeAddEvent(
    engineAudio,
    "ended",
    () => {
        setEngineState(false);

        if (engineTime) {
            engineTime.textContent =
                "00:00";
        }
    }
);


safeAddEvent(
    volume,
    "input",
    () => {

        if (!engineAudio) {
            return;
        }

        const currentVolume =
            Number(volume.value);

        engineAudio.volume =
            currentVolume;

        if (volumeValue) {
            volumeValue.textContent =
                `${Math.round(
                    currentVolume * 100
                )}%`;
        }
    }
);


/* =========================================================
   VOICE TEXT
========================================================= */

const voiceTexts = {

    EN:
        "Hello, I am Firdaus Yuda Permana. I build digital experiences through creative development, interface design, and visual direction.",

    ID:
        "Halo, saya Firdaus Yuda Permana. Saya membangun pengalaman digital melalui pengembangan kreatif, desain interface, dan arah visual.",

    KO:
        "안녕하세요, 저는 피르다우스 유다 퍼르마나입니다. 크리에이티브 개발과 인터페이스 디자인, 비주얼 디렉션으로 디지털 경험을 만듭니다.",

    JA:
        "こんにちは、ファーダウス ユダです。クリエイティブ開発、インターフェースデザイン、ビジュアルディレクションでデジタル体験を作ります。",

    ZH:
        "你好，我是 Firdaus Yuda。我通过创意开发、界面设计和视觉指导打造数字体验。",

    AR:
        "مرحباً، أنا فيرداوس يودا. أصنع تجارب رقمية من خلال التطوير الإبداعي وتصميم الواجهات والتوجيه البصري.",

    ES:
        "Hola, soy Firdaus Yuda. Creo experiencias digitales mediante desarrollo creativo, diseño de interfaces y dirección visual.",

    FR:
        "Bonjour, je suis Firdaus Yuda. Je crée des expériences numériques grâce au développement créatif, au design d'interfaces et à la direction visuelle.",

    DE:
        "Hallo, ich bin Firdaus Yuda. Ich entwickle digitale Erlebnisse durch kreative Entwicklung, Interface-Design und visuelle Gestaltung.",

    PT:
        "Olá, sou Firdaus Yuda. Crio experiências digitais por meio de desenvolvimento criativo, design de interfaces e direção visual.",

    IT:
        "Ciao, sono Firdaus Yuda. Creo esperienze digitali attraverso sviluppo creativo, design delle interfacce e direzione visiva.",

    RU:
        "Здравствуйте, я Firdaus Yuda. Я создаю цифровые впечатления с помощью креативной разработки, дизайна интерфейсов и визуального направления.",

    JV:
        "Halo, aku Firdaus Yuda. Aku nggawe pengalaman digital liwat pangembangan kreatif, desain antarmuka, lan arah visual.",

    SU:
        "Halo, abdi Firdaus Yuda. Abdi ngawangun pangalaman digital ngaliwatan pamekaran kreatif, desain antarmuka, sareng arah visual.",

    MAD:
        "Halo, sengko’ Firdaus Yuda. Sengko’ ngabangun pengalaman digital lewat pangembangan kreatif, desain antarmuka, ben arah visual.",

    MIN:
        "Halo, ambo Firdaus Yuda. Ambo mambangun pengalaman digital melalui pangembangan kreatif, desain antarmuko, jo arah visual.",

    BAL:
        "Om swastiastu, tiang Firdaus Yuda. Tiang ngrancang pengalaman digital nganggé pangembangan kreatif, desain antarmuka, miwah arah visual.",

    BUG:
        "Halo, iya Firdaus Yuda. Iya mambangun pengalaman digital lewat pangembangan kreatif, desain antarmuka, wan arah visual.",

    ACE:
        "Salam, lon Firdaus Yuda. Lon peugot pengalaman digital ngon pangembangan kreatif, desain antarmuka, ngon arah visual.",

    BJN:
        "Halo, ulun Firdaus Yuda. Ulun mambangun pengalaman digital lewat pangembangan kreatif, desain antarmuka, wan arah visual.",

    BTK:
        "Horas, au Firdaus Yuda. Au mambangun pengalaman digital marhite pangembangan kreatif, desain antarmuka, dohot arah visual.",

    SAS:
        "Halo, tiang Firdaus Yuda. Tiang ngawangun pengalaman digital leq pangembangan kreatif, desain antarmuka, lan arah visual.",

    MAK:
        "Halo, nak Firdaus Yuda. Nak kabbua pengalaman digital lewat pangembangan kreatif, desain antarmuka, na arah visual.",

    PLM:
        "Halo, aku Firdaus Yuda. Aku mbangun pengalaman digital lewat pengembangan kreatif, desain antarmuko, dan arah visual."
};


/* =========================================================
   SPEECH SYNTHESIS
========================================================= */

const voiceLanguages = {

    EN: "en-US",
    ID: "id-ID",
    KO: "ko-KR",
    JA: "ja-JP",
    ZH: "zh-CN",
    AR: "ar-SA",
    ES: "es-ES",
    FR: "fr-FR",
    DE: "de-DE",
    PT: "pt-BR",
    IT: "it-IT",
    RU: "ru-RU",

    JV: "jv-ID",
    SU: "su-ID",
    MAD: "mad-ID",
    MIN: "min-ID",
    BAL: "ban-ID",
    BUG: "bug-ID",
    ACE: "ace-ID",
    BJN: "bjn-ID",
    BTK: "bbc-ID",
    SAS: "sas-ID",
    MAK: "mak-ID",
    PLM: "plm-ID"
};


function speakVoice() {

    if (!("speechSynthesis" in window)) {

        alert(
            "Browser kamu tidak mendukung Web Speech API."
        );

        return;
    }


    speechSynthesis.cancel();


    const text =
        voiceTexts[currentLanguage] ||
        voiceTexts.EN;


    const voice =
        new SpeechSynthesisUtterance(text);


    voice.lang =
        voiceLanguages[currentLanguage] ||
        "en-US";


    voice.rate = 0.82;
    voice.pitch = 0.72;


    if (volume) {
        voice.volume =
            Number(volume.value);
    }


    speechSynthesis.speak(voice);
}


/* =========================================================
   VOICE BUTTONS
========================================================= */

const voiceBtn =
    $("#voiceBtn");

const voiceBtn2 =
    $("#voiceBtn2");

const playVoice =
    $("#playVoice");

const voiceRow =
    $("#voiceRow");


safeAddEvent(
    voiceBtn,
    "click",
    speakVoice
);


safeAddEvent(
    voiceBtn2,
    "click",
    speakVoice
);


let voiceTimer = null;


safeAddEvent(
    playVoice,
    "click",
    () => {

        if (!("speechSynthesis" in window)) {
            return;
        }


        /*
           Kalau sedang berbicara,
           klik lagi = stop
        */

        if (speechSynthesis.speaking) {

            speechSynthesis.cancel();

            playVoice.textContent =
                "▶";

            playVoice.classList.remove(
                "playing"
            );

            if (voiceRow) {
                voiceRow.classList.remove(
                    "active"
                );
            }

            clearTimeout(voiceTimer);

            return;
        }


        speakVoice();


        playVoice.textContent =
            "Ⅱ";

        playVoice.classList.add(
            "playing"
        );


        if (voiceRow) {
            voiceRow.classList.add(
                "active"
            );
        }


        clearTimeout(voiceTimer);


        voiceTimer =
            setTimeout(() => {

                playVoice.textContent =
                    "▶";

                playVoice.classList.remove(
                    "playing"
                );

                if (voiceRow) {
                    voiceRow.classList.remove(
                        "active"
                    );
                }

            }, 10000);
    }
);


/*
   Saat speech benar-benar selesai
*/

if ("speechSynthesis" in window) {

    const checkSpeech =
        setInterval(() => {

            if (
                !speechSynthesis.speaking &&
                playVoice &&
                playVoice.classList.contains(
                    "playing"
                )
            ) {

                playVoice.textContent =
                    "▶";

                playVoice.classList.remove(
                    "playing"
                );

                if (voiceRow) {
                    voiceRow.classList.remove(
                        "active"
                    );
                }
            }

        }, 300);
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements =
    $$(".section, .stats, .cards article, .gallery-grid, .cta");


if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";


                        revealObserver.unobserve(
                            entry.target
                        );
                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    revealElements.forEach(
        (element) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(35px)";

            element.style.transition =
                "opacity .8s ease, transform .8s ease";


            revealObserver.observe(
                element
            );
        }
    );

} else {

    /*
       Fallback browser lama
    */

    revealElements.forEach(
        (element) => {

            element.style.opacity =
                "1";

            element.style.transform =
                "translateY(0)";
        }
    );
}