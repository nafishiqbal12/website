import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Mail, Send, Calendar, MessageSquare, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    details: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        projectType: '',
        details: '',
      });
    }, 3000);
  };

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white py-20" aria-label="Contact hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.25em] text-blue-100 mb-4">Contact BlockWaveLab</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6">Let&apos;s Grow Your Web3 Project</h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Tell us your goals and we&apos;ll build a practical crypto marketing roadmap for KOL outreach, influencer campaigns,
            PR, and community growth.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50" aria-label="Contact options and form">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-6">
              <article className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0">
                    <Send size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Telegram Contact</h2>
                    <p className="text-gray-600 mb-3">Fastest way to reach our team for campaign discussions.</p>
                    <a
                      href="https://t.me/Alex_TNH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
                    >
                      @Alex_TNH
                    </a>
                  </div>
                </div>
              </article>

              <article className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center flex-shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Contact</h2>
                    <p className="text-gray-600 mb-3">Send your project brief and preferred timeline by email.</p>
                    <a
                      href="mailto:hello@blockwavelab.com"
                      className="text-blue-600 font-semibold hover:text-cyan-500 transition-colors"
                    >
                      hello@blockwavelab.com
                    </a>
                  </div>
                </div>
              </article>

              <article className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-7">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/15 text-white flex items-center justify-center flex-shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Book a Marketing Consultation</h2>
                    <p className="text-gray-300 mb-5">
                      Get a tailored growth plan for your launch, community strategy, and creator partnerships.
                    </p>
                    <a
                      href="https://t.me/Alex_TNH"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-3 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all"
                    >
                      <MessageSquare size={18} />
                      <span>Book Consultation</span>
                    </a>
                  </div>
                </div>
              </article>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Contact Form</h2>
              <p className="text-gray-600 mb-7">Share your project details and we&apos;ll respond within 24 hours.</p>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Received</h3>
                  <p className="text-gray-600">Thanks for reaching out. Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" aria-label="Contact form">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Work Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="you@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      required
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select project type</option>
                      <option value="token-launch">Token Launch</option>
                      <option value="defi">DeFi Protocol</option>
                      <option value="nft">NFT Project</option>
                      <option value="web3-app">Web3 App</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Goals
                    </label>
                    <textarea
                      id="details"
                      name="details"
                      rows={5}
                      required
                      value={formData.details}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                      placeholder="Tell us your timeline, audience, and growth targets..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.01] transition-all"
                  >
                    <Send size={18} />
                    <span>Send Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
