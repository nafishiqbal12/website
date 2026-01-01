export interface Service {
  icon: string;
  title: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface CaseStudy {
  title: string;
  description: string;
  metrics: {
    reach: string;
    impressions: string;
    engagement: string;
  };
}

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
}
