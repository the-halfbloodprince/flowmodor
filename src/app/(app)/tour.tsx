'use client';

import { Button } from '@nextui-org/button';
import { TourProvider, useTour } from '@reactour/tour';
import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import supabase from '@/utils/supabase';

const steps = [
  {
    selector: '#start-stop-button',
    content: 'Click this button to start the focus session.',
  },
  {
    selector: '#progress',
    content: 'Timer progress will be displayed here. Wait for 10 seconds.',
  },
  {
    selector: '#start-stop-button',
    content: 'Click this button to stop the focus session.',
  },
  {
    selector: '#progress',
    content: 'Break length will be your focus session duration divided by 5.',
  },
  {
    selector: '#start-stop-button',
    content: 'Click this button to start the break session.',
  },
  {
    selector: '#progress',
    content: 'Timer will count down to 0 and then notify you.',
  },
  {
    selector: 'body',
    content:
      'Congratulations! You have completed the tutorial. Enjoy Flowmodor!',
  },
];

function NextButton() {
  const { currentStep, setCurrentStep, setIsOpen } = useTour();

  if (currentStep === 3) {
    return (
      <Button
        color="primary"
        size="sm"
        className="ml-auto"
        onPress={() => {
          setCurrentStep(currentStep + 1);
        }}
      >
        Next
      </Button>
    );
  }

  if (currentStep === 6) {
    return (
      <Button
        color="primary"
        size="sm"
        className="ml-auto"
        onPress={async () => {
          setIsOpen(false);
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            console.error('User not found');
            return;
          }

          const { error } = await supabase
            .from('profiles')
            .update({ is_new: false })
            .eq('user_id', user.id);
          if (error) {
            console.error(error);
          }
        }}
      >
        Great!
      </Button>
    );
  }

  return null;
}

// eslint-disable-next-line import/prefer-default-export
export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        mixpanel.identify(data.user.id);
      }
    })();
  }, []);

  return children;
}

export function TourCustomProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TourProvider
      className="rounded-lg"
      showDots={false}
      showCloseButton={false}
      onClickMask={() => null}
      steps={steps}
      styles={{
        badge: (base) => ({
          ...base,
          backgroundColor: '#D6B6FF',
          color: '#131221',
        }),
        popover: (base) => ({
          ...base,
          backgroundColor: '#23223C',
          color: '#ffffff',
          borderRadius: '10px',
        }),
        dot: (base) => ({
          ...base,
          backgroundColor: '#D6B6FF',
        }),
      }}
      prevButton={() => null}
      nextButton={NextButton}
    >
      {children}
    </TourProvider>
  );
}
