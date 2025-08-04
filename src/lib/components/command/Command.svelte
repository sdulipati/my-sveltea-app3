<svelte:options
  customElement={{
    tag: 'wf-command',
    shadow: 'open',
  }}
/>

<script lang="ts" module>
  import './Command.css';

  export interface CommandProps {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    class?: string;
    id?: string;
    'aria-label'?: string;
    [key: string]: any;
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";

  let {
    value = '',
    placeholder = 'Type a command or search…',
    disabled = false,
    class: className = '',
    id: providedId,
    'aria-label': ariaLabel,
    ...restProps
  }: CommandProps = $props();

  let inputRef: HTMLInputElement | null = null;
  let commandRoot: HTMLElement;
  let commandListRef: HTMLDivElement;
  let customElement: HTMLElement;
  let slotEl: HTMLSlotElement;
  let emptyContentEl: HTMLElement | null = null;


  let items: HTMLElement[] = [];
  let filteredItems: HTMLElement[] = [];

  function handleInput(event: Event) {
    value = (event.target as HTMLInputElement).value;
    filterItems();
  }

  function filterItems() {
    const allItems: HTMLElement[] = [];

    // Find all group containers in the light DOM (host element)
    const groups = customElement.querySelectorAll('[data-slot="command-group"]');
    groups.forEach((group) => {
      Array.from(group.children).forEach((groupChild) => {
        if (!groupChild.classList.contains("wf-command-group-heading")) {
          allItems.push(groupChild as HTMLElement);
        }
      });
    });

    // Find all direct items (not in groups, not empty/group slots)
    customElement.querySelectorAll(
      ':scope > div:not([data-slot="command-group"]):not([data-slot="command-empty"])'
    ).forEach((el) => {
      allItems.push(el as HTMLElement);
    });

    items = allItems;

    if (value.trim() === "") {
      filteredItems = items;
    } else {
      filteredItems = items.filter((el) =>
        el.textContent?.toLowerCase().includes(value.toLowerCase())
      );
    }

    filteredItems = [...filteredItems]; // <-- This triggers Svelte to update the DOM

    // Show/hide items
    items.forEach((el) => {
      el.style.display = filteredItems.includes(el) ? "" : "none";
    });

    // Show/hide groups if all their children are hidden
    groups.forEach((group) => {
      const visible = Array.from(group.children).some(
        (groupChild) =>
          !groupChild.classList.contains("wf-command-group-heading") &&
          (groupChild as HTMLElement).style.display !== "none"
      );
      (group as HTMLElement).style.display = visible ? "" : "none";
    });
    emptyContentEl = customElement.querySelector('[slot="empty"]');
  if (emptyContentEl) {
    emptyContentEl.style.display =
      value.trim() !== "" && filteredItems.length === 0 ? "" : "none";
  }
    console.log("Filtered items:", filteredItems);
    console.log("value", value);
  }

  // Get the custom element instance on mount
  onMount(() => {
    // The custom element instance is the parentNode of the shadowRoot
    customElement = commandRoot.getRootNode().host as HTMLElement;
    filterItems();
  });

  // Run filter after every update (input or slot change)
  $effect(() => {
    if (customElement) filterItems();
  });
  
</script>

<div
  bind:this={commandRoot}
  class="wf-command {className}"
  id={providedId}
  aria-label={ariaLabel}
  aria-disabled={disabled}
  {...restProps}
>
  <div class="wf-command-input-wrapper" data-slot="command-input-wrapper">
    <svg class="wf-command-search-icon" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
      <path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <input
      class="wf-command-input"
      bind:this={inputRef}
      type="text"
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      on:input={handleInput}
      data-slot="command-input"
    />
  </div>
  <div class="wf-command-list" data-slot="command-list" bind:this={commandListRef}>
    <slot />
    <slot name="empty" data-slot="command-empty" />
    <slot name="group" data-slot="command-group" />
  </div>
</div>

<style src="./Command.css"></style>