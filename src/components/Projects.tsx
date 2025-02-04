import React, { useState } from 'react';
import { Github, ExternalLink, X } from 'lucide-react';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "SecureNet Scanner",
      description: "A network vulnerability scanner built with Python and Scapy.",
      tags: ["Python", "Network Security", "Penetration Testing"],
      github: "#",
      demo: "#",
      details: `SecureNet Scanner is a comprehensive network security tool that helps identify vulnerabilities 
                in network infrastructure. Key features include:

                • Port scanning and service detection
                • Vulnerability assessment and reporting
                • Custom exploit detection modules
                • Automated report generation
                
                The tool is built using Python and leverages the Scapy library for packet manipulation and 
                network discovery. It includes a modular architecture that allows for easy extension and 
                customization of scanning capabilities.

                Technical Implementation:
                • Multi-threaded scanning for improved performance
                • Custom protocol implementations for service detection
                • Integration with common vulnerability databases
                • Export capabilities for various report formats`
    },
    {
      title: "Threat Intel Dashboard",
      description: "Real-time cyber threat intelligence dashboard using MISP API.",
      tags: ["React", "TypeScript", "Cyber Threat Intelligence"],
      github: "#",
      demo: "#",
      details: `The Threat Intelligence Dashboard provides real-time visualization and analysis of cyber threats 
                using data from multiple sources. Features include:

                • Real-time threat feed integration
                • Interactive threat maps and visualizations
                • Automated indicator extraction
                • Custom alert configurations
                
                Built with React and TypeScript, the dashboard integrates with the MISP (Malware Information 
                Sharing Platform) API to provide up-to-date threat intelligence data.

                Technical Stack:
                • React with TypeScript for frontend
                • D3.js for data visualization
                • WebSocket integration for real-time updates
                • Redux for state management`
    },
    {
      title: "IoT Security Framework",
      description: "Security framework for IoT devices with emphasis on encryption.",
      tags: ["C++", "IoT", "Encryption"],
      github: "#",
      demo: "#",
      details: `The IoT Security Framework provides a comprehensive solution for securing IoT devices and their 
                communications. Core components include:

                • End-to-end encryption for device communication
                • Secure boot and firmware verification
                • Remote device management and monitoring
                • Automated security policy enforcement
                
                The framework is implemented in C++ and designed to be lightweight enough for resource-constrained 
                IoT devices while maintaining robust security features.

                Security Features:
                • AES-256 encryption for data protection
                • X.509 certificate-based device authentication
                • Secure key exchange protocols
                • Runtime integrity checking`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Projects</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-2">{project.title}</h2>
            <p className="text-gray-400 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex space-x-4">
              <a
                href={project.github}
                className="flex items-center text-cyan-500 hover:text-cyan-400"
              >
                <Github className="w-5 h-5 mr-1" />
                <span>Code</span>
              </a>
              <a
                href={project.demo}
                className="flex items-center text-cyan-500 hover:text-cyan-400"
              >
                <ExternalLink className="w-5 h-5 mr-1" />
                <span>Demo</span>
              </a>
              <button
                onClick={() => setSelectedProject(project)}
                className="text-cyan-500 hover:text-cyan-400"
              >
                Learn More
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedProject.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-gray-300 whitespace-pre-line">
              {selectedProject.details}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects