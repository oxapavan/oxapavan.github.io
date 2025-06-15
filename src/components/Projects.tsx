import React, { useState } from 'react';
import { Github, ExternalLink, X } from 'lucide-react';

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      title: "Generating Honeypot Alerts using Wazuh",
      description: "A network vulnerability scanner built with Python and Scapy.",
      tags: ["Python", "Network Security", "Penetration Testing"],
      github: "https://github.com/oxapavan/Honeypot-Alerts-using-Wazuh",
      details: `This project focuses on enhancing threat intelligence and detection capabilities by integrating a custom-deployed honeypot with Wazuh SIEM on AWS and VirtualBox environments. The objective was to capture real-world attacker TTPs (Tactics, Techniques, and Procedures) and enrich threat feeds for proactive defense.

                • Deployed and configured a honeypot environment to simulate vulnerable systems and attract malicious actors.
                • Integrated the honeypot logs with Wazuh SIEM to generate real-time alerts and visualize attacker behaviors.
                • Automated threat intelligence enrichment using captured Indicators of Compromise (IOCs) and log analysis.
                • Streamlined incident response workflows, reducing response time by 40% through enhanced visibility and actionable alerting.
                • Enabled proactive threat hunting by correlating honeypot data with existing threat feeds, improving overall detection accuracy.
                
                Technical Implementation:
                • Wazuh SIEM (Log analysis, ruleset tuning, threat detection
                • AWS, Azure (Cloud infrastructure deployment)
                • VirtualBox (Isolated lab environment)
                • Custom Honeypot Deployment (Linux-based, configurable TTP traps)`
      
    },
    {
      title: "Threat Intel Dashboard",
      description: "Real-time cyber threat intelligence dashboard using MISP API.",
      tags: ["Wazuh", "Honeypot", "Threat Intelligence", "SIEM", "AWS", "Threat Hunting"],
      github: "https://github.com/oxapavan/IOC-Extraction-through-N8N-Automation",
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
      title: "CloudRecon — AWS Enumeration & Misconfiguration Detection",
      description: "CloudRecon is a Bash-based AWS enumeration tool designed to identify common security misconfigurations across core AWS services like IAM, S3, and EC2. The tool enhances cloud security posture by automating the discovery of insecure configurations and providing actionable insights.",
      tags: ["AWS", "Cloud Security", "Bash", "AWS CLI", "Enumeration", "Reconnaissance", "Automation"],
      github: "https://github.com/oxapavan/AWS-Recon",
      details: `The IoT Security Framework provides a comprehensive solution for securing IoT devices and their 
                communications. Core components include:

                • Developed custom Bash scripts utilizing AWS CLI for automated enumeration of AWS resources.
                • Integrated jq for structured parsing of JSON outputs, enabling clean reporting and improved readability.
                • Identified misconfigurations such as overly permissive IAM policies, publicly accessible S3 buckets, and insecure EC2 security group configurations.
                • Streamlined cloud reconnaissance processes for red team assessments and cloud security audits.
                • Provided detailed visibility into AWS resource configurations, enabling faster remediation and security hardening.`
                
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
                className="flex items-center text-cyan-500 hover:text-cyan-400"
              >
                <ExternalLink className="w-5 h-5 mr-1" />
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
