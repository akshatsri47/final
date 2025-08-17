"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import { NextPage } from 'next';
import { motion } from 'framer-motion';

const ContactPageClient: NextPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      name?: string;
      email?: string;
      message?: string;
    } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Simulate API call for demonstration
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        setSubmitted(true);
        // Hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your message. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const successVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about sustainable farming practices? Need information about our agricultural products? Our team is ready to help!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="lg:col-span-2 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {submitted ? (
              <motion.div
                variants={successVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col items-center justify-center text-center p-12 bg-gradient-to-br from-green-50 to-green-100"
              >
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <svg 
                    className="w-12 h-12 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Thank you for reaching out!</h3>
                <p className="text-gray-600">
                  We&aposve received your message and will get back to you within 24-48 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <motion.div 
                  variants={itemVariants} 
                  className="mb-6"
                >
                  <label 
                    htmlFor="name" 
                    className={`block mb-2 font-medium ${focusedField === 'name' ? 'text-green-700' : 'text-gray-700'} transition-colors duration-200`}
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : focusedField === 'name' ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 bg-white`}
                    />
                    {focusedField === 'name' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full origin-left"
                      />
                    )}
                  </div>
                  {errors.name && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.name}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="mb-6"
                >
                  <label 
                    htmlFor="email" 
                    className={`block mb-2 font-medium ${focusedField === 'email' ? 'text-green-700' : 'text-gray-700'} transition-colors duration-200`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : focusedField === 'email' ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 bg-white`}
                    />
                    {focusedField === 'email' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full origin-left"
                      />
                    )}
                  </div>
                  {errors.email && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.email}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="mb-6"
                >
                  <label 
                    htmlFor="phone" 
                    className={`block mb-2 font-medium ${focusedField === 'phone' ? 'text-green-700' : 'text-gray-700'} transition-colors duration-200`}
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('phone')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border ${focusedField === 'phone' ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 bg-white`}
                    />
                    {focusedField === 'phone' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full origin-left"
                      />
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="mb-6"
                >
                  <label 
                    htmlFor="subject" 
                    className={`block mb-2 font-medium ${focusedField === 'subject' ? 'text-green-700' : 'text-gray-700'} transition-colors duration-200`}
                  >
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border ${focusedField === 'subject' ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 bg-white appearance-none`}
                    >
                      <option value="">Please select</option>
                      <option value="general">General Inquiry</option>
                      <option value="products">Product Information</option>
                      <option value="consulting">Agricultural Consulting</option>
                      <option value="support">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    {focusedField === 'subject' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full origin-left"
                      />
                    )}
                  </div>
                </motion.div>
                
                <motion.div 
                  variants={itemVariants} 
                  className="mb-6"
                >
                  <label 
                    htmlFor="message" 
                    className={`block mb-2 font-medium ${focusedField === 'message' ? 'text-green-700' : 'text-gray-700'} transition-colors duration-200`}
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : focusedField === 'message' ? 'border-green-500' : 'border-gray-300'} rounded-lg focus:outline-none transition-colors duration-200 bg-white resize-none`}
                    ></textarea>
                    {focusedField === 'message' && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 h-0.5 bg-green-500 w-full origin-left"
                      />
                    )}
                  </div>
                  {errors.message && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-red-600"
                    >
                      {errors.message}
                    </motion.p>
                  )}
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors duration-300 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="bg-green-700 text-white p-6">
              <h3 className="text-xl font-bold mb-2">Get In Touch</h3>
              <p className="text-green-100">We are here to answer your questions</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-medium mb-1">Location</h4>
                  <p className="text-gray-600">358 , Ghantaghar Marg, ghanthagahr <br />Katni,Madhya Pradesh, 483501</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-medium mb-1">Phone</h4>
                  <p className="text-gray-600">(+91) 9109109866</p>
                </div>
              </div>
              
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-medium mb-1">Email</h4>
                  <p className="text-gray-600">guptatradingcompny910@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start mb-8">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2 mr-4">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-gray-700 font-medium mb-1">Hours</h4>
                  <p className="text-gray-600">Monday - Saturday: 11:00 AM - 8:00 PM Sunday: Closed</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-gray-700 font-medium mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  <motion.a 
                    href="#" 
                    whileHover={{ y: -3 }}
                    className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ y: -3 }}
                    className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ y: -3 }}
                    className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm2-10.5a.5.5 0 01-.5.5h-1v1h1a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-1v1a.5.5 0 01-.5.5h-1a.5.5 0 01-.5-.5v-1h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1v-1h-1a.5.5 0 01-.5-.5v-1a.5.5 0 01.5-.5h1v-.5a.5.5 0 01.5-.5h1a.5.5 0 01.5.5v.5h1a.5.5 0 01.5.5v1z" />
                    </svg>
                  </motion.a>
                  <motion.a 
                    href="#" 
                    whileHover={{ y: -3 }}
                    className="bg-green-100 text-green-600 rounded-full p-2 hover:bg-green-200 transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.98 0a6.9 6.9 0 01.702.031c.3.013.587.042.866.073.281.035.482.078.79.202.34.133.618.327.847.552.235.225.432.504.561.848.126.304.172.508.205.786.033.278.043.569.052.87.016.302.014.603.014.904V18.73c0 .3.002.603-.013.903-.01.302-.02.591-.053.87-.033.277-.079.482-.204.785-.13.344-.328.624-.56.85-.235.23-.51.415-.848.544-.304.125-.5.172-.781.202-.302.035-.582.062-.865.071-.304.013-.602.021-.902.021H7.02c-.3 0-.602-.007-.902-.021a13.86 13.86 0 01-.866-.07c-.281-.03-.481-.078-.788-.203a3.26 3.26 0 01-.843-.547 3.33 3.33 0 01-.56-.848c-.126-.303-.172-.508-.204-.786-.033-.278-.043-.568-.053-.87a53.1 53.1 0 01-.013-.903V6.93c0-.3.002-.602.013-.904.01-.301.02-.59.053-.87.032-.277.078-.48.204-.785.127-.343.327-.623.56-.848.228-.228.51-.418.843-.55.304-.125.501-.171.788-.201a59.36 59.36 0 01.866-.073A4.798 4.798 0 017.022 0h9.957zM12 6a6 6 0 100 12 6 6 0 000-12zm0 2a4 4 0 110 8 4 4 0 010-8zm6.5-3a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                    </svg>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ContactPageClient;
