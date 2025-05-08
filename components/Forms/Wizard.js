import React from 'react';
import { useRouter } from 'next/router';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
    { id: '01', name: 'Order details', href: '/form/first-step' },
    { id: '02', name: 'Add Services', href: '/form/second-step' },
    { id: '03', name: 'Review Order', href: '/form/review-step' },
    { id: '04', name: 'Submit Order', href: '/form/submit-step' }
];

const Wizard = () => {
    const router = useRouter();
    const activeStep = steps.findIndex((step) => step.href === router.pathname);
    
    return (
      <nav aria-label="Progress">
          <ol
            role="list"
            className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0"
          >
              {steps.map((step, stepIdx) => {
                  const isCompleted = stepIdx < activeStep;
                  const isActive = stepIdx === activeStep;
                  
                  return (
                    <li key={step.name} className="relative md:flex md:flex-1">
                        <a
                          href={step.href}
                          className={`${
                            isCompleted
                              ? 'flex'
                              : 'group flex'
                          } items-center px-6 py-4 text-sm font-medium`}
                          aria-current={isActive ? 'step' : undefined}
                        >
                <span
                  className={`${
                    isCompleted
                      ? 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800'
                      : 'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={`${
                        isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-gray-900'
                      }`}
                    >
                      {step.id}
                    </span>
                  )}
                </span>
                            <span
                              className={`${
                                isActive ? 'ml-4 text-sm font-medium text-indigo-600' : 'ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900'
                              }`}
                            >
                  {step.name}
                </span>
                        </a>
                        {stepIdx !== steps.length - 1 && (
                          <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                              <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none"
                                   preserveAspectRatio="none">
                                  <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke"
                                        stroke="currentcolor" strokeLinejoin="round" />
                              </svg>
                          </div>
                        )}
                    </li>
                  );
              })}
          </ol>
      </nav>
    );
};

export default Wizard;
