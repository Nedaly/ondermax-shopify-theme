module.exports = {
  ci: {
    collect: {
      url: [
        `${process.env.BASE_URL || 'http://localhost:9292'}/`,
        `${process.env.BASE_URL || 'http://localhost:9292'}/?locale=ar`,
        `${process.env.BASE_URL || 'http://localhost:9292'}/?locale=he`,
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.85 }],
        'categories:best-practices': ['error', { minScore: 0.85 }],
        'categories:seo': ['error', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
