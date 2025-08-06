<svelte:options
  customElement={{
    tag: 'wf-combobox',
    shadow: 'open',
  }}
/>
<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { FontAwesomeIcon } from "fontawesome-svelte";
  import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
  import { faSearch } from "@fortawesome/free-solid-svg-icons";

  type ComboBoxOption = { label: string; value: string; disabled?: boolean };

  // Props
  const {
    options = [],
    placeholder = "Select option...",
    value: propValue = null,
    disabled = false,
    trigger = 'click',
    placement = 'bottom',
    arrow = true,
    inputPlaceholder = "Search...",
    icon = faChevronDown,
    inputIcon = faSearch,
    onSelect = () => {},
  } = $props<{
    options?: ComboBoxOption[];
    placeholder?: string;
    value?: string | null;
    disabled?: boolean;
    trigger?: string;
    placement?: string;
    arrow?: boolean;  
    inputPlaceholder?: string;
    icon?: any;
    inputIcon?: any;
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
  <wf-popover open={open} onopen-change={(e: CustomEvent) => { open = e.detail}}
     placement={placement} trigger="click" arrow={arrow} >
    <button
      slot="trigger"
      class="wf-combobox-trigger"
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      disabled={disabled}
      onclick={() => (open = !open)}
    >
      {inputValue || placeholder}
      <FontAwesomeIcon icon={icon} class="wf-combobox-input-icon" />
      <!-- <svg class="wf-combobox-chevron" width="16" height="16" fill="none" viewBox="0 0 24 24">
        <path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg> -->
    </button>
    <wf-command  placeholder={inputPlaceholder} icon={inputIcon}>
      {#each filtered as option}
        <div
          class="wf-command-item"
          aria-selected={option.value === selectedValue}
          data-disabled={option.disabled ? true : undefined}
          onclick={() => handleSelect(option)}
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
