"use client";

import { 
  EnvelopeIcon, 
  CodeBracketIcon, 
  BriefcaseIcon,
  CommandLineIcon,
  MapIcon,
  ChartBarIcon,
  CpuChipIcon,
  MagnifyingGlassIcon,
  PresentationChartLineIcon,
  BoltIcon,
  SwatchIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback, useMemo } from 'react';
import PerformanceMonitor from './components/PerformanceMonitor';

export default function Home() {
  const [subText, setSubText] = useState('');
  const [subIndex, setSubIndex] = useState(0);
  const [isSubDeleting, setIsSubDeleting] = useState(false);
  const [showSubText, setShowSubText] = useState(false);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Memoized constants to prevent recreation on every render
  const fullSubText = useMemo(() => "Full Stack Developer & GIS Specialist passionate about creating innovative solutions for spatial data analysis and web applications", []);

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback((sectionId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Flip card handler
  const handleCardFlip = useCallback((index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  }, []);

  // Memoized project data to prevent recreation
  const projectsData = useMemo(() => [
    {
      icon: MapIcon,
      title: "Spatial Data Analysis Platform",
      description: "A comprehensive GIS application for spatial data analysis using Python, Folium, and machine learning algorithms.",
      technologies: [
        { icon: CommandLineIcon, name: "Python" },
        { icon: MapIcon, name: "Folium" },
        { icon: ChartBarIcon, name: "GeoPandas" }
      ],
      gradientFrom: "gray-700",
      gradientTo: "gray-600",
      details: "This project demonstrates advanced spatial data processing capabilities, including clustering analysis, geographic visualization, and interactive mapping features. Built with modern Python libraries for optimal performance and user experience."
    },
    {
      icon: CpuChipIcon,
      title: "Clustering Analysis with DBSCAN",
      description: "Machine learning project implementing DBSCAN clustering algorithm for spatial pattern recognition and analysis.",
      technologies: [
        { icon: CpuChipIcon, name: "Scikit-learn" },
        { icon: MagnifyingGlassIcon, name: "DBSCAN" },
        { icon: PresentationChartLineIcon, name: "NumPy" }
      ],
      gradientFrom: "gray-600",
      gradientTo: "gray-500",
      details: "Advanced machine learning implementation focusing on spatial clustering patterns. Features include noise reduction, cluster validation, and interactive result visualization with real-time parameter adjustment capabilities."
    },
    {
      icon: CodeBracketIcon,
      title: "Portfolio Website",
      description: "A modern portfolio website built with Next.js and Tailwind CSS showcasing GIS and development projects.",
      technologies: [
        { icon: BoltIcon, name: "Next.js" },
        { icon: SwatchIcon, name: "Tailwind" },
        { icon: DocumentTextIcon, name: "TypeScript" }
      ],
      gradientFrom: "gray-700",
      gradientTo: "gray-500",
      details: "Modern, responsive portfolio website featuring smooth animations, performance optimizations, and a clean design. Built with Next.js 14, TypeScript, and Tailwind CSS for optimal performance and maintainability."
    }
  ], []);

  // Memoized skills data
  const skillsData = useMemo(() => [
    { icon: CommandLineIcon, text: "Python & Geospatial Libraries (Folium, GeoPandas)", color: "blue" },
    { icon: CpuChipIcon, text: "Machine Learning (Scikit-learn, DBSCAN)", color: "purple" },
    { icon: CodeBracketIcon, text: "React & Next.js", color: "green" },
    { icon: DocumentTextIcon, text: "TypeScript & Tailwind CSS", color: "yellow" },
    { icon: MapIcon, text: "GIS Software (ArcGIS, QGIS)", color: "red" },
    { icon: ChartBarIcon, text: "Spatial Data Analysis & Visualization", color: "indigo" }
  ], []);

  // Optimized subtitle animation with useCallback
  const typeSubText = useCallback(() => {
    if (!showSubText) {
      const timeout = setTimeout(() => {
        setShowSubText(true);
      }, 1000);
      return () => clearTimeout(timeout);
    } else if (showSubText && !isSubDeleting && subIndex < fullSubText.length) {
      const timeout = setTimeout(() => {
        setSubText(fullSubText.slice(0, subIndex + 1));
        setSubIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (showSubText && !isSubDeleting && subIndex === fullSubText.length) {
      const timeout = setTimeout(() => {
        setIsSubDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (showSubText && isSubDeleting && subIndex > 0) {
      const timeout = setTimeout(() => {
        setSubText(fullSubText.slice(0, subIndex - 1));
        setSubIndex(prev => prev - 1);
      }, 20);
      return () => clearTimeout(timeout);
    } else if (showSubText && isSubDeleting && subIndex === 0) {
      setIsSubDeleting(false);
      setSubIndex(0);
      setShowSubText(false);
    }
  }, [showSubText, subIndex, isSubDeleting, fullSubText]);

  // Optimized useEffect for subtitle animation
  useEffect(() => {
    const cleanup = typeSubText();
    return cleanup;
  }, [typeSubText]);

  return (
    <div className="dark-theme min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-800/80 backdrop-blur-md z-50 border-b border-gray-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-white hover:text-gray-300 transition-all duration-300 hover:scale-105 cursor-pointer">
              Portfolio
            </div>
            <div className="hidden md:flex space-x-8">
              <a 
                href="#home" 
                onClick={handleScroll('home')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
              >
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#about" 
                onClick={handleScroll('about')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#projects" 
                onClick={handleScroll('projects')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
              >
                Projects
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
              <a 
                href="#contact" 
                onClick={handleScroll('contact')}
                className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-110 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full"></span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6">
              Hi, I&apos;m Aden Guo
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {subText}<span className="animate-pulse">|</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="group bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 relative overflow-hidden"
              >
                <span className="relative z-10">View My Work</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <a 
                href="/cv.pdf" 
                download="AdenGuo_CV.pdf"
                className="group border border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 text-center relative overflow-hidden"
              >
                <span className="relative z-10">Download CV</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/50 to-gray-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-white mb-12 hover:text-gray-300 transition-colors duration-300">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6">
                  I&apos;m a passionate developer and GIS specialist with expertise in both modern web technologies and geospatial applications. 
                  I love creating innovative solutions that combine spatial data analysis with user-friendly web interfaces.
                </p>
                <div className="space-y-4">
                  {skillsData.map((skill, index) => (
                    <div key={index} className="flex items-center group hover:bg-gray-700/50 p-2 rounded-lg transition-all duration-300 hover:scale-105">
                      <skill.icon className={`w-5 h-5 text-gray-400 mr-3 group-hover:text-${skill.color}-400 transition-colors duration-300`} />
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{skill.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-gray-600 to-gray-700 p-1 rounded-lg">
                <div className="bg-gray-800 rounded-lg p-8">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">AG</span>
                    </div>
                    <h3 className="text-xl font-semibold text-white">Aden Guo</h3>
                    <p className="text-gray-300">Full Stack Developer & GIS Specialist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12 hover:text-gray-300 transition-colors duration-300">My Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectsData.map((project, index) => (
              <div key={index} className="group relative h-96 perspective-1000">
                <div 
                  className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                    flippedCards.includes(index) ? 'rotate-y-180' : ''
                  }`}
                  onClick={() => handleCardFlip(index)}
                >
                  {/* Front of card */}
                  <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-600/50">
                    <div className={`h-48 bg-gradient-to-br from-${project.gradientFrom}/30 to-${project.gradientTo}/30 flex items-center justify-center group-hover:from-${project.gradientTo}/40 group-hover:to-${project.gradientFrom}/40 transition-all duration-500 relative overflow-hidden`}>
                      <project.icon className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-gray-300 transition-colors duration-300">{project.title}</h3>
                      <p className="text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-gray-700/50 text-gray-200 text-sm rounded-full flex items-center gap-1 hover:bg-gray-600/70 hover:scale-105 transition-all duration-300 border border-gray-600/30">
                            <tech.icon className="w-3 h-3" />
                            {tech.name}
                          </span>
                        ))}
                      </div>
                      <div className="text-center text-gray-400 text-sm">
                        Click to see more details
                      </div>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div className="absolute w-full h-full backface-hidden bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-600/50 rotate-y-180">
                    <div className="p-6 h-full flex flex-col">
                      <h3 className="text-xl font-semibold text-white mb-4">{project.title}</h3>
                      <p className="text-gray-300 mb-6 flex-grow">{project.details}</p>
                      <div className="flex gap-2 mt-auto">
                        <button className="flex-1 bg-gray-700/50 hover:bg-gray-600/70 text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg border border-gray-600/30">
                          Live Demo
                        </button>
                        <button className="flex-1 border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:text-white py-2 rounded-lg text-sm font-semibold transition-all duration-300 hover:scale-105 hover:border-gray-500/70">
                          GitHub
                        </button>
                      </div>
                      <div className="text-center text-gray-400 text-sm mt-2">
                        Click to flip back
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800/60 backdrop-blur-md rounded-2xl p-8 border border-gray-700/50 shadow-xl">
            <h2 className="text-3xl font-bold text-center text-white mb-12 hover:text-gray-300 transition-colors duration-300">Get In Touch</h2>
            <p className="text-lg text-gray-300 mb-8 text-center">
              I&apos;m always interested in new opportunities and exciting projects.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:aden.guowe@gmail.com" className="group bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gray-500/25 flex items-center justify-center gap-2 relative overflow-hidden">
                <EnvelopeIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="relative z-10">Email Me</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500/20 to-gray-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a href="https://github.com/AG9898" target="_blank" rel="noopener noreferrer" className="group border border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-400 flex items-center justify-center gap-2">
                <CodeBracketIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/aden-guo-b39743362/" target="_blank" rel="noopener noreferrer" className="group border border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-400 flex items-center justify-center gap-2">
                <BriefcaseIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-700">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400 hover:text-gray-300 transition-colors duration-300">&copy; 2025 Aden Guo. All rights reserved.</p>
        </div>
      </footer>

      {/* Performance Monitor (Development Only) */}
      <PerformanceMonitor />
    </div>
  );
}
