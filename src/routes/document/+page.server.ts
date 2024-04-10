import { fail } from '@sveltejs/kit';
import { writeFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { prisma } from '$lib/db.js';
import { vectorStore } from '$lib/vdb.js';

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

        // Check if the directory already exists
        if (!existsSync(`static/${session.user.id}`)) {
            // Create the directory
            mkdirSync(`static/${session.user.id}`);
        }

        // Check if the file already exists
        if (existsSync(`static/${session.user.id}/${file.name}`)) {
            // File already exists return an error TODO: Implement toast to show this error
            return fail(400, {
                error: true,
                message: 'File already exists'
            });
        } else {
            // Write the file to the static folder
            writeFileSync(`static/${session.user.id}/${file.name}`, Buffer.from(await file.arrayBuffer()));

            // Insert the file into the database
            await prisma.file.create({
                data: {
                    filename: file.name,
                    size: file.size,
                    userId: session.user.id
                }
            });
        }
    },
    delete: async ({ request, locals }) => {
        const file = Object.fromEntries(await request.formData());
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
                id: file.id as string,
                userId: session.user.id
            }
        });
        unlinkSync(`static/${session.user.id}/${file.filename}`);
    },
    vectorize: async ({ request, locals }) => {
        const file = Object.fromEntries(await request.formData());
        const session = await locals.auth();
        if (!session?.user?.id) {
            return fail(401, {
                error: true,
                message: 'You must be logged in.'
            });
        }

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });

        const loader = new TextLoader(`static/${session.user.id}/${file.filename}`);
        const doc = await loader.load();
        const docs = await splitter.splitDocuments([...doc]);

        await vectorStore.addModels(await prisma.$transaction(
            docs.map((content) => prisma.document.create({
                data: {
                    content: content.pageContent,
                    file: {
                        connect: {
                            id: file.id as string
                        }
                    }
                }
            }))
        ));
    }
};