import { CaseStudyPage } from '../components/CaseStudyComponents';
import { lendingDAOCaseStudy } from '../lib/caseStudies/examples';

/**
 * Sample Case Study Page
 * This page displays the LendingDAO case study using the reusable CaseStudyPage component
 * 
 * To add additional case studies:
 * 1. Create new case study objects in src/lib/caseStudies/examples.ts
 * 2. Import them here and use <CaseStudyPage caseStudy={yourCaseStudy} />
 * 3. Add routing in your router configuration
 */

export default function CaseStudyDetailPage() {
  return <CaseStudyPage caseStudy={lendingDAOCaseStudy} />;
}
