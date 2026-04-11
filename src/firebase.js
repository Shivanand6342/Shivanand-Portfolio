import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);

// -----------------------------------------------------------------------------
// Component Data Sequence (Ordered by Portfolio usage)
// 0. Theme Config      -> getThemeConfig  (injected as CSS vars before render)
// 1. Header & About    -> getProfileData
// 2. Hero App-level    -> getFileUrl
// 3. Hero Sub-level    -> getHeroMarqueeData
// 4. MeasurableResults -> getMeasurableResultsData
// 5. Testimonials      -> getTestimonialsData
// 6. TechStack         -> getTechStackData, getCertificationsData
// 7. Experience        -> getExperienceData
// -----------------------------------------------------------------------------

/**
 * Fetches the dynamic theme color configuration from Firestore.
 * Returns a palette object used to inject CSS custom properties at runtime,
 * enabling live theme switching without code changes.
 *
 * @returns {Promise<Object>} Theme palette with PrimaryColor, PrimaryColorDark, ContactBgColor, AccentColor.
 */
export const getThemeConfig = async () => {
    let themeConfig = null;
    try {
        const snap = await getDoc(doc(db, 'Portfolio/ThemeConfig'));
        if (snap.exists()) {
            themeConfig = snap.data();
        }
    } catch (error) {
        console.error("Error fetching theme config:", error);
    }

    console.log('theme config: ', themeConfig);

    return {
        PrimaryColor: themeConfig?.PrimaryColor || '#f97316',
        PrimaryColorDark: themeConfig?.PrimaryColorDark || '#ea580c',
        ContactBgColor: themeConfig?.ContactBgColor || '#ff5d00',
        AccentColor: themeConfig?.AccentColor || '#FF6B00'
    };
};

/**
 * Fetches the user profile data including socials, designation, and bio.
 * Provides standard fallback data if Firestore references do not exist.
 *
 * @returns {Promise<Object>} An object containing name, tagline, bio, experience, and social links.
 */
