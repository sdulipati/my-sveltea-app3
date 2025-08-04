 import { sveltePreprocess } from "svelte-preprocess";
import { compile } from "svelte/compiler";

 const config = {
   preprocess: sveltePreprocess(),
   compileOptions: {
	 customElements: true,
	 runes:true
	    },
	};

export default config;