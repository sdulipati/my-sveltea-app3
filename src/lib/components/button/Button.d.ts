import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
import type { ButtonProps } from "./Button.svelte";

declare namespace JSX {
    interface IntrinsicElements {
        'wf-button': ButtonProps
    }
}
export type ButtonVariants = 'primary' | 'secondary' | 'tertiary' ;
export type ButtonSize = 'xs' | 'sm' | 'lg';

export interface ButtonProps extends HTMLButtonAttributes, HTMLAnchorAttributes {
    variant?: ButtonVariants;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    id?: string;
    ref?: HTMLButtonElement | HTMLAnchorElement | null;
    'aria-label'?: string;
    class?: string;
    [key: string]: any;
}
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'wf-button': ButtonProps
        }
    }
}