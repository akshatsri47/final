"use client"
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Truck, Users, Award, Leaf, Sprout, Mountain } from 'lucide-react';

const AboutUs = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);

  // Animation for elements as they enter viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => animateOnScroll.observe(el));

    return () => animateOnScroll.disconnect();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-96 md:h-screen/2 overflow-hidden">
        <Image 
          src="/api/placeholder/1200/600" 
          alt="Fertile farmland with crops" 
          layout="fill" 
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Our Story</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Nurturing soil and growing futures since 1995
            </p>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="flex justify-center mb-8">
            <Leaf size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Our Mission</h2>
          <p className="text-xl text-center max-w-4xl mx-auto text-gray-600">
            We are dedicated to revolutionizing agriculture through sustainable fertilizers that enhance soil health, maximize crop yields, and preserve our planet for future generations. Our innovative solutions empower farmers to grow more with less environmental impact.
          </p>
        </div>
      </div>

      {/* Company History */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Our Journey</h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 1995 by agricultural scientists with a vision for more sustainable farming, GreenGrow Fertilizers began as a small research lab focused on developing eco-friendly alternatives to conventional chemical fertilizers.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Over the decades, we&aposve expanded our product range while staying true to our core values of innovation, sustainability, and farmer success. Today, we serve agricultural communities across the country with our premium fertilizer solutions.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to research and development ensures we stay at the cutting edge of agricultural science, continuously improving our formulations to meet the evolving needs of modern farming.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
              <Image 
                src="/api/placeholder/600/800" 
                alt="Company history timeline" 
                layout="fill" 
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div ref={statsRef} className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          Our Impact by the Numbers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Users className="text-green-600" size={28} />
            </div>
            <h3 className="text-5xl font-bold text-gray-800 mb-2">10,000+</h3>
            <p className="text-gray-600">Farmers Served</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-200 ease-out">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Sprout className="text-green-600" size={28} />
            </div>
            <h3 className="text-5xl font-bold text-gray-800 mb-2">500K</h3>
            <p className="text-gray-600">Acres Enriched</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Award className="text-green-600" size={28} />
            </div>
            <h3 className="text-5xl font-bold text-gray-800 mb-2">25+</h3>
            <p className="text-gray-600">Industry Awards</p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div ref={valuesRef} className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Leaf className="text-green-600" size={28} />,
                title: "Sustainability",
                description: "We create products that nourish the soil while preserving natural ecosystems for future generations."
              },
              {
                icon: <Sprout className="text-green-600" size={28} />,
                title: "Innovation",
                description: "Our continuous research drives breakthroughs in fertilizer technology for greater efficiency."
              },
              {
                icon: <Users className="text-green-600" size={28} />,
                title: "Partnership",
                description: "We work alongside farmers as partners, providing solutions tailored to their specific needs."
              },
              {
                icon: <Mountain className="text-green-600" size={28} />,
                title: "Quality",
                description: "Every product undergoes rigorous testing to ensure consistent performance and results."
              },
              {
                icon: <Award className="text-green-600" size={28} />,
                title: "Integrity",
                description: "We maintain transparent practices and honest relationships with all stakeholders."
              },
              {
                icon: <Truck className="text-green-600" size={28} />,
                title: "Accessibility",
                description: "We strive to make premium fertilizers accessible to farms of all sizes and types."
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out"
                style={{ transitionDelay: `${100 * index}ms` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div ref={teamRef} className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          Our Leadership Team
        </h2>
        <p className="text-center text-lg text-gray-600 mb-12 max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100 ease-out">
          Meet the experts leading our mission to revolutionize sustainable agriculture
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Dr. Emily Chen",
              role: "Chief Executive Officer",
              bio: "Ph.D. in Agricultural Science with 15+ years of experience in sustainable farming practices."
            },
            {
              name: "Michael Rodriguez",
              role: "Chief Operations Officer",
              bio: "Former farmer turned executive with deep understanding of agricultural supply chains."
            },
            {
              name: "Dr. Sarah Johnson",
              role: "Head of Research & Development",
              bio: "Leading our innovation lab with expertise in soil microbiology and plant nutrition."
            },
            {
              name: "Robert Williams",
              role: "Sales Director",
              bio: "Building lasting relationships with farming communities across the country."
            },
            {
              name: "Aisha Patel",
              role: "Sustainability Officer",
              bio: "Ensuring our products and practices align with our environmental commitments."
            },
            {
              name: "James Thompson",
              role: "Customer Success Manager",
              bio: "Dedicated to helping farmers achieve optimal results with our products."
            }
          ].map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              <div className="h-64 relative">
                <Image 
                  src={`/api/placeholder/400/${300 + index * 20}`} 
                  alt={member.name} 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-green-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Us in Growing a Sustainable Future</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Discover how our premium fertilizers can transform your farm&aposs productivity while caring for the environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-white text-green-600 font-medium rounded-lg hover:bg-gray-100 transition-colors duration-300">
                Shop Products
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-300">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;