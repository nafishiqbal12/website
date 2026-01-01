import { useState } from 'react';
import { Mail, Send, Twitter, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectDetails: '',
    budget: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', projectDetails: '', budget: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Let's Collaborate</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Tell us about your project, and we'll design the perfect campaign to help you achieve your goals.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-8">
                Whether you're launching a new token, listing on an exchange, or building a community, BlockWave Lab has
                the expertise and network to help you succeed.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">Email Us</h3>
                    <a
                      href="mailto:hello@blockwavelab.com"
                      className="text-blue-600 hover:text-cyan-500 transition-colors"
                    >
                      hello@blockwavelab.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Send size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">Telegram</h3>
                    <a
                      href="https://t.me/Alex_TNH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-cyan-500 transition-colors"
                    >
                      @Alex_TNH
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <Twitter size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-gray-900">Twitter / X</h3>
                    <a
                      href="https://twitter.com/Blockwavelab"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-cyan-500 transition-colors"
                    >
                      @Blockwavelab
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Why Work With Us?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Extensive network of 200+ verified crypto KOLs</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Data-driven strategies with proven ROI</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Direct partnerships with major exchanges</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">150+ successful campaigns delivered</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">Send Us a Message</h3>

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 text-gray-900">Thank You!</h4>
                    <p className="text-gray-600">
                      We've received your message and will get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="projectDetails" className="block text-sm font-medium text-gray-700 mb-2">
                        Project Details *
                      </label>
                      <textarea
                        id="projectDetails"
                        name="projectDetails"
                        value={formData.projectDetails}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                        placeholder="Tell us about your project, your goals, and what you're looking to achieve..."
                      />
                    </div>

                    <div>
                      <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                        Budget Range
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="">Select your budget</option>
                        <option value="5k-10k">$5,000 - $10,000</option>
                        <option value="10k-25k">$10,000 - $25,000</option>
                        <option value="25k-50k">$25,000 - $50,000</option>
                        <option value="50k-100k">$50,000 - $100,000</option>
                        <option value="100k+">$100,000+</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
                    >
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-12 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Available 24/7</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              The crypto market never sleeps, and neither do we. Reach out anytime and we'll respond promptly.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="https://t.me/Alex_TNH"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Message on Telegram
              </a>
              <a
                href="mailto:hello@blockwavelab.com"
                className="bg-white/20 backdrop-blur text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all"
              >
                Send an Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
