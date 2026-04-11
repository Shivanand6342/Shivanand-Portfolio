import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Contact from './components/Contact';
import TechStack from './components/TechStack';
import MeasurableResults from './components/MeasurableResults';
import Testimonials from './components/Testimonials';
import { getProfileData, getExperienceData, getFileUrl, getMeasurableResultsData, getTestimonialsData, getContactData, getThemeConfig } from './firebase';

/**
 * Converts a hex color string (e.g. "#f97316") to an "R, G, B" string for rgba() usage.
 * @param {string} hex
 * @returns {string}
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '249, 115, 22'; // fallback orange-500
};

/**
 * Root Application Component.
 * Orchestrates the loading of critical external data from Firebase and initializes the global layout structure.
 * 
 * @returns {JSX.Element} The fully rendered application UI with sequential loading boundaries.
 */
function App() {
    const [profileData, setProfileData] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [measurableResults, setMeasurableResults] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [contactData, setContactData] = useState(null);
    const [cvUrl, setCvUrl] = useState('#');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Enforce dark mode on the document body
        document.documentElement.classList.add('dark');

        const fetchData = async () => {
            try {
                // 0. Theme Config — inject CSS custom properties before any component renders
                const theme = await getThemeConfig();
                const root = document.documentElement.style;
                root.setProperty('--theme-color', theme.PrimaryColor);
                root.setProperty('--theme-color-dark', theme.PrimaryColorDark);
                root.setProperty('--theme-color-contact', theme.ContactBgColor);
                root.setProperty('--theme-color-accent', theme.AccentColor);
                root.setProperty('--theme-color-rgb', hexToRgb(theme.PrimaryColor));
                root.setProperty('--theme-color-accent-rgb', hexToRgb(theme.AccentColor));

                const profile = await getProfileData();
                setProfileData(profile);

                const exps = await getExperienceData();
                setExperiences(exps);

                const results = await getMeasurableResultsData();
                setMeasurableResults(results);

                const tests = await getTestimonialsData();
                setTestimonials(tests);

                const cData = await getContactData();
                setContactData(cData);

                if (profile?.cvFilepath) {
                    const cv = await getFileUrl(profile.cvFilepath);
                    setCvUrl(cv);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[var(--theme-color)] border-solid border-r-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 font-sans selection:bg-[var(--theme-color)]/30 selection:text-[var(--theme-color)] overflow-x-hidden">
            <Header profileData={profileData} />

            <main>
                <Hero profileData={profileData} cvUrl={cvUrl} />
                <About profileData={profileData} />
                <MeasurableResults resultsData={measurableResults} />
                <Testimonials testimonials={testimonials} />
                <TechStack />
                <Experience profileData={profileData} experiences={experiences} />
                <Contact profileData={profileData} contactData={contactData} />
            </main>
        </div>
    );
}

export default App;
