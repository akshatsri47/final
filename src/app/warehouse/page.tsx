import React from 'react';
import Image from 'next/image';

export default function WarehousingPage() {
  return (
    <main className="flex flex-col w-full">
      {/* Hero/Banner Section */}
      <section className="relative h-[400px] w-full bg-[url('/hero-warehouse.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Warehouse Facility – Katni (Jukehi)
          </h1>
          <p className="text-lg md:text-xl text-green-300 font-medium">
            Madhya Pradesh &bull; 10,000 Metric Tons Capacity
          </p>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Reliable & Efficient Storage for Agricultural Commodities
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our warehouse facility located in <strong>Katni (Jukehi), Madhya Pradesh</strong> provides
          reliable and efficient storage solutions for agricultural commodities and fertilizers.
          Strategically positioned near the local agricultural mandi and directly connected to the
          railway goods storage track, the facility enables seamless logistics operations for bulk
          commodity handling and transportation.
        </p>
        <p className="text-gray-700 leading-relaxed">
          With a total storage capacity of <strong>10,000 metric tons</strong>, the warehouse is
          designed to support traders, agri-business companies, and logistics partners requiring
          safe, large-scale storage and smooth distribution operations.
        </p>
      </section>

      {/* Strategic Location Advantage */}
      <section className="bg-green-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            Strategic Location Advantage
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            The warehouse is located in the <strong>Jukehi area near Katni</strong>, offering
            excellent connectivity to both road and rail transportation networks.
          </p>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Key advantages include:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>0 km distance</strong> from the railway goods track, enabling efficient rail cargo movement
            </li>
            <li>Close proximity to the local agricultural mandi, making it ideal for commodity aggregation and dispatch</li>
            <li>Easy access for heavy trucks and logistics vehicles</li>
            <li>Smooth connectivity to regional and national agricultural markets across Madhya Pradesh</li>
          </ul>
        </div>
      </section>

      {/* Storage Capacity */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6">
          Storage Capacity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm text-center">
            <p className="text-4xl font-bold text-green-700 mb-2">10,000</p>
            <p className="text-gray-600 font-medium">Metric Tons Total Capacity</p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-700 mb-2">Covered</p>
            <p className="text-gray-600 font-medium">Agricultural Commodity Warehouse</p>
          </div>
          <div className="bg-white border border-green-200 rounded-xl p-6 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-700 mb-2">Bulk</p>
            <p className="text-gray-600 font-medium">Safe Storage & Efficient Movement</p>
          </div>
        </div>
      </section>

      {/* Commodities Stored */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            Commodities Stored
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our warehouse is suitable for storing a wide range of agricultural commodities including:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              'Wheat',
              'Paddy',
              'Rice',
              'Black Gram (Urad)',
              'Chickpeas (Chana)',
              'Masoor (Lentils)',
              'Rahar / Arhar (Pigeon Pea)',
              'Fertilizers',
            ].map((commodity) => (
              <div
                key={commodity}
                className="bg-white border border-green-100 rounded-lg px-4 py-3 text-center text-gray-700 font-medium shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200"
              >
                {commodity}
              </div>
            ))}
          </div>
          <p className="text-gray-600 mt-6 text-sm leading-relaxed">
            The facility supports both <strong>short-term and long-term</strong> storage requirements
            for traders, distributors, and agricultural businesses.
          </p>
        </div>
      </section>

      {/* Infrastructure & Facilities */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
              Infrastructure &amp; Facilities
            </h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              The warehouse is equipped with strong infrastructure to ensure smooth operations and
              commodity safety:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>Covered warehouse structure</li>
              <li>Concrete flooring and internal roads</li>
              <li>High-roof design for proper ventilation</li>
              <li>Dedicated truck parking area</li>
              <li>Pallet storage system</li>
              <li>Nearby weighbridge facility for accurate weight measurement</li>
              <li>Efficient loading and unloading arrangements</li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/warehouseimage.jpg"
                alt="Warehouse storage facility with agricultural commodities"
                fill
                className="object-cover rounded-xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Quality Control */}
      <section className="bg-green-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            Safety &amp; Quality Control
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            To maintain product quality and safety, the warehouse follows strict operational practices:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Comprehensive pest-free storage management</li>
            <li>Clean and hygienic storage environment</li>
            <li>Modern security systems and monitoring</li>
            <li>Proper commodity handling procedures</li>
          </ul>
        </div>
      </section>

      {/* Why Choose Our Warehouse */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
          Why Choose Our Warehouse
        </h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Our facility is designed to support modern agricultural logistics with reliability and efficiency.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[
            { title: '10,000 MT Capacity', desc: 'Large-scale storage for bulk commodity needs' },
            { title: 'Direct Railway Connectivity', desc: '0 km from railway goods track for seamless cargo movement' },
            { title: 'Near Katni Mandi', desc: 'Strategic location close to the agricultural mandi' },
            { title: 'Multi-Commodity Storage', desc: 'Suitable for grains, pulses, and fertilizer storage' },
            { title: 'Modern Infrastructure', desc: 'Equipped with security systems and concrete flooring' },
            { title: 'Efficient Logistics', desc: 'Smooth truck movement and easy heavy vehicle access' },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-green-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200"
            >
              <h3 className="text-green-700 font-semibold text-base mb-1">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="bg-gray-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-4">
            Industries We Serve
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Our warehouse facility supports storage and logistics needs for multiple industries including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Agricultural commodity traders</li>
            <li>Grain and pulse wholesalers</li>
            <li>Fertilizer distributors</li>
            <li>Food processing companies</li>
            <li>Agricultural supply chain businesses</li>
            <li>Commodity aggregation and distribution companies</li>
          </ul>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-green-700 py-12 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Contact for Storage &amp; Logistics Enquiries
          </h2>
          <p className="text-green-100 mb-6 leading-relaxed">
            Businesses looking for reliable warehouse storage in <strong>Katni, Madhya Pradesh</strong> can
            connect with us for storage availability, logistics coordination, and bulk commodity
            handling solutions.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-green-50 transition-colors duration-200"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </main>
  );
}