export const getProfileData = async () => {
    let firestoreData = {};

    try {
        const [socialsSnap, desigSnap, aboutMeSnap] = await Promise.all([
            getDoc(doc(db, 'Portfolio/Socials')),
            getDoc(doc(db, 'Portfolio/Designation')),
            getDoc(doc(db, 'Portfolio/AboutMe'))
        ]);

        if (socialsSnap.exists()) {
            const sData = socialsSnap.data();
            if (sData.GitHub) firestoreData.github = sData.GitHub;
            if (sData.LinkedIn) firestoreData.linkedin = sData.LinkedIn;
            if (sData.Gmail) firestoreData.email = sData.Gmail;
            if (sData.Trailhead) firestoreData.trailhead = sData.Trailhead;
        }

        if (desigSnap.exists()) {
            const dData = desigSnap.data();
            if (dData.Role) firestoreData.tagline = dData.Role;
        }

        if (aboutMeSnap.exists()) {
            const aData = aboutMeSnap.data();
            if (aData.AboutTitle) firestoreData.aboutTitle = aData.AboutTitle;
            if (aData.Bio) firestoreData.bio = aData.Bio;
            if (aData.YearsOfExperience) firestoreData.yearsOfExperience = aData.YearsOfExperience;
            if (aData.CVFilepath) firestoreData.cvFilepath = aData.CVFilepath;
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }

    return {
        name: "SHIVANAND",
        tagline: "SALESFORCE DEVELOPER",
        yearsOfExperience: "4+",
        aboutTitle: "THE 'WHY' BEHIND WHO I AM",
        bio: [
            "When I was growing up, my parents, my teachers, all the authority figures would tell me to do certain things, but they would never explain why. This used to confuse my little brain. I could not articulate it back then, but I always felt a strong need to understand the reasoning behind things. Because I knew that is how we evolve our understanding, our knowledge, and ultimately ourselves.",
            "My childhood shaped me into the person and the engineer I am today. Everybody says it, but 'why' is truly the tool I use the most. Its such an important part of me that it has featured heavily in performance reviews at my previous role, mostly as a pro :). And that is also why, historically, I've been the engineer who gets routed the unclear or difficult problems, the ones other developers would rather avoid."
        ],
        linkedin: "https://www.linkedin.com/in/shivanand-vishwakarma-bb6580121/",
        github: "https://github.com/Shivanand6342/",
        email: "shivanandv66@gmail.com",
        ...firestoreData
    };
};

/**
 * Retrieves the public download URL for a file stored in Firebase Storage.
 * Provides safe dummy placeholders if the file represents a template or if fetching fails.
 *
 * @param {string} path - The file path relative to the Google Cloud Storage bucket.
 * @returns {Promise<string>} An accessible URL for the file.
 */
export const getFileUrl = async (path) => {
    if (!path) return "#";

    // Bypass Firebase Storage for externally hosted links or natively hosted public assets
    if (path.startsWith('http') || path.startsWith('/')) {
        return path;
    }

    try {
        const fileRef = ref(storage, path);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error("Error fetching file URL:", error);
        return "#";
    }
};

/**
 * Fetches a list of dynamic skills to display across the Hero section infinite marquee.
 *
 * @returns {Promise<string[]>} Array of skills mapped from the Firestore document.
 */
export const getHeroMarqueeData = async () => {
    let firestoreData = {};

    try {
        const marqueeSnap = await getDoc(doc(db, 'Portfolio/Marquee'));
        if (marqueeSnap.exists()) {
            firestoreData = marqueeSnap.data();
        }
    } catch (error) {
        console.error("Error fetching hero marquee data:", error);
    }

    return firestoreData.Skills || [];
};

/**
 * Fetches measurable performance impact records from the database.
 * Falls back to mock UI testing data if no document is detected.
 *
 * @returns {Promise<Object[]>} Array of result figures for rendering impact stat cards.
 */
export const getMeasurableResultsData = async () => {
    let firestoreData = null;

    try {
        const resultsSnap = await getDoc(doc(db, 'Portfolio/MeasurableResult'));
        if (resultsSnap.exists()) {
            firestoreData = resultsSnap.data().MeasurableResults;
        }
    } catch (error) {
        console.error("Error fetching measurable results data:", error);
    }

    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
        let measurableResults = [];

        for (let i = 0; i < firestoreData.length; i++) {
            measurableResults.push({
                company: firestoreData[i].Company,
                category: firestoreData[i].Category,
                stat: firestoreData[i].Stat,
                subtext: firestoreData[i].Subtext
            });
        }

        return measurableResults;
    }
};

/**
 * Fetches professional recommendations for the Testimonials component.
 * Falls back to detailed mocks formatted to test carousel bounding capabilities.
 *
 * @returns {Promise<Object[]>} Array of individual endorsement objects.
 */
export const getTestimonialsData = async () => {
    let firestoreData = null;

    try {
        const snap = await getDoc(doc(db, 'Portfolio/Testimonials'));
        if (snap.exists()) {
            firestoreData = snap.data().Recommendations;
        }
    } catch (error) {
        console.error("Error fetching testimonials data:", error);
    }

    if (firestoreData && Array.isArray(firestoreData) && firestoreData.length > 0) {
        let testimonialResults = [];

        for (let i = 0; i < firestoreData.length; i++) {
            testimonialResults.push({
                id: 't' + (i + 1),
                text: firestoreData[i].Text,
                name: firestoreData[i].Name,
                role: firestoreData[i].Role,
                relation: firestoreData[i].Relation,
                date: firestoreData[i].Date
            });
        }

        return testimonialResults;
    }
};

/**
 * Fetches mapped tech stack groups and internal item categories from Firestore.
 * Automatically aligns the returned output cleanly based on 'TechStackSequence'.
 *
 * @returns {Promise<Object[]>} Arrays grouping technologies with specific category references.
 */
