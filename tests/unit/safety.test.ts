import { evaluateSubmissionSafety } from '@/lib/alternatives/safety';

describe('Automated Instant Safety Engine', () => {
  test('approves legitimate builder submissions', () => {
    const valid = {
      name: 'Kagi Assistant',
      url: 'https://kagi.com',
      description: 'Privacy-focused search engine with direct AI answers.',
      creator_email: 'team@kagi.com',
    };

    const res = evaluateSubmissionSafety(valid);
    expect(res.isSafe).toBe(true);
  });

  test('blocks scam or spam keywords', () => {
    const spam = {
      name: 'Best Casino Online',
      url: 'https://casino-win.com',
      description: 'Play online casino and win big prizes.',
      creator_email: 'spammer@spam.com',
    };

    const res = evaluateSubmissionSafety(spam);
    expect(res.isSafe).toBe(false);
    expect(res.reason).toContain('restricted');
  });

  test('blocks direct binary or executable downloads', () => {
    const malicious = {
      name: 'Free Tool Installer',
      url: 'https://malware.com/installer.exe',
      description: 'Download the fast installer right now.',
      creator_email: 'dev@malware.com',
    };

    const res = evaluateSubmissionSafety(malicious);
    expect(res.isSafe).toBe(false);
    expect(res.reason).toContain('Direct binary downloads');
  });

  test('blocks private cloud metadata endpoints', () => {
    const ssrf = {
      name: 'SSRF Exploit',
      url: 'http://169.254.169.254/latest/meta-data',
      description: 'Testing internal cloud metadata service.',
      creator_email: 'hacker@test.com',
    };

    const res = evaluateSubmissionSafety(ssrf);
    expect(res.isSafe).toBe(false);
    expect(res.reason).toContain('Private IP addresses');
  });
});
