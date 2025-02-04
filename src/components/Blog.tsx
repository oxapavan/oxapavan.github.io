import React, { useState } from 'react';
import { Calendar, ArrowRight, X } from 'lucide-react';

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  const posts = [
    {
      title: "Understanding Buffer Overflow Attacks",
      date: "March 15, 2024",
      excerpt: "A deep dive into buffer overflow vulnerabilities and how to prevent them.",
      readTime: "5 min read",
      content: `Buffer overflow vulnerabilities remain one of the most critical security issues in software development. 
                In this comprehensive guide, we'll explore:

                • How buffer overflows occur in memory
                • Common exploitation techniques
                • Prevention strategies and best practices
                • Real-world case studies and examples
                
                Understanding memory management is crucial for any security professional. When a program writes data 
                beyond the allocated buffer boundaries, it can overwrite adjacent memory locations, leading to 
                unpredictable behavior or, worse, arbitrary code execution.

                We'll examine practical examples using C programs and demonstrate how modern protection mechanisms 
                like ASLR and DEP help mitigate these vulnerabilities.`
    },
    {
      title: "Implementing Zero Trust Architecture",
      date: "March 10, 2024",
      excerpt: "Best practices for implementing zero trust security in modern organizations.",
      readTime: "7 min read",
      content: `Zero Trust Architecture (ZTA) represents a paradigm shift in cybersecurity strategy. 
                This article explores:

                • Core principles of Zero Trust
                • Implementation challenges and solutions
                • Identity and access management integration
                • Microsegmentation strategies
                
                Traditional perimeter-based security is no longer sufficient in today's distributed 
                computing environment. Zero Trust operates on the principle of "never trust, always verify," 
                requiring all users and devices to be authenticated and authorized regardless of their location.

                We'll discuss practical steps for organizations transitioning to a Zero Trust model, including 
                technical requirements and organizational changes needed for successful implementation.`
    },
    {
      title: "The Rise of AI in Cybersecurity",
      date: "March 5, 2024",
      excerpt: "How artificial intelligence is transforming the cybersecurity landscape.",
      readTime: "6 min read",
      content: `Artificial Intelligence is revolutionizing cybersecurity operations. This article covers:

                • Machine learning for threat detection
                • AI-powered incident response
                • Predictive security analytics
                • Challenges and limitations
                
                AI and machine learning algorithms are becoming essential tools in the cybersecurity arsenal, 
                helping organizations detect and respond to threats faster than ever before. We'll explore how 
                these technologies are being applied in real-world scenarios and their impact on the future of 
                cybersecurity.

                The article includes case studies of successful AI implementations in security operations centers 
                and discusses the balance between automated and human-driven security processes.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map((post, index) => (
          <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <div className="flex items-center text-gray-400 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>{post.readTime}</span>
            </div>
            <p className="text-gray-400 mb-4">{post.excerpt}</p>
            <button
              onClick={() => setSelectedPost(post)}
              className="inline-flex items-center text-cyan-500 hover:text-cyan-400"
            >
              Read More
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        ))}
      </div>

      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex items-center text-gray-400 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{selectedPost.date}</span>
              <span className="mx-2">•</span>
              <span>{selectedPost.readTime}</span>
            </div>
            <div className="text-gray-300 whitespace-pre-line">
              {selectedPost.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog