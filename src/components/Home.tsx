import React from 'react';

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          
          <img 
            src="/public/assets/images/profile.jpg"  
            className="w-48 h-48 rounded-full object-cover"
          />
          
        </div>
        <h1 className="text-5xl font-bold mb-4">Pavan Alapati</h1>
        <h2 className="text-2xl text-cyan-500 mb-8">Cybersecurity Student & Researcher</h2>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-400 mb-6">
          Just another Security Enthusiast Kid
          </p>
          
          <p className="text-lg text-gray-400 mb-6">
          (aka AngryBird), a third-year undergraduate specializing in Computer Science (Cybersecurity) at KL University. My passion lies in Red Teaming and Threat Hunting, with a focus on Privilege Escalation, Defense Evasion, Credential Access, Lateral Movement, and other offensive security mechanisms.
          </p>
          
          <p className="text-lg text-gray-400">
          On my blog, I share CTF writeups, CVE findings, and other insights from my journey. Stick around and explore what I’m up to—I’m glad you’re here!
          
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home
