import { fail } from '@sveltejs/kit';
import { writeFileSync, unlinkSync } from 'fs';
import { prisma } from '$lib/db.js';

// Document loader & Splitter
// TODO: Move this to a separate file
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const actions = {
    create: async ({ request, locals }) => {
        const file = Object.fromEntries(await request.formData()).file as File;
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }

        if (!file.name || file.name === 'undefined') {
            return fail(400, {
                error: true,
                message: 'You must provide a file to upload'
            });
        }

        // Write the file to the static folder
        writeFileSync(`static/${file.name}`, Buffer.from(await file.arrayBuffer()));

        // Insert the file into the database
        await prisma.file.create({
            data: {
                filename: file.name,
                size: file.size,
                userId: session.user.id
            }
        });
        // await db.insert(pgDocumentStore).values({
        //     filename: file.name,
        //     size: file.size,
        //     userId: session.user.id
        // });
    },
    delete: async ({ request, locals }) => {
        const data = Object.fromEntries(await request.formData());
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }

        // Delete the file from the database
        await prisma.file.delete({
            where: {
                id: data.id as string,
                userId: session.user.id
            }
        });
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
    }
};