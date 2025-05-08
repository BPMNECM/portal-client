import React, { Fragment } from 'react';

const Footer = () => {
    return (
      <Fragment>
          <div
            className="relative isolate overflow-hidden border-t border-gray-900/10">
              <footer className="text-sm text-center py-4 inset-x-40 top-28 z-20 text-gray-900">
                  
                  <div className="container">
                    <span className="text-gray dark:text-defaulttextcolor/50"> Global Media Network © <span
                      id="year"></span>
                        <a href="https://confluence.tools.company.com/display/MNIPM/Global+Media+Network"
                           className="text-defaulttextcolor font-semibold dark:text-defaulttextcolor"> MNIPM</a>
                    </span>
                      <div
                        className="absolute left-0 top-full -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-ml-96 sm:-mt-10 sm:translate-y-0 sm:rotate-0 sm:transform-gpu sm:opacity-50"
                        aria-hidden="true"
                      >
                          <div
                            className="aspect-[1154/678] w-[72.125rem] bg-gradient-to-br from-[#FF80B5] to-[#9089FC]"
                            style={{
                                clipPath:
                                  'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)'
                            }}
                          />
                      </div>
                  </div>
              </footer>
          </div>
      </Fragment>
    );
};

export default Footer;
