export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverTrigger = 'click' | 'hover' | 'focus';

export interface PopoverProps {
  open?: boolean;
  placement?: PopoverPlacement;
  trigger?: PopoverTrigger;
  disabled?: boolean;
  modal?: boolean;
  arrow?: boolean;
  offset?: number;
  id?: string;
  class?: string;
  'aria-label'?: string;
  [key: string]: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wf-popover': PopoverProps;
    }
  }
}