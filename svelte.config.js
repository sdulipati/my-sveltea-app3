 import { sveltePreprocess } from "svelte-preprocess";

 const config = {
   preprocess: sveltePreprocess(),
   compileOptions: {
	 customElement: true,
	 runes:true
	    },
	};

export default config;