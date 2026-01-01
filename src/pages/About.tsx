import { Target, Eye, Shield, Zap } from 'lucide-react';

export default function About() {
  const team = [
    {
      name: 'Nafish Iqbal',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Maya Patel',
      role: 'Head of KOL Relations',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'James Chen',
      role: 'Strategy Director',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
    {
      name: 'Sophie Anderson',
      role: 'Community Manager',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  ];

  const values = [
    {
      icon: <Shield size={32} />,
      title: 'Transparency',
      description: 'We believe in honest communication and clear reporting. Every campaign is backed by real data and measurable results.',
    },
    {
      icon: <Zap size={32} />,
      title: 'Creativity',
      description: 'Innovation drives us. We craft unique campaigns that stand out in the crowded crypto space and capture attention.',
    },
    {
      icon: <Target size={32} />,
      title: 'Results',
      description: 'We are obsessed with delivering outcomes. Your success metrics are our success metrics, and we optimize relentlessly.',
    },
  ];

  const partners = [
    'Binance', 'MEXC', 'Gate.io', 'KuCoin', 'Bybit', 'OKX',
    'Huobi', 'Bitget', 'Crypto.com', 'Coinbase'
  ];

  return (
    <div className="pt-16">
      <section className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">About BlockWave Lab</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            A global Web3 marketing studio helping crypto projects grow through influencer collaborations and community-driven campaigns.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4">
                BlockWave Lab is a specialized Web3 marketing agency founded by crypto natives who understand the unique
                challenges of building and scaling blockchain projects. We've been at the forefront of crypto marketing
                since 2020, helping projects from ideation to exchange listings.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our team combines deep industry knowledge with creative marketing expertise. We don't just run campaigns—we
                build narratives, foster communities, and create lasting connections between projects and their audiences.
              </p>
              <p className="text-lg text-gray-600">
                With a network spanning Twitter, YouTube, Telegram, and beyond, we connect your project with authentic
                voices that resonate with crypto investors, traders, and enthusiasts worldwide.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-10 text-white">
              <div className="flex items-center mb-4">
                <Target size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-lg text-blue-100">
                To amplify blockchain innovation through authentic influence. We empower crypto projects to reach their
                target audiences through strategic partnerships with trusted voices in the Web3 ecosystem.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-10 text-white">
              <div className="flex items-center mb-4">
                <Eye size={40} />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-lg text-blue-100">
                To bridge crypto brands and audiences through meaningful marketing. We envision a future where every
                innovative blockchain project has access to the resources and connections needed to thrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Our Core Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-6">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Meet Our Team</h2>
            <p className="text-lg text-gray-600">Experienced professionals dedicated to your success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-2"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Partner Exchanges & Platforms</h2>
            <p className="text-gray-600">Trusted relationships with leading crypto exchanges</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {partners.map((partner) => (
              <div
                key={partner}
                className="flex items-center justify-center text-gray-400 font-bold text-lg hover:text-blue-600 transition-colors"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-cyan-500 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Let's discuss how BlockWave Lab can help your crypto project reach new heights.
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Start Your Campaign
          </a>
        </div>
      </section>
    </div>
  );
}
