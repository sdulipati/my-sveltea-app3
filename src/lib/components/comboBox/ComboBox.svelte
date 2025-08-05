<svelte:options
  customElement={{
    tag: 'wf-combobox',
    shadow: 'open',
  }}
/>
<script lang="ts">
  import { createEventDispatcher } from "svelte";

  type ComboBoxOption = { label: string; value: string; disabled?: boolean };

  // Props
  const {
    options = [],
    placeholder = "Select option...",
    value: propValue = null,
    disabled = false,
    onSelect = () => {},
  } = $props<{
    options?: ComboBoxOption[];
    placeholder?: string;
    value?: string | null;
    disabled?: boolean;
    onSelect?: (option: ComboBoxOption) => void;
  }>();

  console.log("options prop:", options);
  let parsedOptions = $derived(
    typeof options === "string"
      ? (() => {
          try {
            return JSON.parse(options);
          } catch {
            return [];
          }
        })()
      : options
  );

  console.log("parsed options prop:", parsedOptions);

  const dispatch = createEventDispatcher();

  let open = false;
  let selectedValue: string | null = propValue;
  let inputValue: string = parsedOptions.find((opt) => opt.value === propValue)?.label ?? "";
  console.log("inputValue:", inputValue);

  function handleSelect(option: ComboBoxOption) {
    if (option.disabled) return;
    selectedValue = option.value;
    inputValue = option.label;
    open = false;
    onSelect(option);
    dispatch("select", option); // for parent binding
  }

  let filtered = $derived(
    parsedOptions.filter(
      (opt) => opt.label.toLowerCase().includes(inputValue.toLowerCase())
    )
  );
  console.log("filtered options:", filtered);
</script>

<div class="wf-combobox">
  <wf-popover open={open} on:open-change={e => open = e.detail} placement="bottom-start" trigger="manual" arrow>
    <button
      slot="trigger"
      class="wf-combobox-trigger"
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      disabled={disabled}
      on:click={() => (open = !open)}
    >
      {inputValue || placeholder}
      <svg class="wf-combobox-chevron" width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </button>
    <wf-command  placeholder="Search..." style="min-width: 200px;">
      {#each filtered as option}
        <div
          class="wf-command-item"
          aria-selected={option.value === selectedValue}
          data-disabled={option.disabled ? true : undefined}
          on:click={() => handleSelect(option)}
          tabindex={option.disabled ? -1 : 0}
        >
          {option.label}
        </div>
      {/each}
      {#if filtered.length === 0}
        <div slot="empty" class="wf-command-empty">No results found.</div>
      {/if}
    </wf-command>
  </wf-popover>
</div>

<style src="./ComboBox.css"></style>
