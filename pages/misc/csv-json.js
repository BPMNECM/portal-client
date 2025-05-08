import CustomLink from '../../components/Shared/CustomLink';
import useOrderStore from '../../store/useOrderStore';
import { Fragment } from 'react';

export default function CSV2JSON() {
    const { csvToJsonData } = useOrderStore();
    
    return (
      <Fragment>
          <div className="space-y-12 sm:space-y-16 pb-80">
              <div
                className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y
                sm:divide-gray-900/10 sm:border-t sm:pb-0">
                  <h4>CSV to JSON Converter</h4>
                  <CustomLink href="/form/second-step" className="mt-2">
                      ← Back to Wizard
                  </CustomLink>
                  <pre className="mt-8 overflow-x-auto">
                      {JSON.stringify({ csvToJsonData }, null, 2)}
            </pre>
              </div>
          </div>
      </Fragment>
    );
}
