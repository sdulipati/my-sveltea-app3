<svelte:options 
customElement= {{
  tag: 'wf-button',
  shadow: 'open',
}}   />
<script lang="ts" module>
    import type {HTMLAnchorAttributes, HTMLAttributes, HTMLButtonAttributes} from 'svelte/elements';
    import './Button.css';

    export type ButtonVariants = 'primary' | 'secondary' | 'tertiary';
    export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    export type ButtonProps = HTMLAnchorAttributes & HTMLButtonAttributes & {
        variant?: ButtonVariants;
        size?: ButtonSize;
        loading?: boolean;
        ref?: HTMLButtonElement | HTMLAnchorElement | null;
        class?: string;
        id?: string;
        warning?: boolean | string
        disabled?: boolean | string;
        'aria-label'?: string;
    };
    </script>
<script lang="ts">
    let {
        variant = 'primary',
        size = 'md',
        loading = false,
        class: className = '',
        id : providedId,
        warning = false,
        disabled,
        type = 'button',
        children,
        'aria-label': ariaLabel,
        ref, 
        ...restProps
    }: ButtonProps = $props();
    const id = $derived (providedId ?? `${variant}_button`);
    const isDisabled = $derived (disabled === true || disabled === 'true' );
    </script>

    <button
        class="wf-button wf-button--${variant} wf-button--${size} {warning === true || warning === 'true' ? 'wf-button-warning' : ''} {className || ''}"
        id={id}
        type={type}
        data-slot="button"
        disabled={isDisabled}
        aria-label={ariaLabel}
        aria-disabled={isDisabled}
        bind:this={ref}
        {...restProps}>
        
        <slot name = "icon-left"/>
        
        <slot></slot>

        <slot name = "icon-right"/>
        </button>

        <style src="./Button.css"></style>

   





 
  