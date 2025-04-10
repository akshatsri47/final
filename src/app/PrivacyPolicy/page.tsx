"use client";

import React from "react";
import {
  ShieldCheck,
  PackageCheck,
  Truck,
  Banknote,
  Lock,
  Gavel,
  AlertTriangle,
  Leaf,
  Sprout,
  LucideIcon,
  MapPin,
  Timer,
  Search,
  XCircle,
  Box,
} from "lucide-react";

interface SectionProps {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
}

const Section = ({ icon: Icon, title, children }: SectionProps) => (
  <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center mb-4">
      <div className="p-2 bg-green-100 rounded-full mr-3">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    </div>
    <div className="text-gray-700 space-y-3 pl-4 border-l-2 border-green-100">
      {children}
    </div>
  </div>
);

export default function TermsAndPrivacy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero */}
      <div className="w-full bg-green-700 py-8 px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
            Terms & Conditions
          </h1>
          <p className="text-green-100 text-center mt-2">
            KrishDoctor - Nutrients for Healthy Growth
          </p>
        </div>
        <div className="absolute -bottom-8 left-0 w-24 h-24 text-green-600 opacity-30">
          <Leaf className="w-full h-full" />
        </div>
        <div className="absolute -top-4 right-10 w-16 h-16 text-green-400 opacity-20">
          <Sprout className="w-full h-full" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Intro */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-gray-600 italic">
            At KrishDoctor, we&apos;re committed to providing quality
            agricultural products and maintaining transparency with our
            customers.
          </p>
        </div>

        {/* Terms & Conditions */}
        <Section icon={ShieldCheck} title="1. General Terms">
          <p>
            By using our website, you confirm you&apos;re at least 18 or have
            guardian consent.
          </p>
          <p>We reserve the right to update terms anytime without notice.</p>
          <p>Continued usage implies acceptance of changes.</p>
        </Section>

        <Section icon={PackageCheck} title="2. Products & Orders">
          <p>
            We sell agricultural essentials like fertilizers, pesticides, and
            plant protection products.
          </p>
          <p>We don&apos;t offer tractors or machinery.</p>
          <p>
            Orders are confirmed post successful payment. Product misuse is not
            our responsibility.
          </p>
        </Section>

        <Section icon={Banknote} title="3. Pricing & Payments">
          <p>All prices are in INR and inclusive of taxes.</p>
          <p>Secure payments via UPI, cards, net banking, wallets.</p>
          <p>
            No payment details are stored. Handled securely by trusted gateways.
          </p>
        </Section>

        <Section icon={Truck} title="4. Shipping & Delivery">
          <p>Shipping available within India only.</p>
          <p>Charges & delivery time are shown at checkout.</p>
          <p>
            Delays may occur due to external factors (weather, govt.
            restrictions, etc).
          </p>
        </Section>

        <Section icon={AlertTriangle} title="5. Warranty & Liability">
          <p>No warranties unless explicitly stated.</p>
          <p>
            We are not liable for any damages caused by improper usage of
            products.
          </p>
          <p>
            Buyers must follow agricultural norms and pesticide safety
            regulations.
          </p>
        </Section>

        <Section icon={Lock} title="6. Prohibited Activities">
          <p>No illegal usage of products.</p>
          <p>Do not replicate or misuse website content.</p>
          <p>Any fraud or hacking attempts will lead to legal action.</p>
        </Section>

        <Section icon={Gavel} title="7. Governing Law">
          <p>
            Governed by Indian Law. Any disputes will be addressed in Indian
            courts.
          </p>
        </Section>
        {/* Refund and Return Policy Section */}
        <div className="flex items-center my-12">
          <div className="flex-grow h-px bg-green-200"></div>
          <div className="mx-4 px-6 py-3 bg-green-600 rounded-full">
            <h2 className="text-xl font-bold text-white">
              Refund & Return Policy
            </h2>
          </div>
          <div className="flex-grow h-px bg-green-200"></div>
        </div>

        <Section
          icon={PackageCheck}
          title="1. Return & Replacement Eligibility"
        >
          <p>
            Returns or replacements are accepted under the following conditions:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              The product is damaged, defective, or incorrect upon delivery.
            </li>
            <li>The return request is raised within 48 hours of delivery.</li>
            <li>
              The product must be unused, in its original packaging, and with
              all tags intact.
            </li>
          </ul>
        </Section>

        <Section icon={XCircle} title="2. Non-Returnable Products">
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              Pesticides, fertilizers, and plant protection products (due to
              contamination risks).
            </li>
            <li>Products that have been opened, used, or tampered with.</li>
            <li>Clearance sale items and special-discounted products.</li>
          </ul>
        </Section>

        <Section icon={Banknote} title="3. Refund Process">
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              If eligible, refunds will be credited within 7–14 business days
              after inspection.
            </li>
            <li>Refunds will be issued to the original payment method.</li>
            <li>Replacement will be done within 5–7 days.</li>
            <li>Shipping charges are non-refundable.</li>
          </ul>
        </Section>

        <Section icon={PackageCheck} title="4. Replacement Process">
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>
              If a product is found defective, we will replace it free of
              charge.
            </li>
            <li>
              Customers must provide clear images/videos as proof of the issue.
            </li>
            <li>Replacements depend on stock availability.</li>
          </ul>
        </Section>

        <Section icon={Timer} title="5. Cancellation Policy">
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Orders can only be canceled within 24 hours of placement.</li>
            <li>Once dispatched, orders cannot be canceled or modified.</li>
          </ul>
        </Section>

        <Section icon={Search} title="6. How to Initiate a Return or Refund">
          <p>
            Email us at{" "}
            <a
              href="mailto:support@krishdoctor.in"
              className="text-green-600 underline hover:text-green-800"
            >
              support@krishdoctor.in
            </a>{" "}
            with your order details and issue description.
          </p>
          <p>
            Our team will review the request and provide further instructions.
          </p>
        </Section>

        {/* Privacy Policy Section */}
        <div className="flex items-center my-12">
          <div className="flex-grow h-px bg-green-200"></div>
          <div className="mx-4 px-6 py-3 bg-green-600 rounded-full">
            <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
          </div>
          <div className="flex-grow h-px bg-green-200"></div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-gray-600 italic">
            KrishDoctor values your privacy. Here&apos;s how we handle your
            information while providing you with the best agricultural
            solutions.
          </p>
        </div>

        <Section icon={ShieldCheck} title="1. Information We Collect">
          <p>
            <strong>Personal Data:</strong> Name, email, phone, billing/shipping
            address.
          </p>
          <p>
            <strong>Payment Data:</strong> Securely handled, never stored by us.
          </p>
          <p>
            <strong>Usage Data:</strong> IP, browser, and interaction for
            analytics.
          </p>
        </Section>

        <Section icon={PackageCheck} title="2. How We Use Your Data">
          <p>To fulfill orders and provide customer support.</p>
          <p>To send order updates and improve user experience.</p>
          <p>To prevent fraudulent activities and maintain safety.</p>
          <p>
            <strong>Business Name:</strong> Gupta Trading Company
          </p>
        </Section>

        <Section icon={Lock} title="3. Data Security">
          <p>We use SSL encryption for secure access.</p>
          <p>Your data is never sold or traded.</p>
        </Section>

        <Section icon={ShieldCheck} title="4. Cookies & Tracking">
          <p>Cookies are used to enhance your browsing experience.</p>
          <p>You can control cookies through your browser settings.</p>
        </Section>

        <Section icon={PackageCheck} title="5. Third-Party Sharing">
          <p>We do not sell your data.</p>
          <p>We only share essentials with delivery & payment partners.</p>
        </Section>

        <Section icon={Gavel} title="6. Your Rights">
          <p>
            You can request access, correction, or deletion of your data at:
          </p>
          <p>
            Email:{" "}
            <a
              href="mailto:Guptatradingcompany910@gmail.com"
              className="text-green-600 underline hover:text-green-800"
            >
              Guptatradingcompany910@gmail.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a
              href="tel:9109109866"
              className="text-green-600 underline hover:text-green-800"
            >
              +91 91091 09866
            </a>
          </p>
        </Section>

        {/* Shipping Policy Section */}
        <div className="flex items-center my-12">
          <div className="flex-grow h-px bg-green-200"></div>
          <div className="mx-4 px-6 py-3 bg-green-600 rounded-full">
            <h2 className="text-xl font-bold text-white">Shipping Policy</h2>
          </div>
          <div className="flex-grow h-px bg-green-200"></div>
        </div>

        <Section icon={MapPin} title="1. Shipping Locations">
          <p>We deliver only within India.</p>
          <p>
            Shipping is available in both urban and rural areas, subject to
            courier service availability.
          </p>
        </Section>

        <Section icon={Timer} title="2. Delivery Timeframes">
          <p>Orders are processed within 1-3 business days.</p>
          <p>Estimated delivery: 5-10 business days depending on location.</p>
          <p>Remote areas may experience extra delays.</p>
        </Section>

        <Section icon={Banknote} title="3. Shipping Charges">
          <p>Calculated based on product weight and delivery destination.</p>
          <p>Free shipping may apply on certain promotional offers.</p>
        </Section>

        <Section icon={Search} title="4. Order Tracking">
          <p>
            Tracking ID will be sent via email/SMS once your order is shipped.
          </p>
          <p>You can track the order using the provided link.</p>
        </Section>

        <Section icon={XCircle} title="5. Undeliverable Orders">
          <p>
            Reasons include incorrect address, recipient unavailable, or
            transport restrictions.
          </p>
          <p>
            In such cases, the order may return to us and re-shipping charges
            will apply.
          </p>
        </Section>

        <Section icon={Box} title="6. Damaged or Lost Shipments">
          <p>Report damaged items within 24 hours of delivery.</p>
          <p>Lost shipments will be investigated with the courier.</p>
          <p>Compensation or replacement is based on investigation results.</p>
          <p>
            Contact:{" "}
            <a
              href="mailto:Guptatradingcompany910@gmail.com"
              className="text-green-600 underline"
            >
              Guptatradingcompany910@gmail.com
            </a>{" "}
            | 📞{" "}
            <a href="tel:9109109866" className="text-green-600 underline">
              +91 91091 09866
            </a>
          </p>
        </Section>

        {/* Trust Footer */}
        <div className="mt-12 bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full mb-2">
                <ShieldCheck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">Secure Shopping</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full mb-2">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">Quality Products</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white p-3 rounded-full mb-2">
                <Truck className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-green-800 font-medium">Fast Delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
