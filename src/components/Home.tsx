import React from 'react';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <img 
            src="/assets/images/profile-photo.jpg" 
            alt="John Doe"
            className="w-48 h-48 rounded-full object-cover"
          />
        </div>
        <h1 className="text-5xl font-bold mb-4">John Doe</h1>
        <h2 className="text-2xl text-cyan-500 mb-8">Cybersecurity Student & Researcher</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-400 mb-6">
            A passionate cybersecurity enthusiast with a focus on ethical hacking and digital forensics. 
            Currently pursuing my Master's in Cybersecurity at Tech University, where I specialize in 
            malware analysis and threat intelligence.
          </p>
          <p className="text-lg text-gray-400">
            With hands-on experience in penetration testing and incident response, I'm dedicated to 
            making the digital world more secure. My research interests include zero-day vulnerability 
            detection and advanced persistent threat analysis.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home