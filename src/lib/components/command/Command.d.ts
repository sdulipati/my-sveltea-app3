export interface CommandProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  class?: string;
  id?: string;
  'aria-label'?: string;
  [key: string]: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wf-command': CommandProps;
    }
  }
}