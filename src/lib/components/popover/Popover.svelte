<svelte:options
  customElement={{
    tag: 'wf-popover',
    shadow: 'open',
  }}
/>
<script lang="ts" module>
  import './Popover.css';

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
</script>
<script lang="ts">
  let {
    open = false,
    placement = 'bottom',
    trigger = 'click',
    disabled = false,
    modal = false,
    arrow = false,
    offset = 8,
    arrowWidth = 8,
    arrowHeight = 8,
    class: className = '',
    id: providedId,
    'aria-label': ariaLabel,
    ...restProps
  }: PopoverProps = $props();

  let arrowRef: HTMLDivElement | null = null;

  const isDisabled = $derived(disabled === true || disabled === 'true' || disabled === '');
  const id = $derived(providedId ?? `popover_${placement}`);
  let isOpen = $derived(open);

  function handleClick() {
    if (isDisabled) return;
    if (trigger === 'click') isOpen = !isOpen;
  }
  function handleMouseEnter() {
    if (isDisabled) return;
    if (trigger === 'hover') isOpen = true;
  }
  function handleMouseLeave() {
    if (isDisabled) return;
    if (trigger === 'hover') isOpen = false;
  }
  function handleFocus() {
    if (isDisabled) return;
    if (trigger === 'focus') isOpen = true;
  }
  function handleBlur() {
    if (isDisabled) return;
    if (trigger === 'focus') isOpen = false;
  }

  let popoverRoot: HTMLElement;
  let triggerSlot: HTMLSlotElement;

  function attachTriggerListeners() {
    if (!triggerSlot) return;
    const nodes = triggerSlot.assignedElements ? triggerSlot.assignedElements() : [];
    const triggerEl = nodes[0];
    if (!triggerEl) return;

    // Remove previous listeners if any
    triggerEl.removeEventListener('focus', handleFocus);
    triggerEl.removeEventListener('blur', handleBlur);

    // Add listeners
    triggerEl.addEventListener('focus', handleFocus);
    triggerEl.addEventListener('blur', handleBlur);
  }

  function slotAction(node: HTMLElement) {
    // Find the slot element inside this node
    const slot = node.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    if (!slot) return;

    function handleSlotChange() {
      const nodes = slot.assignedElements ? slot.assignedElements() : [];
      const triggerEl = nodes[0];
      if (!triggerEl) return;

      // Remove previous listeners if any
      triggerEl.removeEventListener('focus', handleFocus);
      triggerEl.removeEventListener('blur', handleBlur);

      // Add listeners
      triggerEl.addEventListener('focus', handleFocus);
      triggerEl.addEventListener('blur', handleBlur);
    }

    slot.addEventListener('slotchange', handleSlotChange);
    // Call once in case slot is already filled
    handleSlotChange();

    return {
      destroy() {
        slot.removeEventListener('slotchange', handleSlotChange);
        // Optionally remove listeners from triggerEl if needed
      }
    };
  }

  // Close on outside click
  $effect(() => {
    if (!isOpen || isDisabled) return;

    function handleDocumentClick(event: MouseEvent) {
      if (!popoverRoot) return;
      if (!popoverRoot.contains(event.target as Node)) {
        isOpen = false;
      }
    }

    document.addEventListener('mousedown', handleDocumentClick, true);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick, true);
    };
  });
</script>

<div
  bind:this={popoverRoot}
  class="wf-popover {className} {modal ? 'wf-popover--modal' : ''}"
  id={id}
  aria-label={ariaLabel}
  aria-expanded={isOpen}
  aria-disabled={isDisabled}
  style="--popover-offset: {offset}px;"
  {...restProps}
>
  <div
    class="wf-popover-trigger"
    tabindex={isDisabled ? -1 : 0}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    aria-disabled={isDisabled}
    use:slotAction
  >
    <slot name="trigger" />
  </div>
  {#if isOpen && !isDisabled}
    <div
      class="popover-content wf-popover--{placement}"
      data-state={isOpen ? 'open' : 'closed'}
      data-side={placement}
      role={modal ? 'dialog' : 'tooltip'}
    >
      {#if arrow}
        <div
          class="wf-popover-arrow"
          data-arrow
          data-popover-arrow
          bind:this={arrowRef}
          style="width: {arrowWidth}px; height: {arrowHeight}px;"
        ></div>
      {/if}
      <slot />
    </div>
  {/if}
</div>

<style src="./Popover.css"></style>