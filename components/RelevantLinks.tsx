'use client';

import React from 'react';

interface RelevantLinksProps {
  links: string[];
}

export default function RelevantLinks({ links }: RelevantLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  // Get the link name based on URL
  const getLinkName = (url: string) => {
    if (url.includes('emreg')) return 'Water Quality Maps (EMREG)';
    if (url.includes('industry.eea.europa.eu')) return 'Industrial Emissions Portal';
    if (url.includes('natura2000')) return 'Natura 2000 Viewer';
    return 'Relevant Link';
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
          {getLinkName(links[0])}
        </h4>
      </div>
      
      <div className="space-y-2">
        {links.map((link, index) => (
          <div key={index} className="flex items-start gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 underline break-all"
            >
              {link}
            </a>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
        💡 This link is automatically provided based on your question.
      </div>
    </div>
  );
}
