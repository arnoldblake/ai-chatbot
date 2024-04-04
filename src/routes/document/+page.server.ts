import { fail } from '@sveltejs/kit';
import { writeFileSync, unlinkSync } from 'fs';
import { pgvectorStore, db } from '$lib/db';
import { pgDocumentStore } from '$lib/schema';

// Document loader & Splitter
// TODO: Move this to a separate file
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const actions = {
    create: async ({ request, locals }) => {
        const file = Object.fromEntries(await request.formData()).file as File;

        if (!file.name || file.name === 'undefined') {
            return fail(400, {
                error: true,
                message: 'You must provide a file to upload'
            });
        }

        // Write the file to the static folder
        writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

        const session = await locals.auth();
        if (session && session.user && session.user.id) {
            await db.insert(pgDocumentStore).values({
                filename: file.name,
                size: file.size,
                userId: session.user.id
            });
        }
    },
    delete: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());
        await db.delete(pgDocumentStore).where(eq(pgDocumentStore.id, data.id as string));
        unlinkSync(`static/${data.filename}`);
    },
    vectorize: async ({ request }) => {
        const data = Object.fromEntries(await request.formData());

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const loader = new TextLoader(`static/${data.filename}`);
        const docs = await loader.load();

        const docOutput = await splitter.splitDocuments([...docs
        ]);

        const result = await pgvectorStore.addDocuments(docOutput);

        console.log(result);
    }
};