export const getTechStackData = async () => {
    let fireStoreDataSequence = [];
    let firestoreData = {};

    try {
        const [techSnapSequence, techSnap] = await Promise.all([
            getDoc(doc(db, 'Portfolio/TechStackSequence')),
            getDoc(doc(db, 'Portfolio/TechStack'))
        ]);

        if (techSnapSequence.exists()) {
            fireStoreDataSequence = techSnapSequence.data();
        }

        if (techSnap.exists()) {
            firestoreData = techSnap.data();
        }
    } catch (error) {
        console.error("Error fetching tech stack data:", error);
    }

    var techStack = Object.entries(firestoreData).map(([category, items]) => ({
        category,
        items: Object.entries(items).map(([name, icon]) => ({ name, icon }))
    }));

    if (fireStoreDataSequence && fireStoreDataSequence.Sequence) {
        const sequence = fireStoreDataSequence.Sequence;
        techStack.sort((a, b) => {
            const indexA = sequence.indexOf(a.category);
            const indexB = sequence.indexOf(b.category);

            // Put items not explicitly in sequence list at the bottom
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });
    }

    return techStack;
};

/**
 * Queries and parses professional certifications.
 *
 * @returns {Promise<Object[]>} Array of chronological certification elements mapped with links.
 */
export const getCertificationsData = async () => {
    let firestoreData = {};

    try {
        const certsSnap = await getDoc(doc(db, 'Portfolio/Certifications'));
        if (certsSnap.exists()) {
            firestoreData = certsSnap.data();
        }
    } catch (error) {
        console.error("Error fetching certifications data:", error);
    }

    var certs = Object.entries(firestoreData).map(([name, [date, url]]) => ({
        name,
        date,
        url
    }));

    // Ensure the latest certification (by date) appears on top
    return certs.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Evaluates the complex Experience Collection by strictly following 'ExperienceSequence'.
 * Builds out detailed project histories mapped with associated timeline, roles, and descriptions.
 * (Dead mock data code removed for clarity)
 *
 * @returns {Promise<Object[]>} Elaborate list of user experiences structured by role and date.
 */
export const getExperienceData = async () => {
    let experienceData = [];
    let fireStoreDataSequence = [];
    let firestoreData = {};

    try {
        const expSnapSequence = await getDoc(doc(db, 'Portfolio/Experience/Experience1/ExperienceSequence'));
        if (expSnapSequence.exists()) {
            fireStoreDataSequence = expSnapSequence.data();
        }

        fireStoreDataSequence = fireStoreDataSequence.Sequence;

        for (let i = 0; i < fireStoreDataSequence.length; i++) {
            const expSnap = await getDoc(doc(db, 'Portfolio/Experience/Experience1/' + fireStoreDataSequence[i]));

            if (expSnap.exists()) {
                firestoreData = expSnap.data();

                let projects = [];

                for (let j = 0; j < firestoreData.Projects.length; j++) {
                    projects.push({
                        id: "p" + (j + 1),
                        role: firestoreData.Projects[j].Role,
                        tags: firestoreData.Projects[j].Tags,
                        description: firestoreData.Projects[j].Description,
                        impact: firestoreData.Projects[j].Impact,
                        impactColor: firestoreData.Projects[j].ImpactColor,
                        techCount: firestoreData.Projects[j].TechCount,
                        techUsed: firestoreData.Projects[j].TechUsed
                    });
                }

                experienceData.push({
                    id: "exp" + (i + 1),
                    companyName: fireStoreDataSequence[i],
                    timeline: firestoreData.Timeline,
                    position: firestoreData.Position,
                    color: firestoreData.Color,
                    projects: projects
                });
            }
        }
    } catch (error) {
        console.error("Error fetching experience data:", error);
    }

    return experienceData;
};

/**
 * Fetches the dynamic content data for the Contact section.
 * Falls back to default copy strings if no document is detected.
 *
 * @returns {Promise<Object>} An object containing heading lines, button texts, and marquee string.
 */
export const getContactData = async () => {
    let firestoreData = null;

    try {
        const contactSnap = await getDoc(doc(db, 'Portfolio/Contact'));
        if (contactSnap.exists()) {
            firestoreData = contactSnap.data().ContactMe;
        }
    } catch (error) {
        console.error("Error fetching contact data:", error);
    }

    if (firestoreData) {
        return {
            headingLines: firestoreData.HeadingLines,
            buttonTexts: {
                primary: firestoreData.ButtonTexts.Primary,
                secondary: firestoreData.ButtonTexts.Secondary
            },
            marqueeText: firestoreData.MarqueeText
        };
    }
};
