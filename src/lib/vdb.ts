import { PrismaVectorStore } from "@langchain/community/vectorstores/prisma";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Prisma, type Document } from "@prisma/client";
import { AZURE_OPENAI_API_EMBEDDINGS_NAME } from '$env/static/private';
import { prisma } from "./db";

// Use the `withModel` method to get proper type hints for `metadata` field:
export const vectorStore = PrismaVectorStore.withModel<Document>(prisma).create(
    new OpenAIEmbeddings(
        {
            azureOpenAIApiEmbeddingsDeploymentName: AZURE_OPENAI_API_EMBEDDINGS_NAME,
        }
    ),
    {
        prisma: Prisma,
        tableName: "Document",
        vectorColumnName: "vector",
        columns: {
            id: PrismaVectorStore.IdColumn,
            content: PrismaVectorStore.ContentColumn,
        },
    }
);