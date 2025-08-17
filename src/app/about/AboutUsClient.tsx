"use client";
import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Truck, Users, Award, Leaf, Sprout, Mountain } from 'lucide-react';

export default function AboutUsClient() {
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
    
      {/* Mission Statement */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
        <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out">
          <div className="flex justify-center mb-8">
            <Leaf size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-800">Our Mission</h2>
          <p className="text-xl text-center max-w-4xl mx-auto text-gray-600">
           For years, we have been serving our region with high-quality products and exceptional customer satisfaction and with proper scientific information. Now, we are bringing that same commitment and trust to the digital world. Welcome to [Krishi Doctor]—your go-to online destination for [Agri products/services.
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
              Our journey began 50 Years ago when generally more reliant on traditional methods of farming were being used, many farmers used to face heavy losses, only cash crops were in use even normal fertilizers seem like some magic for the farmers. So, those were the days when this organization was established and from those days till now we just have one vision to give our farmers the best. Over the years, we have built a reputation for quality, reliability, and customer trust, And now scaling ourself to many more farmers.
              </p>
              <p className="text-lg text-gray-600 mb-4">
               As the world evolved, we realized the need to make shopping easier at the same time educating farmers with correct information regarding seed, chemicals and innovative methods . That&apos;s why we decided to transform our traditional store into an eCommerce platform, so you can enjoy the same great products and service from the comfort of your home.
              </p>
              <p className="text-lg text-gray-600">
                Our commitment to research and development ensures we stay at the cutting edge of agricultural science, continuously improving our formulations to meet the evolving needs of modern farming.
              </p>
            </div>
            <div className="relative h-80 md:h-96 rounded-lg overflow-hidden animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-300 ease-out">
              <Image 
                src="/profile/downloads1.jpg" 
                alt="Company history timeline" 
                layout="fill" 
                
                className="rounded-lg object-contain"
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
                title: "Quality",
                description: "Offering only the best products."
              },
              {
                icon: <Sprout className="text-green-600" size={28} />,
                title: "Customer First",
                description: "Ensuring a seamless shopping experience."
              },
              {
                icon: <Users className="text-green-600" size={28} />,
                title: "Trust & Transparency",
                description: "Maintaining honest and fair business practices."
              },
              {
                icon: <Mountain className="text-green-600" size={28} />,
                title: "Innovation",
                description: "Embracing technology to serve you better."
              },
              {
                icon: <Award className="text-green-600" size={28} />,
                title: "Accurate information",
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
              name: "Mr.Santosh Kumar Gupta",
              role: "Founder ",
              bio: "Mrs. Santosh Kumar Gupta established Gupta trading company since 1973 he served the farmers so well that today our region exports goods He has exceptional knowledge to all kinds of seasonal crops His leadership is truly remarkable, the vision he has is truly for the farmers wealth, The knowledge and skill he has from the experience is exceptional for farm level work His 51 years of experience in agricultural practices has always shown good colours in farmers life",
              image: "/profile/char1.jpg"
            },
            {
              name: "Pankaj Gupta ",
              role: "Founder ",
              bio: "[Mr. Pankaj Gupta fully joined our organization in 1995 after completing his diploma in agriculture from Manage Hyderabad he has been serving the farmers for 32 years now and coming, he has been walking passionately in the leadership of his father Mr. Santosh Kumar Gupta, he has also awarded by many national fertilizer companies and also maestro for the management of warehouses which comes under Gupta Trading Company for truly devoted for farmers.",
              image: "/profile/char5.jpg"
            },
               {
              name: "Sumit Gupta",
              role: "Founder",
              bio: "Mr. Sumit Gupta joined our organization in 1997 after completing his diploma in agriculture from Manage Hyderabad, he has been serving the farmers for 30 years now and coming, he has been walking passionately in the leadership of his father Mr. Santosh Kumar Gupta, he has also awarded by many national fertilizer companies and many national and international chemical companies for truly devoted for farmers.",
              image: "/profile/char2.jpg"
            },
            {
              name: "Anil Kumar Shukla",
              role: "Partner Advisor ",
              bio: "Mr. Anil Kumar Shukla joined Gupta trading company in 2023. He contributed a lot to this organization. His experience and expertise and exceptional knowledge, helped farmers very well. He is gold medalist in BSC Ag at JNKVV Jabalpur also MSC in Zoology (Ichthyology). He served in Agriculture Department of MP for 37 years and passionately served the farmers, now he is serving our organization as an chief advisor and continues following his passion as an Agronomist.",
              image: "/profile/char3.jpg"
            },
            {
              name: "Samarth Gupta",
              role: " Co-Founder ",
              bio: "Mr. Samarth Gupta joined Gupta Trading company officially at 2024.After completing his diploma in Agriculture from Manage Hyderabad and Bachelor's in Business Administration from Amity University Rajasthan and now currently a student of ABM at Symbiosis University his fascinating career in business studies giving wings to our organization and exploring technology to reach out to farmers nationally and also by furnishing Farmers with our 51 year of agricultural experience with will definitely now help farmers Nationally to showcase their true colors.",
              image: "/profile/char4.jpg"
            },
         
          
          ].map((member, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 ease-out"
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              <div className="h-64 relative">
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  layout="fill"
                  className='object-contain'
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
}
