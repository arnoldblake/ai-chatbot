import { invoke } from '$lib/helpfull_ai';

//console.log(await invoke('I like to study music, and I would like to know what a mediant is, but I easily get confused. Can you help me?' ));

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        console.log(data);
    },
} satisfies Actions;