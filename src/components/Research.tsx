import React from 'react';
import { FileText, Calendar } from 'lucide-react';

function Research() {
  const research = [
    {
      title: "Advanced Persistent Threat Detection Using Machine Learning",
      date: "March 2024",
      description: "Research on implementing ML algorithms to detect and prevent APT attacks.",
      link: "#"
    },
    {
      title: "Zero-Day Vulnerability Analysis in IoT Devices",
      date: "January 2024",
      description: "Comprehensive study of security vulnerabilities in common IoT devices.",
      link: "#"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Research</h1>
      <div className="space-y-6">
        {research.map((item, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">{item.title}</h2>
                <div className="flex items-center text-gray-400 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{item.date}</span>
                </div>
                <p className="text-gray-400">{item.description}</p>
              </div>
              <a
                href={item.link}
                className="flex items-center text-cyan-500 hover:text-cyan-400"
              >
                <FileText className="w-5 h-5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Research
