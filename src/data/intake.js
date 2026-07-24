// Build Assessment intake — the multi-step form's questions, options, and copy.
// Data, not markup: src/components/AssessmentIntake.astro maps over `intake.steps` and
// renders each field by `type`. To reword a question or add an option, edit it here.
//
// Pattern ported (not the code) from the chelancomps volunteer application
// (Cloudbase-Foundation/chelan-comps → src/components/form/VolunteerMultiStepForm.tsx):
// stepped flow, per-step validation, progress bar, localStorage draft, review-before-submit.
// The React/Radix/Tailwind stack there does not exist on this framework-free site, so the
// wizard is reimplemented in vanilla JS on this site's own FeedbackWidget/feedback.js building
// blocks. See .temp/PLANNING.md → Go-to-market → Build Assessment.
//
// Field types the component understands: 'textarea' | 'select' | 'radio' | 'text' | 'email'.
// Only `description`, `name`, and `email` are required (mirrors the server validation in
// functions/api/assessment-intake.js). Everything else is optional by design — low friction.

import { contact } from './site.js';

export const intake = {
  // Short lead above the wizard (plainest register, per docs/voice-and-style.md).
  lead:
    'A few questions before we talk. Takes a couple of minutes, and I read every one myself — it’s how I show up to the call already knowing your situation.',

  steps: [
    {
      id: 'problem',
      title: 'The problem',
      legend: 'What are you trying to build or fix?',
      fields: [
        {
          name: 'situation',
          type: 'select',
          label: 'What best describes it?',
          // Mirrors the five contact-page prompts (site.js → contact.prompts), condensed.
          options: [
            'Wrong platform — something needs migrating',
            'A process held together by email and spreadsheets',
            'A mission with no working infrastructure behind it',
            'Figuring out what to actually do with AI',
            'Something half-built that needs finishing',
            'Something else',
          ],
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Tell me what’s going on',
          required: true,
          rows: 5,
          placeholder:
            'In your own words — what isn’t working, and what you wish it did instead.',
        },
      ],
    },
    {
      id: 'stand',
      title: 'Where it stands',
      legend: 'Where is it right now?',
      fields: [
        {
          name: 'stage',
          type: 'radio',
          label: 'How far along is it?',
          options: [
            'Just an idea right now',
            'Started, and stuck',
            'Half-built',
            'Live, but breaking',
            'Not sure',
          ],
        },
        {
          name: 'tried',
          type: 'textarea',
          label: 'What have you already tried?',
          rows: 4,
          placeholder: 'Optional — tools, people, past attempts, anything that didn’t stick.',
        },
      ],
    },
    {
      id: 'shape',
      title: 'Shape & timing',
      legend: 'The shape of it',
      fields: [
        {
          name: 'timeline',
          type: 'select',
          label: 'Timeline',
          // Single-sourced with the contact form's timeline picker.
          options: contact.timelineOptions,
        },
        {
          name: 'budget_band',
          type: 'select',
          label: 'Have you set aside a budget for this?',
          options: [
            'Haven’t thought about it yet',
            'Exploring — no budget set',
            'A rough range in mind',
            'Budgeted and ready to move',
          ],
        },
        {
          name: 'links',
          type: 'text',
          label: 'Anything I can look at?',
          placeholder: 'Site, repo, or doc — optional',
        },
      ],
    },
    {
      id: 'about',
      title: 'About you',
      legend: 'And you',
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true, autocomplete: 'name' },
        { name: 'email', type: 'email', label: 'Email', required: true, autocomplete: 'email' },
        { name: 'org', type: 'text', label: 'Organization or project', placeholder: 'Optional' },
        {
          name: 'referral',
          type: 'text',
          label: 'How did you hear about me?',
          placeholder: 'Optional',
        },
      ],
    },
  ],

  reviewTitle: 'Review & send',
  reviewNote: 'Everything you entered above gets sent straight to me.',
  submitLabel: 'Send intake',

  confirm: {
    heading: 'Got it.',
    body:
      'I read every intake myself. I’ll look yours over and reach out within a few days to set up a call — or to tell you straight if I’m not the right person for it.',
  },
};
