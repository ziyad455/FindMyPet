// Landing Page component
// Modern design with GSAP animations

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { useLanguage, useAuth } from '../context';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Import required modules
import { Autoplay, Pagination } from 'swiper/modules';

// Import images
import image1 from '../assets/image_1.png';
import image2 from '../assets/image_2.png';
import finaleResulte from '../assets/finale_resulte.png';

export const LandingPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  // Determine CTA destination - if still loading auth, default to login
  const ctaPath = authLoading ? '/login' : (user ? '/submit' : '/register');

  useEffect(() => {
    // Hero animations
    const heroTl = gsap.timeline();
    heroTl.fromTo(
      '.hero-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
    heroTl.fromTo(
      '.hero-subtitle',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    );
    heroTl.fromTo(
      '.hero-description',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    );
    heroTl.fromTo(
      '.hero-cta',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' },
      '-=0.2'
    );

    // Floating animation for decorative elements
    gsap.to('.float-element', {
      y: -15,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.3
    });
  }, []);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 text-white py-24 lg:py-32 overflow-hidden"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="float-element absolute top-20 left-[10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="float-element absolute bottom-20 right-[10%] w-96 h-96 bg-primary-400/20 rounded-full blur-3xl" />
          <div className="float-element absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="hero-subtitle inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {t('landing.subtitle')}
            </div>

            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('landing.title')}
            </h1>

            <p className="hero-description text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('landing.description')}
            </p>

            <Link
              to={ctaPath}
              className="hero-cta inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-600 font-semibold rounded-2xl shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-black/30 hover:-translate-y-1 transition-all duration-300 text-lg group"
            >
              {t('landing.ctaButton')}
              <svg
                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Swiper Carousel Section */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24" viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none">
            <path d="M0 96L60 85.3C120 75 240 53 360 48C480 43 600 53 720 58.7C840 64 960 64 1080 58.7C1200 53 1320 43 1380 37.3L1440 32V96H1380C1320 96 1200 96 1080 96C960 96 840 96 720 96C600 96 480 96 360 96C240 96 120 96 60 96H0Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>

      {/* Swiper Section */}
      <section className="py-20 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">
              {t('landing.visualJourney.title')}
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto" />
          </div>

          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            className="rounded-[3rem] shadow-2xl shadow-primary-500/10 overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-white border-8 border-white"
          >
            {/* Slide 1 - image_1.png */}
            <SwiperSlide>
              <div className="relative h-full w-full overflow-hidden">
                <img src={image1} alt="Step 1" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-bold mb-4 w-fit">Step 1</span>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight uppercase tracking-tight">{t('landing.howItWorks.step1.title')}</h3>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 2 - image_2.png */}
            <SwiperSlide>
              <div className="relative h-full w-full overflow-hidden">
                <img src={image2} alt="Step 2" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-bold mb-4 w-fit">Step 2</span>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight uppercase tracking-tight">{t('landing.howItWorks.step2.title')}</h3>
                </div>
              </div>
            </SwiperSlide>

            {/* Slide 3 - finale_resulte.png */}
            <SwiperSlide>
              <div className="relative h-full w-full overflow-hidden">
                <img src={finaleResulte} alt="Final Result" className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-bold mb-4 w-fit">Final Result</span>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight uppercase tracking-tight">{t('landing.howItWorks.step4.title')}</h3>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <style>{`
          .swiper-pagination-bullet {
            background: white;
            opacity: 0.5;
            width: 10px;
            height: 10px;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background: white !important;
            opacity: 1;
            width: 30px !important;
            border-radius: 5px !important;
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.features.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/25">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature1.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {t('landing.features.feature1.description')}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/25">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature2.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {t('landing.features.feature2.description')}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 border border-transparent hover:border-gray-100 flex flex-col h-full">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-primary-500/25">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t('landing.features.feature3.title')}
              </h3>
              <p className="text-gray-600 leading-relaxed flex-grow">
                {t('landing.features.feature3.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={stepsRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.howItWorks.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="relative group flex flex-col h-full">
                <div className="relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-100/50 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
                  {/* Step number */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-5 mx-auto shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform duration-300">
                    {step}
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-3 text-center">
                    {t(`landing.howItWorks.step${step}.title`)}
                  </h3>
                  <p className="text-gray-600 text-center text-sm leading-relaxed flex-grow">
                    {t(`landing.howItWorks.step${step}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Link
              to={ctaPath}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-2xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-1 transition-all duration-300 text-lg group"
            >
              {t('landing.ctaButton')}
              <svg
                className={`w-5 h-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
