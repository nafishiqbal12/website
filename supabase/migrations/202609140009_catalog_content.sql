insert into public.catalog_services (
  pillar_id,
  code,
  name,
  description,
  is_active
)
select
  pillar.id,
  seed.code,
  seed.name,
  seed.description,
  true
from (
  values
    ('BUILD', 'CLOUD_DEVOPS_INFRASTRUCTURE', 'Cloud & DevOps Infrastructure', 'Cloud infrastructure, Linux, Docker, CI/CD, deployment, infrastructure automation, and production readiness for Web3 projects.'),
    ('BUILD', 'INFRASTRUCTURE_RELIABILITY_SECURITY', 'Infrastructure Reliability & Security', 'Monitoring setup, backups, security baseline, and technical documentation for dependable infrastructure operations.'),
    ('AUTOMATE', 'CUSTOM_AI_AGENTS', 'Custom AI Agents', 'Custom AI agents for support, research, reporting, internal workflows, and project-specific automation with governed human oversight.'),
    ('AUTOMATE', 'COMMUNITY_SOCIAL_AUTOMATION', 'Community & Social Automation', 'Discord, community, social media, and content-related automation workflows within approved project boundaries.'),
    ('AUTOMATE', 'DEVOPS_MONITORING_AUTOMATION', 'DevOps & Monitoring Automation', 'Automation for DevOps and monitoring workflows with controlled operational boundaries and human checkpoints.'),
    ('OPERATE', 'MANAGED_DEVOPS_OPERATIONS', 'Managed DevOps Operations', 'Infrastructure monitoring, maintenance, deployment support, CI/CD management, cloud optimization, and operational reporting.'),
    ('OPERATE', 'SECURITY_PERFORMANCE_OPERATIONS', 'Security & Performance Operations', 'Security maintenance, performance optimization, incident support, and AI-agent maintenance where explicitly scoped.'),
    ('GROW', 'CONTENT_COMMUNITY_AUTOMATION', 'Content & Community Automation', 'Content workflows, social media automation, and community automation connected to product and delivery readiness.'),
    ('GROW', 'GROWTH_ANALYTICS_SEO_SUPPORT', 'Growth Analytics & SEO Support', 'SEO support and growth analytics focused on technical readiness, authority, trust, and delivery-aligned feedback.'),
    ('GROW', 'CAMPAIGN_CONTENT_DISTRIBUTION', 'Campaign & Content Distribution', 'Campaign automation and content distribution workflows without legacy token-promotion or agency-package positioning.')
) as seed(pillar_code, code, name, description)
join public.catalog_pillars as pillar on pillar.code = seed.pillar_code
on conflict (code) do nothing;

insert into public.service_offerings (
  service_id,
  version,
  name,
  description,
  scope_template,
  billing_mode,
  is_active,
  display_order
)
select
  service.id,
  1,
  seed.offering_name,
  seed.offering_description,
  seed.scope_template::jsonb,
  seed.billing_mode,
  true,
  seed.display_order
from (
  values
    ('CLOUD_DEVOPS_INFRASTRUCTURE', 'Core implementation scope', 'Initial cloud and DevOps infrastructure scope defined with the client project team.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 10),
    ('INFRASTRUCTURE_RELIABILITY_SECURITY', 'Core implementation scope', 'Initial reliability, security baseline, backup, monitoring setup, and documentation scope.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 20),
    ('CUSTOM_AI_AGENTS', 'Core automation scope', 'Initial custom AI-agent and governed workflow automation scope.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 30),
    ('COMMUNITY_SOCIAL_AUTOMATION', 'Core automation scope', 'Initial community, social, and content automation scope within approved boundaries.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 40),
    ('DEVOPS_MONITORING_AUTOMATION', 'Core automation scope', 'Initial DevOps and monitoring workflow automation scope with human checkpoints.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 50),
    ('MANAGED_DEVOPS_OPERATIONS', 'Managed operations scope', 'Ongoing managed DevOps operations scope after an agreed implementation or handover boundary.', '{"scope": "ongoing_operations"}', 'RECURRING', 60),
    ('SECURITY_PERFORMANCE_OPERATIONS', 'Managed operations scope', 'Ongoing security, performance, incident, and explicitly scoped AI-agent maintenance operations.', '{"scope": "ongoing_operations"}', 'RECURRING', 70),
    ('CONTENT_COMMUNITY_AUTOMATION', 'Core growth scope', 'Initial content and community automation scope connected to product and delivery readiness.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 80),
    ('GROWTH_ANALYTICS_SEO_SUPPORT', 'Core growth scope', 'Initial growth analytics and SEO support scope without fixed pricing or outcome guarantees.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 90),
    ('CAMPAIGN_CONTENT_DISTRIBUTION', 'Core growth scope', 'Initial campaign automation and content distribution scope.', '{"scope": "implementation"}', 'ONE_TIME_AND_RECURRING', 100)
) as seed(service_code, offering_name, offering_description, scope_template, billing_mode, display_order)
join public.catalog_services as service on service.code = seed.service_code
on conflict (service_id, version) do nothing;

comment on table public.catalog_services is
  'Approved Phase 15.2 grouped service catalog content. Prices and commercial terms are intentionally deferred.';
comment on table public.service_offerings is
  'Approved Phase 15.2 unpriced offering configuration. Billing mode is descriptive metadata only.';
