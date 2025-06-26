"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="static-gradient min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-xl font-bold text-white">
              Portfolio
            </div>
            <div className="hidden md:flex space-x-8">
              <a 
                href="#home" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                About
              </a>
              <a 
                href="#projects" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                Projects
              </a>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-white/80 hover:text-white transition-colors"
              >
                Contact
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
              Hi, I'm <span className="text-purple-300">Aden Guo</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
              Full Stack Developer & GIS Specialist passionate about creating innovative solutions for spatial data analysis and web applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                View My Work
              </button>
              <a 
                href="/cv.pdf" 
                download="AdenGuo_CV.pdf"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
              >
                Download CV
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">About Me</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-white/80 mb-6">
                I'm a passionate developer and GIS specialist with expertise in both modern web technologies and geospatial applications. 
                I love creating innovative solutions that combine spatial data analysis with user-friendly web interfaces.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">Python & Geospatial Libraries (Folium, GeoPandas)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">Machine Learning (Scikit-learn, DBSCAN)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">React & Next.js</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">TypeScript & Tailwind CSS</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">GIS Software (ArcGIS, QGIS)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-white/90">Spatial Data Analysis & Visualization</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-1 rounded-lg">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-4xl font-bold">AG</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Aden Guo</h3>
                  <p className="text-white/80">Full Stack Developer & GIS Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">My Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card 1 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-white/10">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">GIS Project</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Spatial Data Analysis Platform</h3>
                <p className="text-white/80 mb-4">
                  A comprehensive GIS application for spatial data analysis using Python, Folium, and machine learning algorithms.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">🐍</span> Python
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">🗺️</span> Folium
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">📊</span> GeoPandas
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                    Live Demo
                  </button>
                  <button className="flex-1 border border-white/30 text-white hover:bg-white/10 py-2 rounded-lg text-sm font-semibold transition-colors">
                    GitHub
                  </button>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-white/10">
              <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">ML Project</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Clustering Analysis with DBSCAN</h3>
                <p className="text-white/80 mb-4">
                  Machine learning project implementing DBSCAN clustering algorithm for spatial pattern recognition and analysis.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">🤖</span> Scikit-learn
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">🔍</span> DBSCAN
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">📈</span> NumPy
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                    Live Demo
                  </button>
                  <button className="flex-1 border border-white/30 text-white hover:bg-white/10 py-2 rounded-lg text-sm font-semibold transition-colors">
                    GitHub
                  </button>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className="bg-black/30 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-white/10">
              <div className="h-48 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Web App</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">Portfolio Website</h3>
                <p className="text-white/80 mb-4">
                  A modern portfolio website built with Next.js and Tailwind CSS showcasing GIS and development projects.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">⚡</span> Next.js
                  </span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">🎨</span> Tailwind
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 text-sm rounded-full flex items-center gap-1">
                    <span className="text-xs">📝</span> TypeScript
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors">
                    Live Demo
                  </button>
                  <button className="flex-1 border border-white/30 text-white hover:bg-white/10 py-2 rounded-lg text-sm font-semibold transition-colors">
                    GitHub
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Get In Touch</h2>
          <p className="text-lg text-white/80 mb-8">
            I'm always interested in new opportunities and exciting projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:aden.guowe@gmail.com" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">📧</span> Email Me
            </a>
            <a href="https://github.com/AG9898" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">🐙</span> GitHub
            </a>
            <a href="https://www.linkedin.com/in/aden-guo-b39743362/" target="_blank" rel="noopener noreferrer" className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">💼</span> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/80">&copy; 2025 Aden Guo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
