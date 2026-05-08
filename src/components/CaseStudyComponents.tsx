import React from 'react';

// Type definitions for case studies
export interface CaseStudyMetric {
  label: string;
  before: string | number;
  after: string | number;
  change: string | number;
  percentChange: number;
  icon?: string;
}

export interface CaseStudyPhase {
  phase: string;
  duration: string;
  focus: string;
  tactics: string[];
  result: string;
}

export interface CaseStudyChannel {
  name: string;
  percentage: number;
  value: string;
  icon?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle: string;
  clientName: string;
  clientLogo?: string;
  yourLogo?: string;
  blockchain?: string;
  niche: 'DeFi' | 'NFT' | 'Exchange' | 'Gaming' | 'DAO' | 'Wallet' | 'Other';
  duration: string;
  heroImage?: string;
  
  // Core sections
  problem: {
    description: string;
    bullets: string[];
  };
  
  strategy: {
    overview: string;
    phases: CaseStudyPhase[];
    keyInsights: string[];
  };
  
  seoStrategy: {
    opportunity: string;
    keywordsFocused: string[];
    contentCreated: { title: string; result: string }[];
    organicTrafficGrowth: string;
  };
  
  communityGrowth: {
    startingSize: number;
    endingSize: number;
    platforms: {
      name: string;
      before: number;
      after: number;
      tactics: string[];
    }[];
    engagementMetrics: {
      nps?: number;
      retention?: number;
      virality?: number;
    };
  };
  
  prCampaign: {
    strategy: string;
    mediaOutlets: {
      name: string;
      publication: string;
      reach: string;
      backlink: string;
    }[];
    totalReach: string;
    mediaValue: string;
  };
  
  results: CaseStudyMetric[];
  
  roi: {
    investment: { category: string; amount: number }[];
    totalInvestment: number;
    revenue: { category: string; amount: number }[];
    totalRevenue: number;
    roir: number; // ROI percentage
    costPerAcquisition: number;
    paybackPeriod: string;
    intangibleBenefits: string[];
  };
  
  testimonial?: {
    quote: string;
    author: string;
    title: string;
    company: string;
    image?: string;
  };
  
  cta: {
    headline: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

// Metric Card Component
interface MetricCardProps {
  metric: CaseStudyMetric;
  compact?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, compact = false }) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition ${
      compact ? 'p-4' : ''
    }`}>
      {metric.icon && <div className="text-3xl mb-2">{metric.icon}</div>}
      <p className="text-sm font-medium text-gray-600 mb-2">{metric.label}</p>
      <div className={`grid grid-cols-3 gap-4 ${compact ? 'text-sm' : ''}`}>
        <div>
          <span className="text-xs text-gray-500 uppercase">Before</span>
          <p className="font-bold text-gray-900">{metric.before}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase">After</span>
          <p className="font-bold text-gray-900">{metric.after}</p>
        </div>
        <div>
          <span className="text-xs text-gray-500 uppercase">Change</span>
          <p className={`font-bold ${metric.percentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
            +{metric.percentChange}%
          </p>
        </div>
      </div>
    </div>
  );
};

