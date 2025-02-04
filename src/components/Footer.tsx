import React from 'react';
import { Github, Linkedin, Send } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-8">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="https://t.me/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Send className="w-5 h-5" />
          </a>
        </div>
        <div className="text-center mt-2 text-sm text-gray-400">
          © 2025 John Doe. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer