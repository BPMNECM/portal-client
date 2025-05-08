import useOrderStore from '@/store/useOrderStore';
import { Fragment } from 'react';
import CustomLink from '@/components/Shared/CustomLink';
import { Button, CopyButton, Flex } from '@mantine/core';

export default function ReviewOrder() {
    const { transformedData } = useOrderStore();
    
    return (
      <Fragment>
          <div className="space-y-12 pb-12">
              <div className="mt-10 space-y-8  sm:border-t sm:pb-0">
                  <h4>Review Order before submission</h4>
                  <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    gap={{ base: 'sm', sm: 'lg' }}
                    justify={{ sm: 'left' }}
                  >
                      <CustomLink href="/form/submit-step" className="mt-6">
                          ← Back to Review page
                      </CustomLink>
                      <CopyButton value={JSON.stringify({ transformedData }, null, 4)}>
                          {({ copied, copy }) => (
                            <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                                {copied ? 'Copied data' : 'Copy data'}
                            </Button>
                          )}
                      </CopyButton>
                  </Flex>
                  <pre className="mt-2 overflow-x-auto">
                      {JSON.stringify({ transformedData }, null, 4)}
            </pre>
              </div>
          </div>
      </Fragment>
    );
}
