import { CaseStudyPage, ChannelBreakdown, CTASection } from '../components/CaseStudyComponents';
import { lendingDAOCaseStudy } from '../lib/caseStudies/examples';

/**
 * Case Study Detail Page - LendingDAO
 * 
 * This page demonstrates the full case study component system.
 * It shows:
 * - Problem statement
 * - Strategy timeline with phases
 * - Results metrics dashboard
 * - Channel breakdown
 * - ROI analysis
 * - Testimonial
 * - CTA section
 * 
 * To add more case studies:
 * 1. Create new case study object in src/lib/caseStudies/examples.ts
 * 2. Create a new page file (e.g., CaseStudyswiftTrade.tsx)
 * 3. Import and render using <CaseStudyPage caseStudy={yourCaseStudy} />
 */

export default function LendingDAOCaseStudyPage() {
  // Array of channel breakdown data (key metrics by marketing channel)
  const channelBreakdown = [
    {
      name: 'Organic Search',
      percentage: 35,
      value: '$8M TVL from organic traffic',
      icon: '🔍'
    },
    {
      name: 'Community Referral',
      percentage: 28,
      value: '$12.6M TVL from word-of-mouth',
      icon: '👥'
    },
    {
      name: 'PR & Media',
      percentage: 18,
      value: '$8.1M TVL from earned media',
      icon: '📰'
    },
    {
      name: 'Strategic Partnerships',
      percentage: 12,
      value: '$5.4M TVL from integrations',
      icon: '🤝'
    },
    {
      name: 'Institutional Outreach',
      percentage: 7,
      value: '$3.2M TVL from VCs',
      icon: '🏦'
    }
  ];

  return (
    <div className="bg-white">
      {/* Main case study page using the reusable component */}
      <CaseStudyPage caseStudy={lendingDAOCaseStudy} />

      {/* Additional detailed sections */}

      {/* SEO Strategy Deep Dive */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">SEO Strategy: Organic Growth Engine</h2>
          <p className="text-gray-600 mb-8">
            {lendingDAOCaseStudy.seoStrategy.opportunity}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Keywords */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Keywords Targeted</h3>
              <div className="flex flex-wrap gap-2">
                {lendingDAOCaseStudy.seoStrategy.keywordsFocused.map((keyword: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>

            {/* Content Created */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Content Created</h3>
              <div className="space-y-3">
                {lendingDAOCaseStudy.seoStrategy.contentCreated.map((content: { title: string; result: string }, idx: number) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <p className="font-medium text-gray-900 text-sm">{content.title}</p>
                    <p className="text-xs text-green-600 mt-1">✓ {content.result}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-8">
            <p className="text-lg font-semibold mb-2">Organic Traffic Growth</p>
            <p className="text-4xl font-bold">{lendingDAOCaseStudy.seoStrategy.organicTrafficGrowth}</p>
          </div>
        </div>
      </section>

      {/* Community Growth Analytics */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Community Growth: 40x Expansion</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Platform Growth */}
            <div className="space-y-4">
              {lendingDAOCaseStudy.communityGrowth.platforms.map((platform: any, idx: number) => (
                <div key={idx} className="bg-slate-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">{platform.name}</h3>
                    <span className="text-green-600 font-bold">
                      {Math.round(((platform.after - platform.before) / platform.before) * 100)}% growth
                    </span>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">Before</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {(platform.before / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <div className="text-gray-400 flex items-center">→</div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase mb-1">After</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(platform.after / 1000).toFixed(1)}K
                      </p>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Tactics:</p>
                  <ul className="space-y-1">
                    {platform.tactics.slice(0, 3).map((tactic: string, tIdx: number) => (
                      <li key={tIdx} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        {tactic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Community Health Metrics</h3>

                <div className="space-y-4">
                  <div className="bg-white rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Net Promoter Score</span>
                      <span className="text-2xl font-bold text-blue-600">
                        {lendingDAOCaseStudy.communityGrowth.engagementMetrics.nps}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            ((lendingDAOCaseStudy.communityGrowth.engagementMetrics.nps ?? 0) / 100) * 100
                          }%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">World-class community satisfaction</p>
                  </div>

                  <div className="bg-white rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">30-Day Retention</span>
                      <span className="text-2xl font-bold text-green-600">
                        {lendingDAOCaseStudy.communityGrowth.engagementMetrics.retention}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${lendingDAOCaseStudy.communityGrowth.engagementMetrics.retention}%`
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Users coming back daily</p>
                  </div>

                  <div className="bg-white rounded p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">Viral Coefficient</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {lendingDAOCaseStudy.communityGrowth.engagementMetrics.virality}x
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Each user brings {lendingDAOCaseStudy.communityGrowth.engagementMetrics.virality} new users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PR Campaign Breakdown */}
      <section className="py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">PR Campaign: Earned Media Blitz</h2>
          <p className="text-gray-600 mb-8">{lendingDAOCaseStudy.prCampaign.strategy}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {lendingDAOCaseStudy.prCampaign.mediaOutlets.map((outlet: any, idx: number) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{outlet.name}</h3>
                <p className="text-sm text-gray-700 mb-3">{outlet.publication}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reach:</span>
                    <span className="font-semibold text-gray-900">{outlet.reach}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Backlink:</span>
                    <span className="font-semibold text-blue-600 text-right text-xs">
                      {outlet.backlink}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-purple-100 mb-2">Total Reach</p>
                <p className="text-4xl font-bold">{lendingDAOCaseStudy.prCampaign.totalReach}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-purple-100 mb-2">Media Value</p>
                <p className="text-4xl font-bold">{lendingDAOCaseStudy.prCampaign.mediaValue}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Channel Breakdown */}
      <ChannelBreakdown channels={channelBreakdown} />

      {/* Key Lessons */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Key Lessons & Takeaways</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lendingDAOCaseStudy.strategy.keyInsights.map((insight: string, idx: number) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="text-2xl font-bold text-blue-600 mb-3">
                  {idx + 1}
                </div>
                <p className="text-gray-700 leading-relaxed">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CTASection cta={lendingDAOCaseStudy.cta} />
    </div>
  );
}
