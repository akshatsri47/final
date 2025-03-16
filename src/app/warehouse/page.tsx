import React from 'react';

export default function WarehousingPage() {
  return (
    <main className="flex flex-col w-full">
      {/* 
        Hero/Banner Section
        1. Uses a background image (replace '/hero-warehouse.jpg' with your own).
        2. Overlay (bg-black/40) to darken the image for readable text.
      */}
      <section className="relative h-[400px] w-full bg-[url('/hero-warehouse.jpg')] bg-cover bg-center flex items-center justify-center">
        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        {/* Hero Text */}
        <h1 className="relative text-4xl md:text-5xl font-bold text-white">
          Warehousing
        </h1>
      </section>

      {/* 
        Introduction Section
        Replaces "At StarAgri" with "At Krishi Doctor"
      */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Safeguarding produce with scientific storage solutions
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          At <strong>Krishi Doctor</strong>, we offer more than just warehouse storage solutions—
          we provide peace of mind. Our state-of-the-art, scientific agriculture warehouse 
          facilities cater to farmers, traders, millers, processors, and corporates, 
          ensuring agri commodity protection at every step. Our warehousing solution is 
          designed to enhance post-harvest storage efficiency while maintaining the 
          highest quality standards.
        </p>
      </section>

      {/* 
        Quality & Quantity Assurance
      */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Quality and quantity assurance
        </h3>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Before entering our warehouse storage facility, all agricultural
          commodities undergo rigorous testing for:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
          <li>
            <strong>Quality:</strong> Ensuring the commodities meet predefined standards.
          </li>
          <li>
            <strong>Quantity:</strong> Verifying the amount deposited aligns with customer declarations.
          </li>
        </ul>
      </section>

      {/* 
        Value-Added Services (Optionally add an image on the side)
      */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h3 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
          Value-added services
        </h3>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Text Content */}
          <div className="flex-1">
            <p className="text-gray-700 mb-4 leading-relaxed">
              In addition to warehouse services, we provide:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <strong>Fumigation:</strong> Protecting commodities from pests and infestations.
              </li>
              <li>
                <strong>Quality Testing:</strong> Assessing the quality of stored goods 
                through standardized procedures.
              </li>
            </ul>
          </div>
          {/* Image (replace '/sacks.jpg' with your own image) */}
          <div className="flex-1">
            <img
              src="/sacks.jpg"
              alt="Stored agricultural sacks"
              className="w-full h-auto rounded-md shadow"
            />
          </div>
        </div>
      </section>

      {/* 
        Why Choose Krishi Doctor
        Replaces "Why choose StarAgri" with "Why choose Krishi Doctor"
      */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl md:text-2xl font-bold text-green-700 mb-6">
            Why choose Krishi Doctor
          </h3>
          <ul className="list-disc list-inside mb-6 text-gray-700 space-y-2">
            <li>
              Secure, state-of-the-art warehousing and distribution logistics facilities.
            </li>
            <li>
              Comprehensive warehousing management services to maintain commodity integrity.
            </li>
            <li>
              Additional services to enhance the storage and preservation experience.
            </li>
          </ul>
          <p className="text-gray-700 mb-4 leading-relaxed">
            We provide warehouse receipts for commodities stored with us, outlining their variety,
            quality, and quantity. These receipts empower our customers to secure financing 
            through our partnerships with 24 financial institutions, including leading banks 
            and NBFCs.
          </p>
        </div>
      </section>

      {/* 
        Pan-India Network
        Replaces "StarAgri" with "Krishi Doctor"
      */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <p className="text-gray-700 mb-4 leading-relaxed">
          <strong>Krishi Doctor</strong> operates a robust pan-India network of <strong>2,189 warehouses</strong> 
          across 19 states, offering a total storage capacity of <strong>5.01 million metric tons</strong>. 
          Whether you require 3PL warehouse solutions, commodity warehousing, or 3PL warehousing and 
          distribution, our reach ensures seamless access and support for agricultural stakeholders nationwide.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Experience safe and reliable warehouse management with us, where your agri commodity is always 
          in good hands. Our advanced silo storage and warehouse storage solutions redefine the standards 
          of post-harvest storage, making us the leading provider of warehousing solution services in India.
        </p>
      </section>
    </main>
  );
}