// Results Dashboard Component
interface ResultsDashboardProps {
  metrics: CaseStudyMetric[];
  title?: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  metrics, 
  title = 'Campaign Results: 90-Day Summary' 
}) => {
  return (
    <section className="py-12 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600 mb-8">Key performance indicators and metrics</p>

        {/* Grid of metric cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, idx) => (
            <MetricCard key={idx} metric={metric} />
          ))}
        </div>

        {/* Table view for detailed breakdown */}
        <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Metric</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Before</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">After</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Change</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-green-600">% Growth</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{metric.label}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">{metric.before}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900 font-semibold">{metric.after}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">+{metric.change}</td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-green-600">
                    +{metric.percentChange}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

// ROI Section Component
interface ROISectionProps {
  roi: CaseStudy['roi'];
}

export const ROISection: React.FC<ROISectionProps> = ({ roi }) => {
  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Return on Investment Analysis</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Investment */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Total Investment</h3>
            <div className="space-y-4 mb-6">
              {roi.investment.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${roi.totalInvestment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Generated</h3>
            <div className="space-y-4 mb-6">
              {roi.revenue.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.category}</span>
                  <span className="font-semibold text-gray-900">${item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-green-600">
                  ${roi.totalRevenue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ROI Calculation Box */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-blue-100 mb-2">ROI Percentage</p>
              <p className="text-4xl font-bold">{roi.roir}%</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">Cost Per Acquisition</p>
              <p className="text-4xl font-bold">${roi.costPerAcquisition}</p>
            </div>
            <div>
              <p className="text-blue-100 mb-2">Payback Period</p>
              <p className="text-4xl font-bold">{roi.paybackPeriod}</p>
            </div>
          </div>
        </div>

        {/* Intangible Benefits */}
        {roi.intangibleBenefits.length > 0 && (
          <div className="bg-white rounded-lg p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Intangible Benefits</h3>
            <ul className="space-y-3">
              {roi.intangibleBenefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-green-600 font-bold text-lg mt-1">✓</span>
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

// Channel Breakdown Component
interface ChannelBreakdownProps {
  channels: CaseStudyChannel[];
  title?: string;
}

export const ChannelBreakdown: React.FC<ChannelBreakdownProps> = ({ 
  channels, 
  title = 'Growth Breakdown by Channel' 
}) => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Channel cards */}
          <div className="space-y-4">
            {channels.map((channel, idx) => (
              <div key={idx} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  {channel.icon && <span className="text-2xl">{channel.icon}</span>}
                  <span className="text-lg font-bold text-blue-600">{channel.percentage}%</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-1">{channel.name}</p>
                <p className="text-sm text-gray-600">{channel.value}</p>
              </div>
            ))}
          </div>

          {/* Pie chart visualization (simple bar version) */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col justify-center">
            <h3 className="font-semibold text-gray-900 mb-6">Distribution</h3>
            <div className="space-y-4">
              {channels.map((channel, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{channel.name}</span>
                    <span className="text-sm font-bold text-gray-900">{channel.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
                      style={{ width: `${channel.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Strategy Timeline Component
interface StrategyTimelineProps {
  phases: CaseStudyPhase[];
}

export const StrategyTimeline: React.FC<StrategyTimelineProps> = ({ phases }) => {
  return (
    <section className="py-12 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">Strategic Roadmap</h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-500 transform md:-translate-x-1/2" />

          {/* Phase cards */}
          <div className="space-y-12">
            {phases.map((phase, idx) => (
              <div key={idx} className={`relative ${idx % 2 === 0 ? 'md:ml-auto' : ''} md:w-1/2 pl-8 md:pl-0 ${idx % 2 === 1 ? 'md:pr-8' : 'md:pl-8'}`}>
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-1/2 -top-2 w-4 h-4 bg-white border-2 border-blue-500 rounded-full transform md:-translate-x-1/2 -translate-x-1.5" />

                {/* Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">{phase.phase}</h3>
                    <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {phase.duration}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 font-medium mb-4">{phase.focus}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tactics</p>
                    <ul className="space-y-2">
                      {phase.tactics.map((tactic, tIdx) => (
                        <li key={tIdx} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-blue-600 font-bold mt-1">•</span>
                          {tactic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded p-3">
                    <p className="text-sm font-medium text-green-900">
                      <span className="font-bold">Result:</span> {phase.result}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonial Component
interface TestimonialSectionProps {
  testimonial: CaseStudy['testimonial'];
}

export const TestimonialSection: React.FC<TestimonialSectionProps> = ({ testimonial }) => {
  if (!testimonial) return null;

  return (
    <section className="py-12 bg-blue-50">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          {/* Stars */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">★</span>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-xl text-gray-800 italic font-medium mb-6 leading-relaxed">
            &quot;{testimonial.quote}&quot;
          </blockquote>

          {/* Author */}
          <div className="flex items-center gap-4">
            {testimonial.image && (
              <img
                src={testimonial.image}
                alt={testimonial.author}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-bold text-gray-900">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.title}</p>
              <p className="text-sm text-gray-600">{testimonial.company}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
interface CTASectionProps {
  cta: CaseStudy['cta'];
}

export const CTASection: React.FC<CTASectionProps> = ({ cta }) => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4">{cta.headline}</h2>
        <p className="text-xl text-blue-100 mb-8 leading-relaxed">{cta.description}</p>
        
        <a
          href={cta.buttonLink}
          className="inline-block bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:shadow-lg hover:scale-105 transition"
        >
          {cta.buttonText}
        </a>

        <p className="text-sm text-blue-200 mt-6">
          Most founders we work with see results in 30-45 days.
        </p>
      </div>
    </section>
  );
};

// Main Case Study Page Component
interface CaseStudyPageProps {
  caseStudy: CaseStudy;
}

export const CaseStudyPage: React.FC<CaseStudyPageProps> = ({ caseStudy }) => {
  return (
    <div className="bg-white">
      {/* Header */}
      <header className="py-16 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            {caseStudy.clientLogo && (
              <img src={caseStudy.clientLogo} alt={caseStudy.clientName} className="h-12" />
            )}
            {caseStudy.yourLogo && (
              <>
                <span className="text-slate-500">×</span>
                <img src={caseStudy.yourLogo} alt="Our agency" className="h-12" />
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3">{caseStudy.title}</h1>
          <p className="text-xl text-slate-300 mb-6">{caseStudy.subtitle}</p>

          <div className="flex flex-wrap gap-4">
            {caseStudy.blockchain && (
              <span className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">
                {caseStudy.blockchain}
              </span>
            )}
            <span className="bg-purple-500 px-4 py-2 rounded-full text-sm font-semibold">
              {caseStudy.niche}
            </span>
            <span className="bg-slate-600 px-4 py-2 rounded-full text-sm font-semibold">
              {caseStudy.duration}
            </span>
          </div>
        </div>
      </header>

      {/* Hero Image */}
      {caseStudy.heroImage && (
        <div className="h-96 bg-gradient-to-b from-slate-100 to-slate-50 overflow-hidden">
          <img
            src={caseStudy.heroImage}
            alt="Case study"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Problem Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">The Challenge</h2>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">{caseStudy.problem.description}</p>
          
          <div className="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <p className="text-sm font-semibold text-slate-600 uppercase mb-4">They tried:</p>
            <ul className="space-y-3">
              {caseStudy.problem.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-red-500 font-bold text-lg">✗</span>
                  <span className="text-gray-700">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <StrategyTimeline phases={caseStudy.strategy.phases} />

      {/* Results Dashboard */}
      <ResultsDashboard metrics={caseStudy.results} />

      {/* Testimonial */}
      {caseStudy.testimonial && <TestimonialSection testimonial={caseStudy.testimonial} />}

      {/* ROI Section */}
      <ROISection roi={caseStudy.roi} />

      {/* CTA Section */}
      <CTASection cta={caseStudy.cta} />
    </div>
  );
};

export default {
  CaseStudyPage,
  ResultsDashboard,
  ROISection,
  ChannelBreakdown,
  StrategyTimeline,
  TestimonialSection,
  CTASection,
  MetricCard,
};
