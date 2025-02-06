import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, FlaskRound as Flask, Code, BookOpen } from 'lucide-react';

function Navbar() {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-cyan-500" />
            <span className="text-xl font-bold"> </span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/research" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <Flask className="w-4 h-4" />
              <span>Research</span>
            </Link>
            <Link to="/projects" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <Code className="w-4 h-4" />
              <span>Projects</span>
            </Link>
            <Link to="/blog" className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
              <span>Blog</span>
            </Link>
            <a 
              href="https://docs.google.com/gview?url=https://raw.githubusercontent.com/oxapavan/oxapavan.github.io/main/public/Pavan%20Alapati.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar
